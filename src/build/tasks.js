#!/usr/bin/env node

'use strict'

const fs     = require('fs')
const path   = require('path')
const Listr  = require('listr')
const exec   = require('execa')
const minify = require('minify')
const config = require('config')





const constants = {
	nodeEnv: process.env.NODE_ENV,
	paths: {
		bin: path.join(__dirname, '../../node_modules/.bin'),
		client: path.join(__dirname, '../../src/client/'),
		dist: path.join(__dirname, '../../dist/')
	},
	bin: {
		webpack: 'node_modules/webpack/bin/webpack.js',
		minifier: 'node_modules/minifier/index.js',
		uglifyjs: 'node_modules/uglify-es/bin/uglifyjs'
	}
}

constants.bin.webpack = path.join(constants.paths.bin, 'webpack')
constants.bin.webPackDevServer = path.join(constants.paths.bin, 'webpack-dev-server')
constants.bin.inchJS = path.join(constants.paths.bin, 'inchjs')






const tasks = { }

tasks.webPackDevServer = {
	title: 'Bundle client JavaScript dependencies'
}

tasks.webPackDevServer.task = ( ) => {
	return exec.shell(constants.bin.webpack + ' --config webpack.config.js --hot')
}




tasks.clean = {
	title: 'Clean Artifact Folder'
}

tasks.clean.task = async ( ) => {

	await exec.shell('rm -rf ' + constants.paths.dist)
	await exec.shell('mkdir' + ' -p ' + constants.paths.dist)

	return

}




tasks.copyStaticFiles = {
	title: 'Copy WebPack static files'
}

tasks.copyStaticFiles.task = async ( ) => {

	await exec.shell('mkdir' + ' -p ' + constants.paths.dist + '/css')
	await exec.shell('mkdir' + ' -p ' + constants.paths.dist + '/fonts')

	const copyCss = [
		'cp',
		'-R',
		path.join(constants.paths.client, 'css/'),
		path.join(constants.paths.dist)
	].join(' ')

	const pairs = [
		{
			from:  path.join(constants.paths.client, 'fonts/NotoSans.ttf'),
			to: path.join(constants.paths.dist, 'fonts/NotoSans.ttf')
		},
		{
			from:  path.join(constants.paths.client, '/core/asset-cache.js'),
			to: path.join(constants.paths.dist, 'build-service-worker.js')
		},
		{
			from: path.join(constants.paths.client, 'index.html'),
			to: path.join(constants.paths.dist, 'index.html')
		},
		{
			from: path.join(constants.paths.client, '/manifest.json'),
			to: path.join(constants.paths.dist, '/manifest.json')
		},
		{
			from: path.join(constants.paths.client, '/favicon.ico'),
			to: path.join(constants.paths.dist, '/favicon.ico')
		}
	]

	const copyPromises = pairs.map(({from, to}) => {

		return new Promise((res, rej) => {
			fs.copyFile(from, to, err => {
				err ? rej(err) : res( )
			})
		})

	})

	return Promise.all(copyPromises)

}




tasks.createWebpackArtifacts = {
	title: 'Run WebPack'
}

tasks.createWebpackArtifacts.task = ( ) => {

	return Promise.all([
		exec.shell(`${constants.bin.webpack} --config webpack.config.js`),
		exec.shell(`${constants.bin.webpack} --config webpack-service-worker.config.js`)
	])

}





tasks.minifyCss = {
	title: config.get('build.minifyCSS') ? 'Minify CSS' : 'Copy CSS'
}

tasks.minifyCss.task = ( ) => {

	const paths = [
		{
			to:   'dist/css/polonium.css',
			from: 'src/client/css/polonium.css'
		}
	]

	const steps = paths.map( ({from, to}) => {

		return config.get('build.minifyCSS')
			? exec.shell(`${ constants.bin.minifier } --output ${ to } ${ from }`)
			: exec.shell(`cp ${ from } ${ to }`)

	})

	return Promise.all(steps)

}




tasks.minifyJs = {
	title: config.get('build.minifyJS') ? 'Minify JavaScript' : 'Copy JS'

}

tasks.minifyJs.task = ( ) => {

	const paths = [
		{
			from: path.join(constants.paths.dist, 'build-index.js'),
			to: path.join(constants.paths.dist, 'build-index.min.js')
		},
		{
			from: path.join(constants.paths.dist, '/build-service-worker.js'),
			to: path.join(constants.paths.dist, '/build-service-worker.min.js')
		},
	]

	const minifyPromises = paths.map(({from, to}) => {

		if (config.get('build.minifyJS')) {
			return exec.shell(`${ constants.bin.uglifyjs } ${from} ${ to }`)
		} else {
			return exec.shell('cp ' + from + ' ' + to)
		}

	})

	return Promise.all(minifyPromises)

}




tasks.startKarma = {
	title: 'Start Karma Tests'
}

tasks.startKarma.task = ( ) => {
	return exec.shell("karma start --single-run --browsers ChromeHeadless karma.conf.js")
}





tasks.startServer = {
	title: 'Start Server (' + constants.nodeEnv + ')'
}

tasks.startServer.task = ctx => {

	const indexPath = path.join(__dirname, 'src/server/app/index.js')

	return exec.shell(`node ${indexPath}`)

}




tasks.startDevServer = {
	title: 'Start development server'
}

tasks.startDevServer.task = ( ) => {
	return exec.shell(constants.bin.webPackDevServer + ' --content-base src' + ' --public	' + ' --hot' + ' --inline' + ' --host 0.0.0.0')
}

tasks.checkDocs = {
	title: 'Check source-code documentation'
}

tasks.checkDocs.task = ( ) => {

	return exec.shell(constants.bin.inchJS)
		.then(output => {

			console.log(output)

		})

}




const taskLists = { }

taskLists.startDevServer = ( ) => {

	const taskList = new Listr([
		tasks.copyStaticFiles,
		tasks.webPackDevServer,
		tasks.startDevServer
	])

	taskList.run( ).catch(err => {
		console.error(err)
	})

}

taskLists.checkDocs = ( ) => {

	const taskList = new Listr([
		tasks.checkDocs
	])

	taskList.run( ).catch(err => {
		console.error(err)
	})

}

taskLists.startServer = ( ) => {

	const taskList = new Listr([
		tasks.clean,
		tasks.copyStaticFiles,
		tasks.minifyCss,
		tasks.createWebpackArtifacts,
		tasks.minifyJs,
		tasks.startServer
	])

	taskList.run( ).catch(err => {
		console.error(err)
	})

}

taskLists.startTests = ( ) => {

	const taskList = new Listr([
		tasks.clean,
		tasks.copyStaticFiles,
		tasks.minifyCss,
		tasks.createWebpackArtifacts,
		tasks.minifyJs,
		tasks.startKarma
	])

	taskList.run( ).catch(err => {
		console.error(err)
	})

}






module.exports = taskLists
