import dotenv from "dotenv";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { createRequire } from "module";
import ora from "ora";
import chalk from "chalk";
import { ed25519 } from "@noble/curves/ed25519";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { randomBytes } from "crypto";
import { HDKey } from "@scure/bip32";
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import {
  NetworkId as ZswapNetworkId,
  nativeToken,
} from "@midnight-ntwrk/zswap";
import {
  setNetworkId,
  NetworkId as GlobalNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";
import {
  configureProviders,
  waitForFunds,
} from "./providers.js";
import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";

// ✅ createRequire for CommonJS artifacts
const customRequire = createRequire(import.meta.url);

// ✅ resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ load env
dotenv.config({ path: path.resolve(path.dirname(__filename), "..", ".env") });

// ✅ initialize jiti
const jiti = customRequire("jiti")(__filename);

// --------------------
// Config typing
// --------------------
interface DeployConfig {
  deployerHexSeed?: string;
  contracts: {
    name: string;
    path: string;
    init?: (keys: {
      privateKey: Uint8Array;
      publicKey: Uint8Array;
    }) => {
      circuit: string;
      args: Record<string, unknown>;
    };
  }[];
}

// --------------------
// Deploy function
// --------------------
export async function deploy(
  configPath: string,
  quickDeploy: boolean,
  providedSeed?: string
) {
  const spinner = ora("Initializing deployment...").start();

  try {
    const configFilePath = path.resolve(process.cwd(), configPath);

    // reload env for project-local .env
    dotenv.config({ path: path.resolve(path.dirname(configFilePath), ".env") });

    // ✅ Load config with typing
    const config = jiti(configFilePath) as DeployConfig;

    let deployerHexSeed: string | undefined;

    if (quickDeploy) {
      deployerHexSeed = bytesToHex(randomBytes(32));
      spinner.text = chalk.yellow(
        "Quick deploy: Generated random hex seed for deployer."
      );
    } else if (providedSeed) {
      deployerHexSeed = providedSeed;
      spinner.text = chalk.yellow(
        "Using hex seed provided via --seed option."
      );
    } else if (config.deployerHexSeed || process.env.DEPLOYER_HEX_SEED) {
      deployerHexSeed =
        config.deployerHexSeed || process.env.DEPLOYER_HEX_SEED;
      spinner.text = chalk.yellow("Using hex seed from config/env.");
    } else {
      throw new Error(
        "Deployer hex seed not found. Use --quick-deploy, --seed, or set DEPLOYER_HEX_SEED in .env"
      );
    }

    if (!deployerHexSeed || !/^[0-9a-fA-F]{64}$/.test(deployerHexSeed)) {
      throw new Error(
        "Invalid deployer hex seed format. Must be 64 hexadecimal characters."
      );
    }

    spinner.succeed(chalk.green("Configuration loaded"));

    const fullSeed = hexToBytes(deployerHexSeed);
    const hdkey = HDKey.fromMasterSeed(fullSeed);
    const adminPrivateKey = hdkey.derive(`m/1852'/1815'/0'/0/0`).privateKey!;
    const adminPublicKey = ed25519.getPublicKey(adminPrivateKey);
    const keys = { privateKey: adminPrivateKey, publicKey: adminPublicKey };

    setNetworkId(GlobalNetworkId.TestNet);

    const deployments: Record<string, string> = {};

    for (const contractConfig of config.contracts) {
      const contractName = chalk.cyan(contractConfig.name);

      // --------------------
      // Compile
      // --------------------
      spinner.start(`Compiling ${contractName}...`);
      const sourcePath = path.resolve(
        path.dirname(configFilePath),
        contractConfig.path
      );
      const managedPath = path.join(
        path.dirname(sourcePath),
        "managed",
        contractConfig.name
      );
      execSync(
        `/home/akash/midnight/bin/compactc ${sourcePath} ${managedPath}`,
        { stdio: "pipe" }
      );
      spinner.succeed(`Compiled ${contractName}`);

      // ✅ require CJS artifact
      const { Contract } = customRequire(
        path.join(managedPath, "contract/index.cjs")
      );

      // --------------------
      // Wallet
      // --------------------
      spinner.start(`Building wallet for deployment...`);
      const walletSeed = fullSeed.slice(0, 32);
      const wallet = await WalletBuilder.build(
        "https://indexer.testnet-02.midnight.network/api/v1/graphql",
        "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
        "http://localhost:6300",
        "https://rpc.testnet-02.midnight.network",
        bytesToHex(walletSeed),
        ZswapNetworkId.TestNet,
        "info"
      );
      wallet.start();
      spinner.succeed("Wallet built");

      spinner.start("Syncing wallet (this may take a moment)...");
      const walletState: any = await waitForFunds(wallet);
      spinner.succeed(
        `Wallet synced with sufficient balance: ${
          walletState.balances[nativeToken()] || 0n
        } tDUST`
      );

      // --------------------
      // Deploy
      // --------------------
      const providers = await configureProviders(wallet, managedPath);
      const witnesses = { adminSecretKey: () => [{}, adminPrivateKey] };
      const contractInstance = new Contract(witnesses);

      spinner.start(`Deploying ${contractName}...`);
      const deployed = await deployContract(providers, {
        contract: contractInstance,
        privateStateId: `${contractConfig.name}-private`,
        initialPrivateState: {},
      });
      const contractAddress = deployed.deployTxData.public.contractAddress;
      spinner.succeed(
        `Deployed ${contractName} at ${chalk.bold(contractAddress)}`
      );

      // --------------------
      // Init if needed
      // --------------------
      if (contractConfig.init) {
        const { circuit, args } = contractConfig.init(keys);
        spinner.start(`Initializing ${contractName} via '${circuit}' circuit...`);
        // @ts-ignore (deployed.callTx is dynamic)
        const initTx = await deployed.callTx[circuit](...Object.values(args));
        spinner.succeed(
          `Initialized ${contractName}! (Tx ID: ${initTx.public.txId})`
        );
      }

      deployments[contractConfig.name] = contractAddress;
      await wallet.close();
    }

    // --------------------
    // Save results
    // --------------------
    const deploymentsJson = JSON.stringify(deployments, null, 2);
    await fs.writeFile(
      path.resolve(process.cwd(), "deployments.json"),
      deploymentsJson
    );

    console.log(chalk.bold.green("\n🎉 All deployments complete!"));
    console.log(chalk.bold("\nDeployment Summary:"));
    console.table(deployments);
    console.log(
      `\n✨ Deployment artifacts saved to ${chalk.cyan("deployments.json")}`
    );
  } catch (error: any) {
    spinner.fail(chalk.red("Deployment failed!"));
    console.error(chalk.red(error.stack || error.message));
    process.exit(1);
  }
}
