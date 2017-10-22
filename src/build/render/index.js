
'use strict'

const ansi = require('ansi-escape-sequences')
const chalk = require('chalk')





const render = data => {

	let indent = ''

	if (data && !data.event) {
		throw new Error(JSON.stringify(data))
	}

	if (data.event.startsWith('stage')) {
		indent = '  '
	}

	if (data.event.startsWith('step')) {
		indent = '    '
	}

	let [type, result] = data.event.split('/')

	if (type === 'step') {
		type = '  ' + type
	}

	if (type === 'stage') {
		type = ' ' + type
	}

	const diff = data.diff ? (data.diff / 1000).toFixed(1) : ''

	const message = data.diff
		? `[${type}] ${diff}s ${indent}        ${data.title}`
		: `[${type}]          ${indent}        ${data.title}`

	if (result === 'pending') {

		console.log(message + chalk.yellow(' ...'))
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
