
'use strict'

const models = require('../models')
const stages = require('./stages')
const events = require('events')





const pipelines = { }





pipelines.deployServer = models.Pipeline({
	title: 'Deploy Server',
	stages: [
		stages.buildDistFolder,
		stages.createVM,
		stages.deployServer
	]
})




module.exports = pipelines
