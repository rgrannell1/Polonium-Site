
"use strict"





const m         = require('mithril')
const constants = require('./commons/constants')
const utils     = require('./commons/utils')
const pages     = require('./pages')
const crypt    = require('./core/crypto')
const buffer = require('buffer')


/*

crypt.importKey('abc')
	.then(password => {
		return crypt.deriveBits(password, 'asdfg', 256)
	})
	.then(webKey => {

		console.log(
			new buffer.Buffer(webKey).toString('hex')
		)

	})
	.catch(err => {

		console.error(err)

	})
*/





document.body.onload = function(){

	m.route(document.body, '/', {
		'/':         pages['/'].body,
		'/about':    pages['/about'].body,
		'/settings': pages['/settings'].body
	})

}
