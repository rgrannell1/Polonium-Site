
'use strict'




const execa = require('execa')
const chalk = require('chalk')
const path  = require('path')
const fs = require('fs')
const {Enum} = require('enumify')
const digitalOcean = require('../commons/digital-ocean')



class ReportState extends Enum { }

ReportState.initEnum(['FAILED', 'PASSED', 'SKIPPED', 'UNCERTAIN'])



const ok = Promise.resolve
const fail = Promise.reject





let deps = { }

deps.check = schemas => {

	var hasError = false

	const schemaResults = schemas.map(schema => schema.report( ))

	return Promise.all(schemaResults)
		.then(results => {
			results.forEach(result => {
				console.log(result.message)
			})

			const failed = results.some(result => result.status === ReportState.FAILED)

			if (failed) {
				throw new Error('dependencies missing.')
			}

		})

}




const reportStatus = (ctx, message) => {

	return ctx.status( ).then(report => {

		const result = {
			status: report.status
		}

		if (report.status === ReportState.PASSED) {
			result.message = `${ chalk.green('✓') } ${ message }`
		}

		if (report.status === ReportState.FAILED) {
			result.message = `${ chalk.red('❌') } ${ message }`
		}

		return result

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

class EnvVarDependency {
	constructor (config) {
		this.config = config
	}
	status ( ) {

		return new Promise((resolve, reject) => {

			process.env.hasOwnProperty('DIGITAL_OCEAN_TOKEN')
				? resolve({status: ReportState.PASSED})
				: resolve({status: ReportState.FAILED})

		})

	}
	report ( ) {
		return reportStatus(this, `env. variable: ${ path.resolve(this.config.name) }`)
	}
}

class DropletDependency {
	constructor (config) {
		this.config = config
	}
	status ( ) {

		return digitalOcean.findVMs({ name: this.config.name }).then(vm => {

			return vm
				? {status: ReportState.PASSED}
				: {status: ReportState.FAILED}
		})

	}
	report ( ) {
		return reportStatus(this, `droplet: ${ this.config.name }`)
	}
}

class SSHDependency {
	constructor (config) {
		this.config = config
	}
	status ( ) {

		return execa.shell(`ssh -i "${ this.config.path }" ${ this.config.username }@${ this.config.ip } "echo hi"`)
			.then(( ) => {
				return {status: ReportState.PASSED}
			})
			.catch(err => {
				console.log(err)
				return {status: ReportState.FAILED}
			})

	}
	report ( ) {
		return reportStatus(this, `ssh: ${ this.config.username }@${ this.config.ip } ( ${ this.config.path } )`)
	}
}



deps = Object.assign(deps, {
	Executable: ExecutableDependency,
	Path: PathDependency,
	EnvVar: EnvVarDependency,
	Droplet: DropletDependency,
	SSH: SSHDependency
})





module.exports = deps
