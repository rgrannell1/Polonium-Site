
'use strict'

const m = require('mithril')
const clipboard = require('clipboard-polyfill')

const utils = require('../commons/utils')

if (window.Worker) {
  var poloniumWorker = new Worker('/build-web-workers.min.js')
} else {
  console.error('webWorkers not supported.')
}

const view = {
  button: { }
}

view.button.active = vnode => {
  Object.assign(vnode.state, {
    text: 'Getting Password...',
    class: 'submit active'
  })
}

view.button.complete = vnode => {
  Object.assign(vnode.state, {
    text: 'Copied to Clipboard',
    class: 'submit completed'
  })
}

view.button.error = vnode => {
  Object.assign(vnode.state, {
    text: 'Failed',
    class: 'submit failed'
  })
}

const eventHandlers = { }

eventHandlers.onButtonClick = async vnode => {
  poloniumWorker.postMessage({})
  view.button.active(vnode)
  m.redraw()

  const onMessage = Promise.resolve(resolve => {
    poloniumWorker.onmessage = event => {
      const result = clipboard.writeText(event.data).then(() => {
        view.button.complete(vnode)
        m.redraw()
      })
      resolve(result)
    }
  })

  const onTimeout = utils.promise.timeout(() => {
    view.button.error(vnode)
    m.redraw()
  }, 3000)

  await Promise.race([onMessage, onTimeout])
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
      m('label', {for: 'website', spellcheck: false}, 'Site'),
      m('input#website', {
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
      m('label', {for: 'password'}, 'Master Password'),
      m('input#password', {
        required: true,
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
    return m('input', {
      class: vnode.state.class || 'submit',
      type: 'button',
      value: vnode.state.text || 'Get Site Password',
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
