
'use strict'

const path = require('path')
const os = require('os')

const constants = require('../commons/constants')
const greenlock = require('greenlock-express')

const letEncryptClient = function letEncryptClient ( ) {

	const configDir = path.join(os.homedir( ), 'letsencrypt', 'etc')

	return greenlock.create({
		server: 'staging',
		configDir,
		approveDomains: function (opts, certs, cb) {

			opts.domains = certs && certs.altnames || opts.domains
			opts.email = 'r.grannell2@gmail.com'
			opts.agreeTos = true

			cb(null, { options: opts, certs: certs })

		},
		debug: true
	})

}

module.exports = {
	letEncryptClient
}
