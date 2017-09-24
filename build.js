#!/usr/bin/env node

'use strict'

const neodoc = require('neodoc')
const taskLists = require('./src/build/task-lists')






const docs = { }

docs.main = `
Usage:`

Object.keys(taskLists).forEach(commandPrefix => {
	docs.main += '\n    build ' + commandPrefix + ' [<command>...]'

	docs[commandPrefix] = '\nUsage:'

	Object.keys(taskLists[commandPrefix]).forEach(command => {

		docs[commandPrefix] += '\n    build ' + commandPrefix + ' ' + command

	})

})

docs.main += `

Description:
    Execute a Polonium build-step.
`




const args = neodoc.run(docs.main, {
	optionsFirst: true,
	startOptions: true
})

Object.keys(taskLists).forEach(commandPrefix => {

	if (args[commandPrefix]) {

		const commandArgs =  neodoc.run(docs[commandPrefix], {
			optionsFirst: true,
			startOptions: true
		})

		Object.keys(taskLists[commandPrefix]).forEach(command => {

			if (commandArgs[command]) {

				const task = taskLists[commandPrefix][command].run( )
				task.run( )

			}

		})


	}

})
