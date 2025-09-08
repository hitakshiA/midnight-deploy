import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
export declare const configureProviders: (wallet: any, managedPath: string) => Promise<MidnightProviders<any, any, any>>;
export declare const waitForFunds: (wallet: any) => Promise<unknown>;
