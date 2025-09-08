export interface KeyPair {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
}

export interface ContractConfig {
    name: string;
    path: string;
    init?: (keys: KeyPair) => { circuit: string; args: Record<string, any> };
}

export interface DeployConfig {
    deployerHexSeed?: string; // Changed to hex seed
    contracts: ContractConfig[];
}

export function defineConfig(config: DeployConfig): DeployConfig {
    return config;
}