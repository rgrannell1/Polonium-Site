
'use strict'

const m = require('mithril')
const pages = require('./pages')

/**
 * Polonium routes.
 *
 * @return {undefined}
 */
document.body.onload = function () {
  m.route.mode = 'search'
  m.route(document.body, '/', {
    '/': pages['/'],
    '/about': pages['/about'],
    '/settings': pages['/settings']
  })
}
