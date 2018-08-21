const { Controller } = require('salak')

class Index extends Controller {
  async actionIndex () {
    this.success({
      welcome: this.__('hello'),
      title: this.__('title')
    })
  }

  async actionGettext () {
    this.success({
      welcome: this.gettext('hello'),
      title: this.gettext('title')
    })
  }
}

module.exports = Index
