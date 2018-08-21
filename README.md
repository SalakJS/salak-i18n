# salak-i18n

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/salak-i18n.svg?style=flat-square
[npm-url]: https://npmjs.org/package/salak-i18n
[travis-image]: https://img.shields.io/travis/SalakJS/salak-i18n.svg?style=flat-square
[travis-url]: https://travis-ci.org/SalakJS/salak-i18n
[coveralls-image]: https://img.shields.io/codecov/c/github/salakjs/salak-i18n.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/salakjs/salak-i18n?branch=master
[david-image]: https://img.shields.io/david/SalakJS/salak-i18n.svg?style=flat-square
[david-url]: https://david-dm.org/SalakJS/salak-i18n
[download-image]: https://img.shields.io/npm/dm/salak-i18n.svg?style=flat-square
[download-url]: https://npmjs.org/package/salak-i18n

i18n for salak 2.0

## Install

```sh
$ npm install --save salak-i18n
```

## Usage

### Config

In plugin:

```javascript
module.exports = {
  plugin: [
    {
      name: 'i18n',
      package: 'salak-i18n'
    }
  ]
}
```

#### options

- `root` **{String}** locales file location, default `path.join('config', 'locales')`
- `defaultLocale` **{String}** default `en-US`
- `queryField` **{String}** default `locale`
- `cookieField` **{String}** default `locale`
- `localeAlias` **{Object}** alias for locales
- `writeCookie` **{Boolean}** default `true`

### Context

#### ctx.__(key, ...args)

alias: ctx.gettext

- `key` **{String} i18n key
- `args` **{Array}** if set, it will be call util.format

#### ctx.locale

return current locale

### Controller

#### this.__(key, ...args)

alias: this.gettext

## LICENSE

[MIT](LICENSE)
