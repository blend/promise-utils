"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts numeric keys to actual numbers - `for in` will always provide string keys, even
 * for array indexes or numeric keys of objects
 */
function asNumericKey(key) {
    // tslint:disable-next-line:no-any (isNaN for some reason is not typed to accept strings)
    if (!isNaN(key)) {
        return Number(key);
    }
    else {
        return key;
    }
}
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function map(input, iteratee) {
    if (!input) {
        return [];
    }
    const output = [];
    for (const key in input) {
        const possiblyNumericKey = asNumericKey(key);
        output.push(iteratee(input[possiblyNumericKey], possiblyNumericKey));
    }
    return Promise.all(output);
}
exports.map = map;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function mapLimit(input, limit, iteratee) {
    if (!input) {
        return [];
    }
    const size = (() => {
        if (input.length !== undefined) {
            return input.length;
        }
        let count = 0;
        for (const __ in input) {
            ++count;
        }
        return count;
    })();
    const allValues = new Array(size);
    const results = new Array(size);
    let i = 0;
    for (const key in input) {
        const possiblyNumericKey = asNumericKey(key);
        allValues[size - 1 - i] = [input[key], i, possiblyNumericKey];
        ++i;
    }
    await map(new Array(limit).fill(0), async () => {
        while (allValues.length > 0) {
            // tslint:disable-next-line:no-any
            const [val, index, key] = allValues.pop();
            results[index] = await iteratee(val, key);
        }
    });
    return results;
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
    const output = [];
    const nestedOutput = await map(input, iteratee);
    for (const partialOutput of nestedOutput) {
        // tslint:disable-next-line:no-any (could possibly be an array)
        if (partialOutput && partialOutput.length) {
            // tslint:disable-next-line:no-any (is definitely an array)
            output.push(...partialOutput);
        }
        else {
            output.push(partialOutput);
        }
    }
    return output;
}
exports.flatMap = flatMap;
//# sourceMappingURL=map.js.map