
'use strict'




const execa = require('execa')
const chalk = require('chalk')
const path  = require('path')
const fs = require('fs')
const {Enum} = require('enumify')



class ReportState extends Enum { }

ReportState.initEnum(['FAILED', 'PASSED', 'SKIPPED', 'UNCERTAIN'])



const ok = Promise.resolve
const fail = Promise.reject





const deps = { }

deps.check = schemas => {

	var hasError = false

	const schemaResults = schemas.map(schema => {

		schema.report( )
			.then(message => {
				console.log(message)
			})
			.catch(( ) => { })

	})

	return Promise.all(schemaResults)

}




const reportStatus = (ctx, message) => {

	return ctx.status( ).then(report => {

		switch (report.status) {
			case ReportState.PASSED:
				return `${ chalk.green('✓') } ${ message }`
				break
			case ReportState.FAILED:
				return `${ chalk.red('❌') } ${ message }`
				break
		}

	})

}





class ExecutableDependency {
	constructor (config) {
		this.config = config
	}
	status ( ) {

		return execa.shell(`which "${ this.config.name }"`)
			.then( ( )  => ({status: ReportState.PASSED}) )
			.catch( ( ) => ({status: ReportState.FAILED}) )

	}
	report ( ) {
		return reportStatus(this, `executable: ${ this.config.name }`)
	}
}

class PathDependency {
	constructor (config) {
		this.config = config
	}
	status ( ) {

		return new Promise((resolve, reject) => {
			fs.stat(this.config.path, err => {

				err
					? resolve({status: ReportState.FAILED})
					: resolve({status: ReportState.PASSED})

			})
		})

	}
	report ( ) {
		return reportStatus(this, `path: ${ path.resolve(this.config.path) }`)
	}
}




deps.Executable = ExecutableDependency
deps.Path = PathDependency




module.exports = deps
