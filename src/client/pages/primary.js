
"use strict"





const m = require('mithril')

const constants = require('../commons/constants')
const utils     = require('../commons/utils')
const logic     = require('../core/logic')
const skeleton  = require('css-loader!skeleton-css/css/skeleton.css')


/*


const actions = { }

actions.onWebsiteEdit = function ( ) {
	vnode.state.website = this.value
}

actions.onPasswordEdit = function ( ) {
	vnode.state.password = this.value
}

actions.onButtonClick = function ( ) {
	alert(vnode.state.password)
}





components.primary = {
	view: vnode => {

		const rows = { }

		rows.website = [
			m('label', { }, 'Website'),
			m('input.u-full-width', {
				type:        'text',
				placeholder: '',
				oninput: actions.onWebsiteEdit
			})
		]

		rows.password = [
			m('label', { }, 'Master Password'),
			m('input.u-full-width', {
				type:        'password',
				placeholder: '',
				oninput:     actions.onPasswordEdit
			})
		]

		const button = m('.row',
			m('input.button-primary', {
				type:    'submit',
				value:   'Get Password',
				onclick: actions.onButtonClick
			})
		)

		return m(components.primaryPageLayout, {
			rows: [
				rows.website,
				rows.password
			],
			button: m('.row', button)
		})

	}
}

components.primaryPageLayout = {
	view: vnode => {

		const formRows = vnode.attrs.rows.map(row => {
			return m( '.row', m.apply(null, ['.twelve-columns'].concat(row)) )
		})

		return m('div',
			m('.container',
				m('form', formRows),
				vnode.attrs.button))



	}
}
*/






const components = { }

components.Header = {
	view: vnode => {

		return m('header.main-head',
			m('h1.brand', 'Polonium')
		)

	}
}

components.WebsiteInput = {
	view: vnode => {

		return m('.website',
			m('input.website', {
				placeholder: 'Site',
				required: true,
				oninput: m.withAttr('value', val => {
					vnode.state.website = val
				})
			}),
		)

	}
}

components.PasswordInput = {
	view: vnode => {

		return m('.password',
			m('input.password', {
				placeholder: 'Master Password',
				type: 'password',
				oninput: m.withAttr('value', val => {
					vnode.state.password = val
				})
			}),
		)

	}
}

components.SubmitButton = {
	view: vnode => {

		var classes = ['submit']
		var text    = 'Get Site Password'

		if (vnode.state.buttonState === 'active') {
			classes.push('active')
			text = 'Getting Password...'
		}

		return m('input', {
			class: classes.join(' '),
			type: 'button',
			value: text,
			onclick: ( ) => {

				vnode.state.buttonState = 'active'

				setTimeout(( ) => {

					vnode.state.buttonState = null
					m.redraw( )

				}, 3000)

			}
		})

	}
}

components.main = {
	view: vnode => {

		return m('.container',
			m(components.Header, { }),
			m('main',
				m('form.main-input',

					m(components.WebsiteInput,  { }),
					m(components.PasswordInput, { }),
					m(components.SubmitButton,  { })

				)
			)
		)
	}
}

components.primaryPageLayout = {
	view: vnode => {

		const state = { }

		return m(components.main, {
			state
		})

	}
}





module.exports = {
	body: components.primaryPageLayout
}
