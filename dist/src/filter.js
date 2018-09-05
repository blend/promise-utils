"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("./map");
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
async function filter(input, predicate) {
    if (!input) {
        return [];
    }
    // tslint:disable-next-line:no-any
    const output = [];
    // tslint:disable-next-line:no-any
    await map_1.map(input, async (value, key) => {
        if (await predicate(value, key)) {
            output.push(value);
        }
    });
    return output;
}
exports.filter = filter;
//# sourceMappingURL=filter.js.map