import { defineConfig } from '../src/config';
import { bytesToHex } from '@noble/hashes/utils';

interface KeyPair {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
}

export default defineConfig({
  deployerMnemonic: process.env.DEPLOYER_MNEMONIC,
  nativeToken: "02000000000000000000000000000000000000000000000000000000000000000000",
  contracts: [
    {
      name: 'PassportContract',
      path: './contracts/Passport.compact',
      init: (keys: KeyPair) => ({
        circuit: 'initialize',
        args: {
          initialAdminPk: keys.publicKey,
        },
      }),
    }
  ]
});