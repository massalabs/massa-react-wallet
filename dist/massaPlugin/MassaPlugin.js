"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3 = void 0;
const tslib_1 = require("tslib");
const context_1 = require("./context");
const errors = require("./errors");
class Web3 {
    constructor(massaProvider, options) {
        // some more settings could be done here
        this.massaProvider = massaProvider;
    }
}
exports.Web3 = Web3;
class MassaPlugin {
    constructor(provider, options) {
        if (!provider) {
            throw new Error(errors.MISSING_PROVIDER);
        }
        this.web3 = new Web3(provider, options);
    }
    getWeb3() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.web3;
        });
    }
    static initialize(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const massaWeb3WindowObject = yield MassaPlugin.getWeb3();
            return new MassaPlugin(massaWeb3WindowObject, options);
        });
    }
    static hasWeb3() {
        const hasWeb3 = typeof window !== "undefined" && typeof window.massa !== "undefined";
        return (hasWeb3);
    }
    static getWeb3() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // await the window.massa script to be injected!
            yield (0, context_1.waitWithTimeout)(3000);
            if (window.massa) {
                // enable massa
                window.massa.enable(true);
                const { enable, version, enabled } = window.massa;
                return { enable,
                    version,
                    enabled,
                    contractWrapper: window.massa.contractWrapper,
                    walletWrapper: window.massa.walletWrapper };
            }
            else {
                throw new Error(errors.NOT_INSTALLED);
            }
        });
    }
}
exports.default = MassaPlugin;
//# sourceMappingURL=MassaPlugin.js.map