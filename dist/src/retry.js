"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const delay_1 = require("./delay");
function retry(fn, retryOpts) {
    // tslint:disable-next-line:no-any (casting as any to preserve original function type)
    return (async (...args) => {
        let lastErr = new Error(`Could not complete function within ${retryOpts.maxAttempts}`);
        for (const __ of _.range(retryOpts.maxAttempts)) {
            try {
                return await fn(args);
            }
            catch (err) {
                if (retryOpts.isRetryable && !retryOpts.isRetryable(err)) {
                    throw err;
                }
                lastErr = err;
            }
            if (retryOpts.delayMs) {
                await delay_1.delay(retryOpts.delayMs);
            }
        }
        throw lastErr;
        // tslint:disable-next-line:no-any (casting as any to preserve original function type)
    });
}
exports.retry = retry;
//# sourceMappingURL=retry.js.map