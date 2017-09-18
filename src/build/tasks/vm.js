
'use strict'




const request = require('request-promise')
const config = require('config')




const constants = {
	urls: {
		digitalOceanUrl: 'https://api.digitalocean.com/v2/droplets'
	}
}






const tasks = { }

tasks.createVM = ( ) => {

	const vmConfig = {
		name: config.get('vm.name'),
		region: config.get('vm.region'),
		image: config.get('vm.image')
	}

	const reqOpts = {
		uri:  constants.urls.digitalOceanUrl,
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
