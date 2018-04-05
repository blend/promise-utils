"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
async function map(input, iteratee) {
    if (!input || !input.map) {
        return [];
    }
    return Promise.all(input.map(iteratee));
}
exports.map = map;
async function mapLimit(input, limit, iteratee) {
    let output = [];
    for (const inputGroup of _.chunk(input, limit)) {
        output = _.concat(output, await map(inputGroup, iteratee));
    }
    return output;
}
exports.mapLimit = mapLimit;
//# sourceMappingURL=map.js.map