import { __awaiter } from "tslib";
import { waitWithTimeout } from "./context";
import * as errors from "./errors";
export class Web3 {
    constructor(massaProvider, options) {
        // some more settings could be done here
        this.massaProvider = massaProvider;
    }
}
export default class MassaPlugin {
    constructor(provider, options) {
        if (!provider) {
            throw new Error(errors.MISSING_PROVIDER);
        }
        this.web3 = new Web3(provider, options);
    }
    getWeb3() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3;
        });
    }
    static initialize(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const massaWeb3WindowObject = yield MassaPlugin.getWeb3();
            return new MassaPlugin(massaWeb3WindowObject, options);
        });
    }
    static hasWeb3() {
        const hasWeb3 = typeof window !== "undefined" && typeof window.massa !== "undefined";
        return (hasWeb3);
    }
    static getWeb3() {
        return __awaiter(this, void 0, void 0, function* () {
            // await the window.massa script to be injected!
            yield waitWithTimeout(3000);
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
//# sourceMappingURL=MassaPlugin.js.map