#!/usr/bin/env node

'use strict'

const fs     = require('fs')
const path   = require('path')
const Listr  = require('listr')
const exec   = require('execa')
const neodoc = require('neodoc')
const minify = require('minify')
const config = require('config')





const constants = {
	nodeEnv: process.env.NODE_ENV,
	paths: {
		bin: path.join(__dirname, './node_modules/.bin'),
		client: path.join(__dirname, 'src/client/'),
		dist: path.join(__dirname, 'dist/')
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
			to: path.join(constants.paths.dist, 'asset-cache.js')
		},
		{
			from: path.join(constants.paths.client, 'index.html'),
			to: path.join(constants.paths.dist, 'index.html')
		},
		{
			from: path.join(constants.paths.client, '/manifest.json'),
			to: path.join(constants.paths.dist, '/manifest.json')
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

//	return Promise.all([
//		exec.shell(copyCss),
//		exec.shell(copyHtml),
//		exec.shell(copyFont),
//		exec.shell(copyManifest),
//		copyServiceWorker
//	])

}




tasks.createWebpackArtifacts = {
	title: 'Run WebPack'
}

tasks.createWebpackArtifacts.task = ( ) => {
	return exec.shell(constants.bin.webpack)
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

	const indexPath = path.join(__dirname, 'dist/build-index.js')
	const outputPath = path.join(__dirname, 'dist/build-index.min.js')

	if (config.get('build.minifyJS')) {
		return exec.shell(`${ constants.bin.uglifyjs } ${indexPath} ${ outputPath }`)
	} else {
		return exec.shell('cp ' + indexPath + ' ' + outputPath)
	}

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






const docs = { }

docs.main = `
Usage:
	build run start-dev-server
	build run start-server
	build run check-docs
	build run chromeless
`

const args = neodoc.run(docs.main, {
	optionsFirst: true,
	startOptions: true
})






if (args['check-docs']) {
	taskLists.checkDocs( )
} else if (args['start-dev-server']) {
	taskLists.startDevServer( )
} else if (args['start-server']) {
	taskLists.startServer( )
}
