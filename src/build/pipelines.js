
'use strict'

const models = require('./models')
const stages = require('./stages')
const events = require('events')





const pipelines = { }





pipelines.deployServer = models.Pipeline({
	title: 'Deploy Server',
	stages: [
		stages.buildDistFolder,
		stages.createVM,
		stages.deployServer,
		stages.publishDockerImage
	]
})




pipelines.openSSHTerminal = models.Pipeline({
	title: 'Open SSH Connection',
	stages: [
		stages.openSSHTerminal
	]
})




pipelines.getSSLCertificate = models.Pipeline({
	title: 'Run Depcheck',
	stages: [
		stages.obtainCertificates
	]
})




module.exports = pipelines
