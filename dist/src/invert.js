"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
// tslint:disable-next-line:no-any (returns the rejection which is untyped)
async function invert(promise, message) {
    return promise.then((res) => { throw new Error(message); }, _.identity);
}
exports.invert = invert;
//# sourceMappingURL=invert.js.map