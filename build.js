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
		'test': 'startTests',
		'push': 'updateServer'
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
	build lint
	build run
	build start-dev-server
	build start-docker-server
	build test
	build push
	build new [<command>...]
	build deploy [<command>...]

Description:
	Run Polonium tests, start the server, and perform other build tasks.
`

docs.new = `
Usage:
	build new ssh-key
	build new ssl-certs

Description:
	Create new Polonium certificates.
`





const args = neodoc.run(docs.main, {
	optionsFirst: true,
	startOptions: true
})




const tasks = require('./src/build/tasks')

tasks.vm.createVM.task( )




/*

throw 'xxx'




if (args.new) {

	const newArgs = neodoc.run(docs.new, {
		optionsFirst: true,
		startOptions: true
	})

	if (newArgs['ssh-key']) {

		taskLists.newSSHKey( ).run( ).catch(err => console.error(err))

	} else if (newArgs['ssl-key']) {



	} else {
		throw new Error('asdsad')
	}

} else {
	startTasks(args)
}
*/



