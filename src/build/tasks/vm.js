
'use strict'




const request = require('request-promise')
const config = require('config')




const constants = {
	urls: {
		digitalOceanUrl: 'https://api.digitalocean.com/v2/droplets'
	}
}






const tasks = { }

tasks.createVM = {
	title: 'Create DigitalOcean VM'
}

tasks.createVM.task = ( ) => {

	const vmConfig = {
		name: config.get('vm.name'),
		region: config.get('vm.region'),
		image: config.get('vm.image'),
		size: config.get('vm.size')
	}

	const reqOpts = {
		uri:  constants.urls.digitalOceanUrl,
		headers: {
			Authorization: `Bearer ${ config.get('digitalOcean.token') }`
		},
		json: vmConfig
	}

	request.post(reqOpts)
		.then(res => {
			console.log('deployed!')
		})
		.catch(err => {
			console.error(err)
		})

}






module.exports = tasks
