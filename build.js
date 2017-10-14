#!/usr/bin/env node

'use strict'

const neodoc = require('neodoc')
const cli    = require('./src/build')
const events = require('events')
const render = require('./src/build/render/')

process.on('unhandledRejection', err => {
	throw err;
})





const docs = { }

docs.main = `
Usage:`

Object.keys(cli).forEach(commandPrefix => {
	docs.main += '\n    build ' + commandPrefix + ' [' + Object.keys	(cli[commandPrefix]).join('|') + ']'

	docs[commandPrefix] = '\nUsage:'
	Object.keys(cli[commandPrefix]).forEach(command => {

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




function findCommand (args, cli) {

	let command

	Object.keys(cli).forEach(commandPrefix => {

		if (args[commandPrefix]) {

			const commandArgs =  neodoc.run(docs[commandPrefix], {
				optionsFirst: true,
				startOptions: true
			})

			const commandName = Object.keys(cli[commandPrefix]).find(command => commandArgs[command])
			command = cli[commandPrefix][commandName]
		}

	})

	return command

}

const command = findCommand(args, cli)

const buildEvents = new events.EventEmitter( )
command.run(buildEvents)

buildEvents.on('event', render)
