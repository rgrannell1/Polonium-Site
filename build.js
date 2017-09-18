#!/usr/bin/env node

'use strict'

const neodoc = require('neodoc')
const taskLists = require('./src/build/task-lists')





const startTasks = args => {

	const opts = {
		'check-docs': 'checkDocs',
		'deploy': 'deployDocker',
		'lint': 'lintJS',
		'run': 'startServer',
		'start-dev-server': 'startDevServer',
		'start-docker-server': 'startDocker',
		'test': 'startTests'
	}

	var matched = false

	Object.keys(opts).forEach(arg => {

		if (args.hasOwnProperty(arg) && !matched) {

			matched = true
			const taskList = taskLists[opts[arg]]

			if (!taskList) {
				throw new Error('missing taskList')
			}

			taskList( ).run( ).catch(err => {
				console.error(err)
			})

		}

	})

}





const docs = { }

docs.main = `
Usage:
	build check-docs
	build deploy
	build lint
	build run
	build start-dev-server
	build start-docker-server
	build test

Description:
	Run Polonium tests, start the server, and perform other build tasks.
`

const args = neodoc.run(docs.main, {
	optionsFirst: true,
	startOptions: true
})





startTasks(args)
