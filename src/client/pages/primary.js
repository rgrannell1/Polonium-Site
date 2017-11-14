
'use strict'

const m = require('mithril')
const clipboard = require('clipboard-polyfill')

const utils = require('../commons/utils')

const eventHandlers = { }

eventHandlers.onButtonClick = vnode => {
  Promise.resolve()
  /*

    .then(() => {
      return utils.promise.timeout(() => {
        vnode.state.text = 'Getting Password...'
        vnode.state.class = 'submit active'
        m.redraw()
      }, 1)
    })
  */
    .then(() => {
      clipboard.writeText('this is a password')
      /*
      return utils.promise.timeout(() => {

        vnode.state.text = 'Copied to Clipboard'
        vnode.state.class = 'submit completed'
        m.redraw()
      }, 3000)
      */
    })
    .then(() => {
      return utils.promise.timeout(() => {
        vnode.state.text = 'Get Site Password'
        vnode.state.class = 'submit'
        m.redraw()
      }, 3000)
    })
    .catch(err => {
      throw err
    })
}

const components = { }

components.Header = {
  view: () => {
    return m('header.main-head',
      m('label.burger-menu', {for: 'slide', title: 'Main menu'}, '☰'),
      m('a', {
        href: '/#!/'
      }, m('h1.brand', {id: 'icon-brand'}, 'Polonium'))
    )
  }
}

components.WebsiteInput = {
  view: vnode => {
    return m('.website', {id: 'website-input-container'},
      m('input.website', {
        placeholder: 'Site',
        required: true,
        oninput: m.withAttr('value', val => {
          vnode.state.website = val
        })
      })
    )
  }
}

components.PasswordInput = {
  view: vnode => {
    return m('.password', {id: 'password-input-container'},
      m('input.password', {
        placeholder: 'Master Password',
        type: 'password',
        oninput: m.withAttr('value', val => {
          vnode.state.password = val
        })
      })
    )
  }
}

components.SubmitButton = {
  view: vnode => {
    var text = vnode.state.text
      ? vnode.state.text
      : 'Get Site Password'

    var bclass = vnode.state.class
      ? vnode.state.class
      : 'submit'

    return m('input', {
      class: bclass,
      type: 'button',
      value: text,
      onclick: eventHandlers.onButtonClick.bind(this, vnode)
    })
  }
}

components.main = {
  view: () => {
    return m('.container',
      m(components.Header, { }),
      m('main',
        m('div.test'),
        m('form.main-input',
          m(components.WebsiteInput, { }),
          m(components.PasswordInput, { }),
          m(components.SubmitButton, { })
        )
      )
    )
  }
}

components.primaryPageLayout = {
  view: () => {
    const state = { }

    return m(components.main, {
      state
    })
  }
}

module.exports = {
  body: components.primaryPageLayout
}
