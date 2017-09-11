
"use strict"





const m = require('mithril')
const pages = require('./pages')

document.body.onload = function(){

	m.route(document.body, '/', {
		'/': pages['/'].body,
		'/about': pages['/about'].body,
		'/settings': pages['/settings'].body
	})

}
