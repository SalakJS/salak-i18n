const util = require('util')
const path = require('path')

const DEFAULTS = {
  root: path.join('config', 'locales'),
  defaultLocale: 'en-US',
  queryField: 'locale',
  cookieField: 'locale',
  cookieExpires: 31536000, // 1 year
  localeAlias: {},
  writeCookie: true
}

module.exports = (options = {}, app) => {
  const { modules } = app
  const {
    root,
    defaultLocale,
    queryField,
    cookieField,
    cookieExpires,
    localeAlias,
    writeCookie
  } = Object.assign({}, DEFAULTS, options)

  const locales = app.loader.loadFiles(modules, root, {
    match: ['*.js', '*.json'],
    caseStyle: 'origin',
    call: (obj) => {
      if (typeof obj === 'function') {
        return obj(app)
      }

      return obj
    }
  })

  const getLanguage = (lang = '') => {
    return lang.replace('-', '_').toLowerCase()
  }

  const resources = {}

  for (let key in locales) {
    for (let lang in locales[key]) {
      resources[getLanguage(localeAlias[lang] || lang)] = locales[key][lang]
    }
  }

  app.use(async (ctx, next) => {
    if (!ctx.state.__) { // register for view
      ctx.state.__ = ctx.gettext
    }

    await next()
  })

  return {
    context: {
      __getLocale () {
        if (this._locale) {
          return this._locale
        }

        // Query
        let locale = this.query[queryField]

        // Cookie
        let cookieLocale
        if (!locale) {
          cookieLocale = this.cookies.get(cookieField, { signed: false })
          locale = cookieLocale
        }

        // Header
        if (!locale) {
          let languages = this.acceptsLanguages()
          if (languages) {
            if (Array.isArray(languages)) {
              if (languages[0] === '*') {
                languages = languages.slice(1)
              }

              if (languages.length > 0) {
                for (let i = 0; i < languages.length; i++) {
                  const lang = getLanguage(languages[i])
                  if (resources[lang] || localeAlias[lang]) {
                    locale = lang
                    break
                  }
                }
              }
            } else {
              locale = languages
            }
          }
        }

        if (!locale) {
          locale = defaultLocale
        }

        if (locale in localeAlias) {
          locale = localeAlias[locale]
        }

        if (writeCookie && cookieLocale !== locale && !this.headerSent) {
          this.cookies.set(cookieField, locale, {
            httpOnly: false,
            maxAge: cookieExpires,
            signed: false
          })
        }

        locale = getLanguage(locale)
        this._locale = locale
        return locale
      },
      get locale () {
        return this.__getLocale()
      },
      gettext (key, ...args) {
        if (!key) {
          return ''
        }

        const locale = this.__getLocale()
        const resource = resources[locale] || {}

        let text = resource[key]

        if (text === undefined) {
          text = key
        }

        if (args.length === 0) {
          return text
        }

        return util.format.apply(null, text, args)
      },
      __ (key, ...args) {
        return this.gettext(key, ...args)
      }
    },
    controller: {
      gettext (key, ...args) {
        return this.ctx.gettext(key, ...args)
      },
      __ (key, ...args) {
        return this.gettext(key, ...args)
      }
    }
  }
}
