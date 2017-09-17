#!/usr/bin/env node

'use strict'

const neodoc = require('neodoc')
const taskLists = require('./src/build/tasks')





const startTasks = args => {

	if (args['check-docs']) {
		taskLists.checkDocs( )
	} else if (args['start-dev-server']) {
		taskLists.startDevServer( )
	} else if (args['run']) {
		taskLists.startServer( )
	} else if (args['test']) {
		taskLists.startTests( )
	}

}





const docs = { }

docs.main = `
Usage:
	build run
	build test
	build start-dev-server
	build check-docs

Description:
	Run Polonium tests, start the server, and perform other build tasks.
`

const args = neodoc.run(docs.main, {
	optionsFirst: true,
	startOptions: true
})





startTasks(args)
