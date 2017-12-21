
const {httpResponses} = require('@rgrannell1/utils')
require('mithril/test-utils/browserMock')(global)
const m = require('mithril')
const render = require('mithril-node-render')

const pages = {}
pages.outline = () => {
  const header = m('head',
      m('meta', {charset: 'utf-8'}),
      m('title', 'Polonium'),
      m('meta', {name: 'theme-color', content: '#5d51d6'}),
      m('viewport', {content: 'width=device-width, initial-scale=1'}),
      m('link', {rel: 'manifest', href: './manifest.json'}),
      m('link', {rel: 'stylesheet', href: 'css/polonium.min.css', media: 'all'})
    )

  const body = m('body#app',
      m('.container',
        m('header#main-head',
          m('label.burger-menu', {for: 'slide', title: 'Main menu'}, '☰'),
          m('a', {href: '/#!/'},
            m('h1#icon-brand', {class: 'brand'}, 'Polonium')),
          m('label#links', {for: 'slide'}))))

  return m('html', {lang: 'en'}, header, body)
}

/**
 *
 * Response.
 *
 */
module.exports = async (ctx, next) => {
  if (httpResponses.is.NotFound(ctx)) {
    ctx.body = await render(pages.outline())
  }

  next()
}
