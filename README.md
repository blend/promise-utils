promise-utils
=============

[![Build Status](https://circleci.com/gh/blend/promise-utils.svg?style=shield)](https://circleci.com/gh/blend/promise-utils)
[![Coverage Status](https://coveralls.io/repos/github/blend/promise-utils/badge.svg?branch=master)](https://coveralls.io/github/blend/promise-utils?branch=master)
![Minzipped size](https://img.shields.io/bundlephobia/minzip/blend-promise-utils.svg)

Promise-utils is a dependency-free JavaScript/TypeScript library that
provides Lodash-like utility functions for dealing with native ES6
promises.

## Installation

```
$ npm install blend-promise-utils
```

## Usage Example

```js
const promiseUtils = require('blend-promise-utils')
const { promises: fs } = require('fs')
const request = require('request-promise-native');
const moment = require('moment');
const _ = require('lodash');

async function main() {
  const cachedResponse = promiseUtils.memoize(
    async (contents) => request(contents.url),
    contents => contents.url,
    moment.duration(15, 'seconds').asMilliseconds(), // contents could change
  );

  const fileContents = await promiseUtils.map(
    ['file1', 'file2', 'file3'],
    async fileName => {
      const rawData = await fs.readFile(fileName);
      return JSON.parse(rawData);
    },
  );

  while (true) {
    await promiseUtils.delay(150); // avoid slamming CPU

    await promiseUtils.mapSeries(
      fileContents,
      async contents => {
        const remoteData = await cachedResponse(contents);

        const { results, errors } = await promiseUtils.settleAll([
          asyncFunction1(),
          asyncFunction2(),
          asyncFunction3(),
        ]);

        if (!_.isEmpty(errors)) {
          throw new Error(`Unable to settle all functions: ${JSON.stringify(errors)}`);
        } else {
          return results;
        }
      }
    )
  }

  await promiseUtils.retry(flakyFunction, { maxAttempts: 3, delayMs: 150 })(flakyFunctionArgument);

  await promiseUtils.timeout(longFunction, moment.duration(1, 'minute').asMilliseconds())(longFunctionArgument);
}

main()
```

## API

- [Documentation][2]
- [Past versions][3]

## Test

```
$ npm test
```

## Documentation

Build docs
```
$ make docs
```

Push docs to Github
```
$ make push-docs
```

## License

[MIT](LICENSE)

[1]: https://blend.github.io/promise-utils
[2]: https://blend.github.io/promise-utils/latest/
[3]: https://blend.github.io/promise-utils/versions.html
