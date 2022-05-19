import { IAccount, IContractData, IAddressInfo, IBlockInfo, IOperationData, IRollsData, IBalance, ITransactionData, ICallData, EOperationStatus, IContractStorageData, IContractReadOperationData, IEventFilter, IReadData, IExecuteReadOnlyResponse, IEvent } from "@massalabs/massa-web3";
export interface MassaProvider {
    enable: (toggle: boolean) => void;
    version: string;
    enabled: boolean;
    contractWrapper: IContractWrapper;
    walletWrapper: IWalletWrapper;
    publicWrapper: IPublicWrapper;
}
export interface IContractWrapper {
    deploySmartContract: (contractData: IContractData) => Promise<Array<string>>;
    callSmartContract: (callData: ICallData) => Promise<Array<string>>;
    readSmartContract: (readData: IReadData) => Promise<Array<IContractReadOperationData>>;
    getParallelBalance: (address: string) => Promise<IBalance | null>;
    getFilteredScOutputEvents: (eventFilterData: IEventFilter) => Promise<Array<IEvent>>;
    getDatastoreEntry: (smartContractAddress: string, key: string) => Promise<IContractStorageData | null>;
    executeReadOnlySmartContract: (contractData: IContractData) => Promise<Array<IExecuteReadOnlyResponse>>;
    getOperationStatus: (opId: string) => Promise<EOperationStatus>;
    awaitRequiredOperationStatus: (opId: string, requiredStatus: EOperationStatus) => Promise<EOperationStatus>;
}
export interface IWalletWrapper {
    getBaseAccount: () => Promise<IAccount>;
    walletInfo: () => Promise<Array<IAddressInfo>>;
    sendTransaction: (txData: ITransactionData) => Promise<Array<string>>;
    buyRolls: (txData: IRollsData) => Promise<Array<string>>;
    sellRolls: (txData: IRollsData) => Promise<Array<string>>;
    getAccountSequentialBalance: (address: string) => Promise<IBalance | null>;
}
export interface IPublicWrapper {
    getAddresses: (addresses: Array<string>) => Promise<Array<IAddressInfo>>;
    getBlocks: (blockIds: Array<string>) => Promise<Array<IBlockInfo>>;
    getOperations: (operationIds: Array<string>) => Promise<Array<IOperationData>>;
}
