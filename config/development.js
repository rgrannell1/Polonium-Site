#!/usr/bin/env node

'use strict'





const userData = `
#!/bin/bash

apt-get install git docker.io python2.7 --assume-yes
`

module.exports = {
	build: {
		minifyJS: false,
		minifyCSS: false
	},
	digitalOcean: {
		token: process.env.DIGITAL_OCEAN_TOKEN,
		sshKeyName: 'polonium_ssh_key',
		sshKeyPath: 'config/credentials/dev_key'
	},
	vm: {
		name: 'dev-polonium-site',
		region: 'lon1',
		image: 'ubuntu-16-04-x64',
		size: '512mb',
		userData
	}
}
