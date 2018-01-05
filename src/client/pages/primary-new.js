
const m = require('mithril')

const reactions = {}

reactions.onSettingsClick = async vnode => {
  const currentState = vnode.state.showDropdown

  if (typeof currentState === 'undefined') {
    vnode.state.showDropdown = true
  } else if (currentState === true) {
    vnode.state.showDropdown = false
  } else if (currentState === false) {
    vnode.state.showDropdown = true
  }
}
reactions.onPasswordSubmit = async vnode => {

}

const components = {}

components.dropdown = {
  view: vnode => {
    const dropdownOpts = {
      class: vnode.state.showDropdown ? 'active' : 'inactive'
    }

    return m('ul#settings-menu', dropdownOpts,
      m('li', m('a', {href: ' #'}, 'Settings')),
      m('li', m('a', {href: '#'}, 'Privacy')),
      m('li', m('a', {href: '#'}, 'Help')))
  }
}

components.header = {
  view: vnode => {
    return m('header#main-head',
      m('label.burger-menu', {for: 'slide', title: 'Main menu'}, '☰'),
      m('a', {
        href: '/#!/'
      }, m('h1.brand', {id: 'icon-brand'}, 'Polonium')),
      m('label#links', {
        for: 'slide',
        onclick: reactions.onSettingsClick.bind(this, vnode)
      }, '⋮')
    )
  }
}

components.websiteInput = {
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

components.passwordInput = {
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

components.submitInput = {
  view: vnode => {
    return m('input', {
      class: vnode.state.class || 'submit',
      type: 'button',
      value: vnode.state.text || 'Get Site Password',
      onclick: reactions.onPasswordSubmit.bind(this, vnode)
    })
  }
}

components.main = {
  view: vnode => {
    return m('.container', m(components.header), m('main',
      m(components.dropdown, {state: vnode.attrs.state}),
      m('form.main-input',
        m(components.websiteInput),
        m(components.passwordInput),
        m(components.submitInput)
      )
    ))
  }
}

module.exports = state => {
  return {
    view: () => {
      return m(components.main, {state})
    }
  }
}
