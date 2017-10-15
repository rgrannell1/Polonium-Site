
'use strict'

const models = require('./models')
const stages = require('./stages')
const events = require('events')





const pipelines = { }





pipelines.deployServer = models.Pipeline({
	title: 'Deploy Server',
	stages: [
//		stages.buildDistFolder,
//		stages.publishDockerImage,
		stages.createVM,
//		stages.deployServer
	]
})




pipelines.openSSHTerminal = models.Pipeline({
	title: 'Open SSH Connection',
	stages: [
		stages.openSSHTerminal
	]
})




module.exports = pipelines
