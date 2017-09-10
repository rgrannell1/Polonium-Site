
'use strict'



const buffer = require('buffer')



const stringToArrayBuffer = string => {
	return new TextEncoder('utf8').encode(string)
}






const importKey = key => {

	return Promise.reject( )

	return window.crypto.subtle.importKey(
		'raw',
		stringToArrayBuffer(key),
		{
			name: 'PBKDF2'
		},
		false,
		['deriveBits', 'deriveKey']
	)

}

const exportKey = key => {
	console.log(key)
	return window.crypto.subtle.exportKey('raw', key)
}

const deriveBits = (passwordKey, salt, length) => {

	const iterations = 10000000
	const hashName   = 'SHA-1'

	return window.crypto.subtle.deriveBits({
		name: 'PBKDF2',
		salt: stringToArrayBuffer(salt),
		iterations,
		hash: {
			name: hashName
		}
	}, passwordKey, length)

}





module.exports = {
	importKey,
	deriveBits,
	exportKey
}
