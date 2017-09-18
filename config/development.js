
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
		token: process.env.DIGITAL_OCEAN_TOKEN
	},
	vm: {
		name: 'dev-polonium-site',
		region: 'lon1',
		image: 'ubuntu-16-04-x64',
		size: '512mb',
		userData
	}
}
