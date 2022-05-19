import { MassaProvider } from "./types";
declare global {
    interface Window {
        massa: MassaProvider;
    }
}
export declare class Web3 {
    constructor(massaProvider: MassaProvider, options: Object);
    massaProvider: MassaProvider;
}
export default class MassaPlugin {
    constructor(provider: MassaProvider, options: Object);
    private web3;
    getWeb3(): Promise<Web3>;
    static initialize(options: Object): Promise<MassaPlugin>;
    static hasWeb3(): boolean;
    static getWeb3(): Promise<MassaProvider>;
}
