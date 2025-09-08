```markdown
# 🚀 Midnight Deploy: The Slickest CLI for Midnight Contract Deployments

[![npm version](https://img.shields.io/npm/v/midnight-deploy?style=for-the-badge)](https://www.npmjs.com/package/midnight-deploy)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](LICENSE)
[![Midnight Network](https://img.shields.io/badge/Powered%20by-Midnight%20Network-purple?style=for-the-badge)](https://docs.midnight.network/)

## ✨ Zero-Config Deployment. Instant Iteration. Utterly Slick.

`midnight-deploy` is a powerful and intuitive Command-Line Interface (CLI) tool designed to make compiling, deploying, and initializing your Midnight smart contracts effortless. Stop wrestling with complex scripts, obscure errors, and manual wallet management. With `midnight-deploy`, you declare what you want, and it handles the rest with a single, slick command.

---

### 💔 The Problem: Deploying Contracts is Painful

Deploying smart contracts, especially on a cutting-edge ZK-proof blockchain like Midnight, is notoriously complex:
*   **Cryptic Errors:** From WASM initialization to `LedgerParameters` and `ERR_PACKAGE_PATH_NOT_EXPORTED`, the path is fraught with obscure technical hurdles.
*   **Boilerplate Hell:** Manually configuring providers, handling wallet syncing, deriving keys, and orchestrating two-step deploy-then-initialize sequences.
*   **Slow Iteration:** Each deployment attempt requires tedious manual steps, slowing down development.
*   **Hidden Complexity:** While powerful, the underlying Midnight.js APIs are often low-level, demanding deep understanding just to get started.

This friction discourages new developers and slows down seasoned builders.

### ✅ The Solution: `midnight-deploy`

`midnight-deploy` abstracts away this complexity, providing a declarative, fast, and delightful developer experience (DX). It's built for rapid iteration in development and robust execution in production.

**Imagine deploying your contract with just one line of configuration and one command.** That's `midnight-deploy`.

---

## 🌟 Key Features

*   **Declarative Configuration:** Define your contracts, network, and initialization arguments in a simple `midnight.config.ts` file.
*   **Zero-Boilerplate Deployment:** Automates the entire complex process: contract compilation, wallet setup, network syncing, `deployContract` calls, and two-step initialization.
*   **Slick UI Feedback:** Enjoy beautiful, real-time status updates with spinners and colored logs, making the deployment process clear and confidence-inspiring.
*   **Quick Deploy Mode:** Instantly generate a random deployer wallet and keys for rapid testing without touching `.env` files.
*   **Idempotent:** Designed to be safely re-run. Future features will include caching and smart re-deployments.
*   **Type-Safe Configuration:** Leverage TypeScript for your config files, with full autocomplete and validation.
*   **Full Midnight Stack Integration:** Seamlessly uses `compactc`, `@midnight-ntwrk/wallet`, `@midnight-ntwrk/midnight-js-contracts`, `@noble/curves`, `bip39`, and more.

---

## 🚀 Getting Started (Quick Start)

This guide gets you from zero to a deployed Midnight smart contract in minutes.

### Prerequisites

1.  **Node.js v22+:** Ensure you have the latest Node.js LTS installed (recommended via `nvm`).
2.  **`compactc` Compiler:** Install the Midnight `compactc` compiler and ensure its absolute path is used in `midnight-deploy`'s scripts (see [Installation](#installation)).
3.  **Docker:** Required for running the local Midnight Proof Server.
4.  **Lace - Midnight Preview Wallet:** Install this Chrome/Brave extension if you plan to import a deployer mnemonic and fund it.

### Installation

1.  **Clone this repository:**
    ```bash
    git clone https://github.com/your-github-username/midnight-deploy.git
    cd midnight-deploy
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Basic Usage (Quick Deploy)

This mode is perfect for rapid development and testing. It generates a random deployer wallet and keys on the fly.

1.  **Start your Midnight Proof Server (in a separate terminal):**
    ```bash
    docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
    ```
2.  **Run the deployment:**
    ```bash
    npm start -- deploy --config ./example/midnight.config.ts --quick-deploy
    ```
    (The `--` is important to pass `deploy` and `--config` to our script).

    Watch the beautiful console output! Your contract will compile, deploy, and initialize with zero manual setup.

### Custom Usage (Your Wallet, Your Config)

For persistent deployments or to use a specific funded wallet (e.g., in Lace), you'll provide your own deployer seed.

1.  **Generate a new 24-word Mnemonic:**
    ```bash
    npm start -- generate-wallet
    ```
    This will print a `DEPLOYER_MNEMONIC="..."` line.

2.  **Create/Update `example/.env`:**
    *   Create a file `example/.env` in your `midnight-deploy/example` directory.
    *   Paste the `DEPLOYER_MNEMONIC="..."` line (and any `ADMIN_PUBLIC_KEY` if needed for your contract's `initArgs`) into it.

3.  **Import & Fund Wallet:**
    *   Import this 24-word mnemonic phrase into a **new Lace - Midnight Preview Wallet account**.
    *   Go to the [Midnight Faucet](https://faucet.testnet-02.midnight.network/) and send `tDUST` to your new wallet's address.

4.  **Run the deployment:**
    ```bash
    npm start -- deploy --config ./example/midnight.config.ts
    ```
    The tool will detect your funded wallet, wait for sync, and proceed with deployment.

---

## ⚙️ Configuration (Example)

Your deployment is defined in `midnight.config.ts` (e.g., `example/midnight.config.ts`).

```typescript
// example/midnight.config.ts
/** @type {import('midnight-deploy').DeployConfig} */
export default {
  // Your deployer wallet's mnemonic (read from .env or provided via --seed)
  deployerMnemonic: process.env.DEPLOYER_MNEMONIC,
  
  // A list of contracts to deploy in sequence
  contracts: [
    {
      name: 'PassportContract', // A friendly name for reporting
      path: './contracts/Passport.compact', // Path to your Compact source file
      
      // Optional: Initialization arguments for a circuit to call post-deployment
      init: (keys) => ({
        circuit: 'initialize', // The circuit name to call
        args: {
          initialAdminPk: keys.publicKey, // Arguments, `keys` is provided by the deployer
        },
      }),
    },
    // You can add more contracts here, they will deploy in order!
    // {
    //   name: 'AnotherContract',
    //   path: './contracts/Another.compact',
    //   init: (keys) => ({ circuit: 'setup', args: { owner: keys.publicKey } })
    // }
  ],
};
```

---

## 📈 Deployment Summary (Example Output)

```bash
$ npm start -- deploy --config ./example/midnight.config.ts --quick-deploy
✔ Configuration loaded
✔ Compiled PassportContract
✔ Wallet built
✔ Wallet synced with sufficient balance: 500000000 tDUST
✔ Deployed PassportContract at 0200ec9f9121540d2dbcc205d269f0920895a20b9572699d34551e5e98004c6f1488
✔ Initialized PassportContract! (Tx ID: 00000000f915af09ffc517e178bed6fbcd433cc353a31f1e5ccb8b68901e30f901a391e1)

🎉 All deployments complete! 

Deployment Summary:
┌──────────────────┬──────────────────────────────────────────────────────────────────┐
│ Contract Name    │ Address                                                          │
├──────────────────┼──────────────────────────────────────────────────────────────────┤
│ PassportContract │ 0200ec9f9121540d2dbcc205d269f0920895a20b9572699d34551e5e98004c6f1488 │
└──────────────────┴──────────────────────────────────────────────────────────────────┘

✨ Deployment artifacts saved to deployments.json
```

---

## 🛠️ Project Structure

```
midnight-deploy/
├── dist/                               # Compiled JavaScript output
├── example/
│   ├── contracts/
│   │   └── Passport.compact            # Example contract source
│   ├── .env                            # Example environment variables
│   └── midnight.config.ts              # Example deployment configuration
├── node_modules/                       # Project dependencies
├── src/
│   ├── cli.ts                          # CLI command definitions
│   ├── config.ts                       # Configuration types and helper
│   ├── deploy.ts                       # Core deployment logic
│   ├── generate-wallet.ts              # Wallet generation logic
│   └── providers.ts                    # Midnight.js provider setup
├── package.json                        # Project metadata and scripts
├── tsconfig.json                       # TypeScript configuration
└── deployments.json                    # Auto-generated: stores deployed contract addresses
```

---

## 🤝 Contributing & Support

We welcome contributions! Feel free to open issues or submit pull requests.

*   **Report Issues:** For bugs or feature requests, please use the [GitHub Issues](https://github.com/your-github-username/midnight-deploy/issues) page.
*   **Get Help:** Connect with the Midnight Network community on [Discord](https://discord.com/invite/midnightnetwork) for support.

### License

This project is licensed under the **Apache 2.0 License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

A huge thank you to the [Midnight Network](https://docs.midnight.network/) team for building a privacy-first blockchain and for the foundational examples that inspired this tool.

---

```
```