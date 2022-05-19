import React from 'react';
import PropTypes from "prop-types";
import { Web3 } from './MassaPlugin';
export declare function waitWithTimeout(milliseconds: number): Promise<void>;
export interface IContext {
    awaiting: boolean;
    accounts: Array<any>;
    error: Error | null;
    web3: Web3 | null;
    openMassa: (e: any) => any;
}
export declare function createMassaContext(initial: IContext | null): React.Context<IContext>;
export declare const withMassaPlugin: (MassaContext: React.Context<IContext>) => (Comp: any) => React.ForwardRefExoticComponent<React.RefAttributes<unknown>>;
export declare const PropTypesMassa: {
    web3: PropTypes.Requireable<object>;
    accounts: PropTypes.Validator<any[]>;
    error: PropTypes.Requireable<object>;
    awaiting: PropTypes.Validator<boolean>;
    openMassa: PropTypes.Validator<(...args: any[]) => any>;
};
export declare const PropTypesMassaObject: PropTypes.Requireable<PropTypes.InferProps<{
    web3: PropTypes.Requireable<object>;
    accounts: PropTypes.Validator<any[]>;
    error: PropTypes.Requireable<object>;
    awaiting: PropTypes.Validator<boolean>;
    openMassa: PropTypes.Validator<(...args: any[]) => any>;
}>>;
