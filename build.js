#!/usr/bin/env node

'use strict'

const neodoc = require('neodoc')
const taskLists = require('./src/build/task-lists')





const startTasks = args => {

	var task

	if (args['check-docs']) {
		task = taskLists.checkDocs( )
	} else if (args['start-dev-server']) {
		task = taskLists.startDevServer( )
	} else if (args['run']) {
		task = taskLists.startServer( )
	} else if (args['test']) {
		task = taskLists.startTests( )
	} else if (args['lint']) {
		task = taskLists.lintJS( )
	} else if (args['deploy']) {
		task = taskLists.deployDocker( )
	}

	task.run( ).catch(err => {
		console.error(err)
	})

}





const docs = { }

docs.main = `
Usage:
	build run
	build test
	build lint
	build start-dev-server
	build check-docs
	build deploy

Description:
	Run Polonium tests, start the server, and perform other build tasks.
`

const args = neodoc.run(docs.main, {
	optionsFirst: true,
	startOptions: true
})





startTasks(args)
