"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function memoize(fn, hasher = _.identity) {
    // tslint:disable:no-any (unfortunately we can't give the FnType any more clarity or it limits
    // what you can do with it)
    const memos = new Map();
    const queues = new Map();
    return (async (...args) => {
        const key = hasher(...args);
        if (memos.has(key)) {
            return memos.get(key);
        }
        else if (queues.has(key)) {
            return await queues.get(key);
        }
        const promise = fn(...args);
        queues.set(key, promise);
        try {
            const ret = await queues.get(key);
            memos.set(key, ret);
            return ret;
        }
        finally {
            queues.delete(key);
        }
    });
    // tslint:enable:no-any (unfortunately we can't give the FnType any more clarity or it limits what
    // you can do with it)
}
exports.memoize = memoize;
//# sourceMappingURL=memoize.js.map