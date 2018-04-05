"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function timeout(fn, expirationTime, errorMessage) {
    // tslint:disable-next-line:typedef no-any (typedef is hacked because we're hijacking fn)
    return async function race() {
        return Promise.race([
            new Promise((__, reject) => {
                setTimeout(() => reject(new Error(errorMessage)), expirationTime);
            }),
            fn.apply(this, arguments),
        ]);
        // tslint:disable-next-line:no-any (need to cast to any because we hacked together the typedef)
    };
}
exports.timeout = timeout;
//# sourceMappingURL=timeout.js.map