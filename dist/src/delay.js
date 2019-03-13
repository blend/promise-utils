"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-any typedef (typed by overload signatures)
async function delay(delayTime, value) {
    return new Promise(
    // tslint:disable-next-line:no-any (typed by overload signatures)
    resolve => setTimeout(() => resolve(value), delayTime));
}
exports.delay = delay;
// tslint:disable-next-line:no-any typedef (typed by overload signatures)
async function immediate(value) {
    return delay(0, value);
}
exports.immediate = immediate;
//# sourceMappingURL=delay.js.map