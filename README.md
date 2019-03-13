promise-utils
=============

[![Build Status](https://circleci.com/gh/blend/promise-utils.svg?style=shield)](https://circleci.com/gh/blend/promise-utils)
[![Coverage Status](https://coveralls.io/repos/github/blend/promise-utils/badge.svg?branch=master)](https://coveralls.io/github/blend/promise-utils?branch=master)

Promise-utils is a JavaScript/TypeScript library that provides
Lodash-like utility functions for dealing with promises.

## Installation

```
$ npm install blend-promise-utils
```

## Usage Example

```
const promiseUtils = require('promise-utils')

async function main() {
  console.log(
    await promiseUtils.filter(
      [1000, 2000, 4000],
      async (x, i) => {
        await promiseUtils.delay(x, x)
        console.log(`Processed ${x}`)
        return x <= 2000
      }
    )
  )
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
