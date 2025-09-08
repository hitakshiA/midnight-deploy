import { generateMnemonic } from 'bip39';
import chalk from 'chalk';
import { randomBytes } from 'crypto'; // For generating raw hex seed
import { bytesToHex } from '@noble/hashes/utils'; // For converting bytes to hex
export function generateWallet() {
    console.log(chalk.blue("🌱 Generating a new 24-word recovery phrase..."));
    const mnemonic = generateMnemonic(256);
    console.log(chalk.green("\n✅ Recovery phrase generated successfully!"));
    console.log("------------------------------------------------------------------");
    console.log(chalk.yellow("IMPORTANT (for Lace import): Copy this line into a new .env file in your project root."));
    console.log(`\nDEPLOYER_MNEMONIC="${mnemonic}"\n`);
    console.log("------------------------------------------------------------------");
    console.log(chalk.blue("\n✨ Also generating a raw HEX seed for quick, headless deployments:"));
    const rawHexSeed = bytesToHex(randomBytes(32));
    console.log("------------------------------------------------------------------");
    console.log(chalk.yellow("IMPORTANT (for --seed or .env): Copy this line into a new .env file or use with --seed option."));
    console.log(`\nDEPLOYER_HEX_SEED="${rawHexSeed}"\n`);
    console.log("------------------------------------------------------------------");
}
