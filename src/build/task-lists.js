#!/usr/bin/env node

'use strict'

const tasks = require('./tasks')
const chalk = require('chalk')
const is = require('is')




const runTask = async (tasks, indent) => {

	while (tasks.length > 0) {

		let {title, run} = tasks.shift( )
		let padding = ''.padStart(indent, ' ')

		try {

			is.never.undefined(title)
			is.never.undefined(run)

			await run( )
			var message = padding + chalk.green('✓ ') + title

		} catch (err) {

			var message = padding + chalk.red('x ') + title
			console.error(err)

		}

		console.log(message)

	}

}









const taskLists = { }

taskLists.buildDistFolder = {
	title: 'Build Dist Folder'
}

taskLists.buildDistFolder.run = ( ) => {

	const taskList = [
		tasks.clean,
		tasks.copyStaticFiles,
		tasks.minifyCss,
		tasks.createWebpackArtifacts,
		tasks.minifyJs
	]

	return runTask(taskList, 2)

}










const cli = {
	new: { },
	test: { },
	run: { },
	deploy: { }
}





const newSSHKey = {
	title: 'New SSH Key'
}

newSSHKey.run = ( ) => {

	const taskList = [
		tasks.security.createSSHCert
	]

	return runTask(taskList)

}




const lintJs = {
	title: 'Lint JS Files'
}

lintJs.run = ( ) => {

	const taskList = [
		tasks.lintJS
	]

	return runTask(taskList)

}





const testJS = {
	title: 'Test JS Files'
}

testJS.run = ( ) => {

	const taskList = [
		taskLists.buildDistFolder,
		tasks.startJSTests
	]

	return runTask(taskList)

}





const runLocalServer = {
	title: 'Run Server Locally'
}

runLocalServer.run = ( ) => {

	const taskList = [
		taskLists.buildDistFolder,
		tasks.startServer
	]

	return runTask(taskList)

}




const deployRemoteServer = {
	title: 'Deploy Remote Server'
}

deployRemoteServer.run = ( ) => {

	const taskList = [
		taskLists.buildDistFolder,
		tasks.vm.createVM,
		tasks.ansible.setupVM
	]

	return runTask(taskList)

}






cli.new.ssh_key      = newSSHKey
cli.test.lint_js     = lintJs
cli.run.local_server = runLocalServer
cli.deploy.remote_server = deployRemoteServer




module.exports = cli
