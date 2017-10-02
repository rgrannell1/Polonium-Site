#!/usr/bin/env node

'use strict'

const neodoc    = require('neodoc')
const pipelines = require('./src/build')

require('longjohn');






const docs = { }

docs.main = `
Usage:`

Object.keys(pipelines).forEach(commandPrefix => {
	docs.main += '\n    build ' + commandPrefix + ' [' + Object.keys	(pipelines[commandPrefix]).join('|') + ']'

	docs[commandPrefix] = '\nUsage:'

	Object.keys(pipelines[commandPrefix]).forEach(command => {

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

Object.keys(pipelines).forEach(commandPrefix => {

	if (args[commandPrefix]) {

		const commandArgs =  neodoc.run(docs[commandPrefix], {
			optionsFirst: true,
			startOptions: true
		})

		Object.keys(taskLists[commandPrefix]).forEach(command => {

			if (commandArgs[command]) {

				const task = taskLists[commandPrefix][command].run( )

				task.catch(err => {
					console.error(err)
				})

			}

		})

	}

})
