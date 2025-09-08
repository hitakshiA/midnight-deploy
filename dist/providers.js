import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { nativeToken, Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { firstValueFrom, filter } from 'rxjs';
import { createBalancedTx } from '@midnight-ntwrk/midnight-js-types';
import { Transaction } from '@midnight-ntwrk/ledger';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
const createWalletAndMidnightProvider = async (wallet) => {
    const state = await firstValueFrom(wallet.state());
    if (!state)
        throw new Error("Wallet state is unavailable.");
    return {
        coinPublicKey: state.coinPublicKey,
        encryptionPublicKey: state.encryptionPublicKey,
        balanceTx(tx, newCoins) {
            return wallet.balanceTransaction(ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()), newCoins)
                .then((tx) => wallet.proveTransaction(tx))
                .then((zswapTx) => Transaction.deserialize(zswapTx.serialize(getZswapNetworkId()), getLedgerNetworkId()))
                .then(createBalancedTx);
        },
        submitTx(tx) {
            return wallet.submitTransaction(tx);
        },
    };
};
export const configureProviders = async (wallet, managedPath) => {
    const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
    return {
        privateStateProvider: levelPrivateStateProvider({ privateStateStoreName: 'deployer-private-store' }),
        publicDataProvider: indexerPublicDataProvider('https://indexer.testnet-02.midnight.network/api/v1/graphql', 'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws'),
        zkConfigProvider: new NodeZkConfigProvider(managedPath),
        proofProvider: httpClientProofProvider('http://localhost:6300'),
        walletProvider: walletAndMidnightProvider,
        midnightProvider: walletAndMidnightProvider,
    };
};
export const waitForFunds = (wallet) => firstValueFrom(wallet.state().pipe(filter((state) => (state.balances[nativeToken()] || 0n) > 1000000n)));
