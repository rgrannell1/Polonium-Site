
'use strict'

const m = require('mithril')

const settings = {
  controller: () => {
    m.redraw.strategy('diff')
  },
  view: () => {
    return m('p', 'xxxxxxxxxxxxx')
  }
}

module.exports = settings
