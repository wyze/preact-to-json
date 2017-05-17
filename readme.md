# preact-to-json

[![Build Status][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![devDependencies][depsdev-image]][depsdev-url]

> Convert [Preact](//github.com/developit/preact) components to JSON.

_**Note:** This library currently only supports functional components and shallow rendering._

## Installation

```sh
$ yarn add --dev preact-to-json
```

## Usage

```js
// ES6
import render from 'preact-to-json'

// ES5
const { render } = require('preact-to-json')

// With Jest
describe('Component', () => {
  it('renders', () => {
    const Component = () => (<a href="//google.com">Google</a>)
    const element = render(<Component />)

    expect(element).toMatchSnapshot()
  })
})

// test.snap
exports[`Component renders 1`] = `
<a
  href="//google.com"
>
  Google
</a>
`;
```

## Change Log

> [Full Change Log](changelog.md)

### [v1.0.1](https://github.com/wyze/preact-to-json/releases/tag/v1.0.1) (2017-05-17)

* [[`f6b119432a`](https://github.com/wyze/preact-to-json/commit/f6b119432a)] - Filter out children key from attribute object (Neil Kistner)
* [[`2057763d11`](https://github.com/wyze/preact-to-json/commit/2057763d11)] - Correct typo in readme (Neil Kistner)
* [[`276447146d`](https://github.com/wyze/preact-to-json/commit/276447146d)] - Fix changelog generation (Neil Kistner)

## License

MIT © [Neil Kistner](https://neilkistner.com)

[travis-image]: https://img.shields.io/travis/wyze/preact-to-json.svg?style=flat-square
[travis-url]: https://travis-ci.org/wyze/preact-to-json

[npm-image]: https://img.shields.io/npm/v/preact-to-json.svg?style=flat-square
[npm-url]: https://npmjs.com/package/preact-to-json

[depsdev-image]: https://img.shields.io/david/dev/wyze/preact-to-json.svg?style=flat-square
[depsdev-url]: https://david-dm.org/wyze/preact-to-json?type=dev
