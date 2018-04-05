"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function delay(delayTime, value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), delayTime));
}
exports.delay = delay;
async function immediate(value) {
    return delay(0, value);
}
exports.immediate = immediate;
//# sourceMappingURL=delay.js.map