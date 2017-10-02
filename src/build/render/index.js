
'use strict'

const ansi = require('ansi-escape-sequences')
const chalk = require('chalk')





const render = data => {

	let indent = ''

	if (data.event.startsWith('stage')) {
		indent = '  '
	}

	if (data.event.startsWith('step')) {
		indent = '    '
	}

	let [type, result] = data.event.split('/')

	const message = '[' + type + ']   ' + indent + data.title

	if (result === 'pending') {

		console.log(message + ' ...')
	}

	if (result === 'success') {

		console.log(message + ' ' + chalk.green('✓'))

	}

	if (result === 'failure') {

		console.log(message + ' ' + chalk.red('x'))
		console.log(data.error)

	}



}




module.exports = render
