import { __awaiter, __rest } from "tslib";
import React from 'react';
import { Component } from 'react';
import PropTypes from "prop-types";
import MassaPlugin from './MassaPlugin';
import { DISABLED, NOT_INSTALLED, TIMEOUT } from './errors';
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";
const isEqualArray = (array1, array2) => {
    return isEqual(sortBy(array1), sortBy(array2));
};
const getDisplayName = (WrappedComponent) => {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
};
function withTimeoutRejection(promise, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        const sleep = new Promise((resolve, reject) => setTimeout(() => reject(new Error(TIMEOUT)), timeout));
        return Promise.race([promise, sleep]);
    });
}
export function waitWithTimeout(milliseconds) {
    return __awaiter(this, void 0, void 0, function* () {
        const sleep = new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds));
        yield sleep;
    });
}
export function createMassaContext(initial) {
    // create massa context
    const Context = React.createContext(initial);
    Context.displayName = "ReactMassaContext";
    const ContextProvider = Context.Provider;
    class MassaContextProvider extends Component {
        constructor(props) {
            super(props);
            // private class vars
            this.watcher = null; // timer created with `setTimeout`
            this.massa = null;
            this.handleWatch = () => __awaiter(this, void 0, void 0, function* () {
                // if there is an already existing watcher, clear it
                if (this.watcher) {
                    clearTimeout(this.watcher);
                }
                // if no web3, set it to awaiting
                if (!this.state.web3 || !this.state.accounts.length) {
                    this.setState({ awaiting: true });
                }
                let error = this.state.error;
                let web3 = null;
                let accounts = [];
                try {
                    const isDisabled = error && error.message === DISABLED;
                    // in case of no MassaPlugin or a disabled one, try to load it again
                    if (!this.massa || isDisabled) {
                        this.massa = (yield withTimeoutRejection(MassaPlugin.initialize(this.props.options), this.props.timeout));
                    }
                    // get the underlying web3 instance
                    web3 = yield this.massa.getWeb3();
                    const addedAccounts = yield web3.massaProvider.walletWrapper.walletInfo();
                    accounts.push(...addedAccounts);
                    // set the error to null
                    error = null;
                }
                catch (err) {
                    error = err;
                }
                // if no error occurred, set the next timeout to check the plugin status
                if (!error) {
                    this.watcher = setTimeout(this.handleWatch, this.props.delay);
                }
                // set current state
                const nextState = { web3: web3, accounts: accounts, error: error, awaiting: false };
                this.setState(nextState);
                return nextState;
            });
            this.state = Object.assign({ web3: null, awaiting: false, error: null, accounts: [] }, props.value);
        }
        componentDidMount() {
            this.setState({
                error: MassaPlugin.hasWeb3() ? null : new Error(NOT_INSTALLED)
            });
            this.handleWatch();
        }
        shouldComponentUpdate(nextProps, nextState) {
            if (this.state.awaiting !== nextState.awaiting) {
                return true;
            }
            else if (this.state.web3 !== nextState.web3) {
                return true;
            }
            else if (this.state.error !== nextState.error) {
                return true;
            }
            else if (!isEqualArray(this.state.accounts, nextState.accounts)) {
                return true;
            }
            else {
                return false;
            }
        }
        // eslint-disable-next-line camelcase
        UNSAFE_componentWillReceiveProps(nextProps) {
            if (this.watcher) {
                // nextProps.immediate is false so stop timeout (if present).
                clearTimeout(this.watcher);
            }
        }
        componentWillUnmount() {
            if (this.watcher) {
                clearTimeout(this.watcher);
            }
        }
        render() {
            const _a = this.props, { value } = _a, props = __rest(_a, ["value"]);
            const internalValue = {
                web3: this.state.web3,
                accounts: this.state.accounts,
                error: this.state.error,
                awaiting: this.state.awaiting,
                openMassa: this.handleWatch,
            };
            return React.createElement(ContextProvider, Object.assign({}, props, { value: internalValue }));
        }
    }
    MassaContextProvider.propTypes = {
        value: PropTypes.any,
        delay: PropTypes.number,
        timeout: PropTypes.number,
        options: PropTypes.object, // Massa Plugin class initialize options
    };
    MassaContextProvider.defaultProps = {
        value: null,
        delay: 3000,
        timeout: 20000,
        options: undefined,
    };
    Context.Provider = MassaContextProvider;
    return Context;
}
export const withMassaPlugin = (MassaContext) => {
    return function withMassaContext(Comp) {
        const ComponentWithMassa = React.forwardRef((props, ref) => (React.createElement(MassaContext.Consumer, null, massa => React.createElement(Comp, Object.assign({ ref: ref, massa: massa }, props)))));
        ComponentWithMassa.displayName = `withMassaPlugin(${getDisplayName(Comp)})`;
        return ComponentWithMassa;
    };
};
export const PropTypesMassa = {
    web3: PropTypes.object,
    accounts: PropTypes.arrayOf(PropTypes.any).isRequired,
    error: PropTypes.object,
    awaiting: PropTypes.bool.isRequired,
    openMassa: PropTypes.func.isRequired,
};
export const PropTypesMassaObject = PropTypes.shape(PropTypesMassa);
//# sourceMappingURL=context.js.map