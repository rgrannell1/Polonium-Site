#!/usr/bin/env node

'use strict'

const Listr = require('listr')
const tasks = require('./tasks')
const utils = require('./utils')





const taskLists = { }

taskLists.startDevServer = ( ) => {

	const taskList = new Listr([
		tasks.copyStaticFiles,
		tasks.webPackDevServer,
		tasks.startDevServer
	])

	return taskList

}

taskLists.checkDocs = ( ) => {

	const taskList = new Listr([
		tasks.checkDocs
	])

	return taskList

}

taskLists.buildDistFolder = ( ) => {

	const taskList = new Listr([
		tasks.clean,
		tasks.copyStaticFiles,
		tasks.minifyCss,
		tasks.createWebpackArtifacts,
		tasks.minifyJs
	])

	return taskList

}

taskLists.startServer = ( ) => {

	const taskList = new Listr([
		utils.asTask('Build Dist Folder', taskLists.buildDistFolder),
		tasks.startServer
	])

	return taskList

}

taskLists.startTests = ( ) => {

	const taskList = new Listr([
		utils.asTask('Build Dist Folder', taskLists.buildDistFolder),
//		tasks.startKarma
		tasks.startJSTests
	])

	return taskList

}

taskLists.lintJS = ( ) => {

	const taskList = new Listr([
		tasks.lintJS
	])

	return taskList

}

taskLists.deployDocker = ( ) => {

	const taskList = new Listr([
		utils.asTask('Build Dist Folder', taskLists.buildDistFolder),
		tasks.buildDockerImage
	])

	return taskList

}



module.exports = taskLists
