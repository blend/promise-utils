"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function chunkObject(input, limit) {
    return _(input)
        .toPairs()
        .chunk(limit)
        // (adding types breaks the compiler, but the inferred types work just fine)
        // tslint:disable:typedef
        .map(pairList => _.reduce(pairList, (acc, pair) => _.defaults(acc, { [pair[0]]: pair[1] }), {}))
        // tslint:enable:typedef
        .value();
}
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function map(input, iteratee) {
    if (!input) {
        return [];
    }
    return Promise.all(_.map(input, iteratee));
}
exports.map = map;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function mapLimit(input, limit, iteratee) {
    let output = [];
    if (!input) {
        return output;
    }
    const inputGroups = input.map ? _.chunk(input, limit) : chunkObject(input, limit);
    for (const inputGroup of inputGroups) {
        output = _.concat(output, await map(inputGroup, iteratee));
    }
    return output;
}
exports.mapLimit = mapLimit;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function mapSeries(input, iteratee) {
    return mapLimit(input, 1, iteratee);
}
exports.mapSeries = mapSeries;
//# sourceMappingURL=map.js.map