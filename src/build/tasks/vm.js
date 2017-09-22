
'use strict'




const request = require('request-promise')
const config = require('config')
const digitalOcean = require('../commons/digital-ocean')
const deps = require('../utils/dependencies')





const constants = {
	urls: {
		digitalOceanUrl: 'https://api.digitalocean.com/v2'
	}
}






const tasks = { }

tasks.createVM = {
	title: 'Create DigitalOcean VM'
}

tasks.createVM.task = ( ) => {

	digitalOcean.setVM({
		name: config.get('vm.name'),
		region: config.get('vm.region'),
		image: config.get('vm.image'),
		size: config.get('vm.size'),
		userData: config.get('vm.userData')
	})

}






module.exports = tasks
