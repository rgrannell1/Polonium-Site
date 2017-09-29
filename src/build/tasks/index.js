
'use strict'

const fs = require('fs')
const path = require('path')
const Listr = require('listr')
const exec = require('execa')
const minify = require('minify')
const config = require('config')
const tmp = require('tmp')




const constants = {
	nodeEnv: process.env.NODE_ENV,
	paths: {
		bin: path.join(__dirname, '../../../node_modules/.bin'),
		client: path.join(__dirname, '../../../src/client/'),
		server: path.join(__dirname, '../../../src/server/'),
		tests:  path.join(__dirname, '../../../test/'),
		dist: path.join(__dirname, '../../../dist/')
	},
	bin: {
		webpack: 'node_modules/webpack/bin/webpack.js',
		minifier: 'node_modules/minifier/index.js',
		uglifyjs: 'node_modules/uglify-es/bin/uglifyjs'
	},
	images: {
		dockerSite: 'polonium_site'
	}
}

constants.bin.webpack = path.join(constants.paths.bin, 'webpack')
constants.bin.webPackDevServer = path.join(constants.paths.bin, 'webpack-dev-server')
constants.bin.inchJS = path.join(constants.paths.bin, 'inchjs')

constants.paths.browserTests = path.join(constants.paths.tests, 'browser.js')




const tasks = { }

tasks.webPackDevServer = {
	title: 'Bundle client JavaScript dependencies'
}

tasks.webPackDevServer.run = ( ) => {
	return exec.shell(constants.bin.webpack + ' --config webpack/webpack.config.js --hot')
}




tasks.clean = {
	title: 'Clean Artifact Folder'
}

tasks.clean.run = async ( ) => {

	await exec.shell('rm -rf ' + constants.paths.dist)
	await exec.shell('mkdir' + ' -p ' + constants.paths.dist)

	return

}




tasks.copyStaticFiles = {
	title: 'Copy WebPack static files'
}

tasks.copyStaticFiles.run = async ( ) => {

	await exec.shell('mkdir -p ' + constants.paths.dist + '/css')
	await exec.shell('mkdir -p ' + constants.paths.dist + '/fonts')

	const folders = [
		{
			from: path.join(constants.paths.client, 'css/'),
			into: constants.paths.dist
		},
		{
			from: constants.paths.server,
			into: constants.paths.dist
		}
	]

	const files = [
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
		},
		{
			from: path.join('package.json'),
			to: path.join(constants.paths.dist, '/package.json')
		}
	]

	const copyFolderPromises = folders.map(({from, into}) => {
		return exec.shell(`cp -R ${from} ${into}`)
	})

	const copyFilePromises = files.map(({from, to}) => {

		return new Promise((res, rej) => {
			fs.copyFile(from, to, err => {
				err ? rej(err) : res( )
			})
		})

	})

	return Promise.all(copyFilePromises.concat(copyFolderPromises))

}




tasks.createWebpackArtifacts = {
	title: 'Run WebPack'
}

tasks.createWebpackArtifacts.run = ( ) => {

	return Promise.all([
		exec.shell(`${constants.bin.webpack} --config webpack/webpack.config.js`),
		exec.shell(`${constants.bin.webpack} --config webpack/webpack-service-worker.config.js`)
	])

}





tasks.minifyCss = {
	title: config.get('build.minifyCSS') ? 'Minify CSS' : 'Copy CSS'
}

tasks.minifyCss.run = ( ) => {

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

tasks.minifyJs.run = ( ) => {

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

tasks.startKarma.run = ( ) => {
	return exec.shell("karma start --single-run --browsers ChromeHeadless karma.conf.js")
}




tasks.startJSTests = {
	title: 'mkdasjkdasjkasdjkasd'
}

tasks.startJSTests.run = ( ) => {
	return exec.shell("node /home/ryan/Code/polonium-server/test/cases/test.js")
}





tasks.startServer = {
	title: 'Start Server (' + constants.nodeEnv + ')'
}

tasks.startServer.run = ctx => {

	const indexPath = path.join(constants.paths.server, 'app/index.js')

	return exec.shell(`node ${indexPath}`)

}





tasks.lintJS = {
	title: 'Lint JS'
}

tasks.lintJS.run = ctx => {
	return exec.shell(`node_modules/eslint/bin/eslint.js ${constants.paths.client}`)
}



tasks.frontEndSystemTests = {
	title: 'Run Front-End System Tests'
}

tasks.frontEndSystemTests.run = ( ) => {
	return exec.shell(`node ${constants.paths.browserTests}`)
}





tasks.startDevServer = {
	title: 'Start development server'
}

tasks.startDevServer.run = ( ) => {
	return exec.shell(constants.bin.webPackDevServer + ' --content-base src' + ' --public	' + ' --hot' + ' --inline' + ' --host 0.0.0.0')
}

tasks.checkDocs = {
	title: 'Check source-code documentation'
}

tasks.checkDocs.run = ( ) => {

	return exec.shell(constants.bin.inchJS)
		.then(output => {


		})

}




tasks.buildDockerImage = {
	title: 'Build Server Docker Image'
}

tasks.buildDockerImage.run = ctx => {
	return exec.shell(`docker build -t ${ constants.images.dockerSite } -f src/build/build.dockerfile .`)
}



tasks.startDockerImage = {
	title: 'Start Server Docker Image'
}

tasks.startDockerImage.run = ( ) => {
	return exec.shell('docker run --publish 8080:8080 -t polonium_site:latest')
}





const out = tasks

tasks.vm = require('./vm')
tasks.security = require('./security')
tasks.ansible = require('./ansible')





module.exports = tasks
