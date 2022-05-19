"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropTypesMassaObject = exports.PropTypesMassa = exports.withMassaPlugin = exports.createMassaContext = exports.waitWithTimeout = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const react_2 = require("react");
const prop_types_1 = require("prop-types");
const MassaPlugin_1 = require("./MassaPlugin");
const errors_1 = require("./errors");
const isEqual_1 = require("lodash/isEqual");
const sortBy_1 = require("lodash/sortBy");
const isEqualArray = (array1, array2) => {
    return (0, isEqual_1.default)((0, sortBy_1.default)(array1), (0, sortBy_1.default)(array2));
};
const getDisplayName = (WrappedComponent) => {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
};
function withTimeoutRejection(promise, timeout) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const sleep = new Promise((resolve, reject) => setTimeout(() => reject(new Error(errors_1.TIMEOUT)), timeout));
        return Promise.race([promise, sleep]);
    });
}
function waitWithTimeout(milliseconds) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const sleep = new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds));
        yield sleep;
    });
}
exports.waitWithTimeout = waitWithTimeout;
function createMassaContext(initial) {
    // create massa context
    const Context = react_1.default.createContext(initial);
    Context.displayName = "ReactMassaContext";
    const ContextProvider = Context.Provider;
    class MassaContextProvider extends react_2.Component {
        constructor(props) {
            super(props);
            // private class vars
            this.watcher = null; // timer created with `setTimeout`
            this.massa = null;
            this.handleWatch = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                    const isDisabled = error && error.message === errors_1.DISABLED;
                    // in case of no MassaPlugin or a disabled one, try to load it again
                    if (!this.massa || isDisabled) {
                        this.massa = (yield withTimeoutRejection(MassaPlugin_1.default.initialize(this.props.options), this.props.timeout));
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
                error: MassaPlugin_1.default.hasWeb3() ? null : new Error(errors_1.NOT_INSTALLED)
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
            const _a = this.props, { value } = _a, props = tslib_1.__rest(_a, ["value"]);
            const internalValue = {
                web3: this.state.web3,
                accounts: this.state.accounts,
                error: this.state.error,
                awaiting: this.state.awaiting,
                openMassa: this.handleWatch,
            };
            return <ContextProvider {...props} value={internalValue}/>;
        }
    }
    MassaContextProvider.propTypes = {
        value: prop_types_1.default.any,
        delay: prop_types_1.default.number,
        timeout: prop_types_1.default.number,
        options: prop_types_1.default.object, // Massa Plugin class initialize options
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
exports.createMassaContext = createMassaContext;
const withMassaPlugin = (MassaContext) => {
    return function withMassaContext(Comp) {
        const ComponentWithMassa = react_1.default.forwardRef((props, ref) => (<MassaContext.Consumer>
          {massa => <Comp ref={ref} massa={massa} {...props}/>}
        </MassaContext.Consumer>));
        ComponentWithMassa.displayName = `withMassaPlugin(${getDisplayName(Comp)})`;
        return ComponentWithMassa;
    };
};
exports.withMassaPlugin = withMassaPlugin;
exports.PropTypesMassa = {
    web3: prop_types_1.default.object,
    accounts: prop_types_1.default.arrayOf(prop_types_1.default.any).isRequired,
    error: prop_types_1.default.object,
    awaiting: prop_types_1.default.bool.isRequired,
    openMassa: prop_types_1.default.func.isRequired,
};
exports.PropTypesMassaObject = prop_types_1.default.shape(exports.PropTypesMassa);
//# sourceMappingURL=context.jsx.map