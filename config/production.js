#!/usr/bin/env node

'use strict'





const userData = `
#cloud-config

packages:
	- git
	- docker.io

`

module.exports = {
	build: {
		minifyJS: true,
		minifyCSS: true
	},
	digitalOcean: {
		token: process.env.DIGITAL_OCEAN_TOKEN
	},
	vm: {
		name: 'prod-polonium-site',
		region: 'lon1',
		image: 'ubuntu-16-04-x64',
		size: '512mb',
		userData
	}
}
