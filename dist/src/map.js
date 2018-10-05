"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
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
    if (!input) {
        return [];
    }
    // tslint:disable-next-line:no-any
    const stack = _.reverse(input.map ? _.clone(input) : _.toPairs(input));
    return await flatMap(_.range(limit), async () => {
        const partialOutput = [];
        while (!_.isEmpty(stack)) {
            // tslint:disable-next-line:no-any
            const val = stack.pop();
            if (input.map) {
                partialOutput.push(await iteratee(val, stack.length));
            }
            else {
                partialOutput.push(await iteratee(..._.reverse(val)));
            }
        }
        return partialOutput;
    });
}
exports.mapLimit = mapLimit;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function mapSeries(input, iteratee) {
    return mapLimit(input, 1, iteratee);
}
exports.mapSeries = mapSeries;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function flatMap(input, iteratee) {
    if (!input) {
        return [];
    }
    return _.flatten(await map(input, iteratee));
}
exports.flatMap = flatMap;
//# sourceMappingURL=map.js.map