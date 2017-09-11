#!/usr/bin/env node

'use strict'



const path   = require('path')
const Listr  = require('listr')
const exec   = require('execa')
const neodoc = require('neodoc')




const constants = {
	paths: {
		bin:    path.join(__dirname, './node_modules/.bin'),
		client: path.join(__dirname, 'src/client/'),
		dist:   path.join(__dirname, 'dist/')
	},
	bin: {

	}
}

constants.bin.webpack          = path.join(constants.paths.bin, 'webpack')
constants.bin.webPackDevServer = path.join(constants.paths.bin, 'webpack-dev-server')
constants.bin.inchJS           = path.join(constants.paths.bin, 'inchjs')





const tasks = { }

tasks.webPackDevServer = {
	title: 'Bundle client JavaScript dependencies'
}

tasks.webPackDevServer.task = ( ) => {
	return exec.shell(constants.bin.webpack + ' --config webpack.config.js --hot')
}





tasks.copyStaticFiles = {
	title: 'Copy webPack static files'
}

tasks.copyStaticFiles.task = ( ) => {

	return exec.shell('mkdir' + ' -p ' + constants.paths.dist)
		.then(( ) => {

			const copyCss = [
				'cp',
				'-R',
				path.join(constants.paths.client, 'css/'),
				path.join(constants.paths.dist)
			].join(' ')

			return exec.shell(copyCss)

		})
		.then(( ) => {

			const copyHtml = [
				'cp',
				path.join(constants.paths.client, 'index.html'),
				path.join(constants.paths.dist)
			].join(' ')

			return exec.shell(copyHtml)

		})


}




tasks.createWebpackArtifacts = {
	title: 'Run WebPack'
}

tasks.createWebpackArtifacts.task = ( ) => {
	return exec.shell('node_modules/webpack/bin/webpack.js')
}





tasks.createCss = {
	title: 'Minify CSS'
}

tasks.createCss.task = ctx => {

	const steps = ctx.paths.map( ({from, to}) => {
		return exec.shell(`node_modules/minifier/index.js --output ${ to } ${ from }`)
	})

	return Promise.all(steps)

}




tasks.minifyJs = {
	title: 'Minify JavaScript'
}

tasks.minifyJs.task = ( ) => {

	const indexPath = path.join(__dirname, 'dist/build-index.js')

	return exec.shell('node_modules/uglify-js/bin/uglifyjs --compress --output ${indexPath}.min -- ${indexPath}')

}





tasks.startServer = {
	title: 'Start Server'
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
		tasks.createCss,
		tasks.createWebpackArtifacts,
		//tasks.minifyJs,
		tasks.startServer
	])

	const paths = [
		{
			to:   'dist/css/polonium.css',
			from: 'src/client/css/polonium.css'
		}
	]

	taskList.run({
		paths: paths
	}).catch(err => {
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
