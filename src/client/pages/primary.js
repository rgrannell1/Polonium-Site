
"use strict"





const m = require('mithril')

const constants = require('../commons/constants')
const utils     = require('../commons/utils')
const logic     = require('../core/logic')
const skeleton  = require('css-loader!skeleton-css/css/skeleton.css')





const components = { }

components.Header = {
	view: vnode => {

		return m('header.main-head',
			m('i.burger-menu', m('p', '☰')),
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
			onclick: ( ) => {


				Promise.resolve( )
					.then(( ) => {

						return utils.promise.timeout(( ) => {

							vnode.state.text  = 'Getting Password...'
							vnode.state.class = 'submit active'
							m.redraw( )

						}, 0)

					})
					.then(( ) => {

						return utils.promise.timeout(( ) => {

							vnode.state.text  = 'Copied to Clipboard'
							vnode.state.class = 'submit completed'
							m.redraw( )

						}, 3000)

					})
					.then(( ) => {

						return utils.promise.timeout(( ) => {

							vnode.state.text  = 'Get Site Password'
							vnode.state.class = 'submit'
							m.redraw( )

						}, 3000)

					})
					.catch(err => {
						throw err
					})

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
