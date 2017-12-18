
const {httpResponses} = require('@rgrannell1/utils')
require('mithril/test-utils/browserMock')(global)
const m = require('mithril')
const render = require('mithril-node-render')

/**
 *
 * Response.
 *
 */
module.exports = async (ctx, next) => {
  const dom = m('html', {lang: 'en'},
    m('head',
      m('meta', {charset: 'utf-8'}),
      m('title', 'Polonium'),
      m('meta', {name: 'theme-color', content: '#5d51d6'}),
      m('viewport', {content: 'width=device-width, initial-scale=1'}),
      m('link', {rel: 'manifest', href: './manifest.json'}),
      m('link', {rel: 'stylesheet', href: 'css/polonium.min.css', media: 'all'})
    ),
    m('body#app',
      m('.container')
    )
  )

  if (httpResponses.is.NotFound(ctx)) {
    Object.assign(ctx, httpResponses.NotFound({body: render(dom)}))
  }

  next()
}
