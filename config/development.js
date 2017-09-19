
'use strict'





const userData = `
#cloud-config

packages:
	- git
	- docker.io

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
