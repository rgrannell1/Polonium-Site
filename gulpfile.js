
'use strict'




const gulp = require('gulp')
const proc = require('child_process')
const path = require('path')
const fs   = require('fs')





const ids = {
	webpack:          'webpack',
	webpackDevServer: 'webpackDevServer',
	copyFiles:        'copyFiles'
}

const nodeBin = './node_modules/.bin/'

const constants = {
	command: {
		webpack:          [
			path.join(__dirname, nodeBin, '/webpack.js'),
			'--config webpack.config.js'
		].join(' '),
		webpackDevServer: [
			path.join(__dirname, nodeBin, '/webpack-dev-server'),
			'--hot',
			'--inline'
		].join(' ')
	},
	tasks: {
		[ids.webpack]: {
			id:       ids.webpack,
			requires: [ ]
		},
		[ids.webpackDevServer]: {
			id:       ids.webpackDevServer,
			requires: [ids.copyFiles]
		},
		[ids.copyFiles]: {
			id:       ids.copyFiles,
			requires: [ ]
		}
	},
	paths: {
		indexHtml:        path.join(__dirname, 'src/client/index.html'),
		distIndexHtml:    path.join(__dirname, 'dist/index.html'),
		normaliseCss:     path.join(__dirname, 'node_modules/skeleton-css/css/normalize.css'),
		skeletonCss:      path.join(__dirname, 'node_modules/skeleton-css/css/skeleton.css'),
		distNormaliseCss: path.join(__dirname, 'dist/css/normalise.css'),
		distSkeletonCss:  path.join(__dirname, 'dist/css/skeleton.css')
	},
	events: {
		finish: 'finish',
		end:    'end'
	}
}






constants.tasks[ids.webpack].task = done => {

	console.log(constants.command.webpack)

	proc.exec(constants.command.webpack, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)

		err ? done(err) : done( )

	})

}

constants.tasks[ids.copyFiles].task = done => {

	const paths = [
		{from: constants.paths.indexHtml,    to: constants.paths.distIndexHtml},
		{from: constants.paths.skeletonCss,  to: constants.paths.distSkeletonCss},
		{from: constants.paths.normaliseCss, to: constants.paths.distNormaliseCss}
	]

	const copyPromises = paths.map(({from, to}) => {

		return new Promise((resolve, reject) => {

			fs.createReadStream(from)
				.pipe(fs.createWriteStream(to))
				.on(constants.events.finish, ( ) => resolve( ))
				.on(constants.events.error, reject)

		})

	})

	Promise.all(copyPromises)
		.then(( ) => done( ))
		.catch(done)

}

constants.tasks[ids.webpackDevServer].task = done => {

	console.log(constants.command.webpackDevServer)

	proc.exec(constants.command.webpackDevServer, (err, stdout, stderr) => {

		console.log(stdout)
		console.error(stderr)

		err ? done(err) : done( )

	})

}






Object.keys(constants.tasks).forEach(id => {
	gulp.task(id, constants.tasks[id].requires, constants.tasks[id].task)
})
