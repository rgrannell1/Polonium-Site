#!/usr/bin/env node

'use strict'





const userData = `
#cloud-config

apt-get install git docker.io python2.7 --assume-yes
`

module.exports = {
	build: {
		minifyJS: true,
		minifyCSS: true
	},
	digitalOcean: {
		sshKeyName: 'polonium_ssh_key',
		sshKeyPath: 'config/credentials/prod_key'
	},
	vm: {
		name: 'prod-polonium-site',
		region: 'lon1',
		image: 'ubuntu-16-04-x64',
		size: '512mb',
		userData
	},
	tests: {

	}
}
