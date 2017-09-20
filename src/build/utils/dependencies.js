
'use strict'




const execa = require('execa')





const deps = { }





deps.check = schemas => {

	var hasError = false

	return schemas.map(schema => {

		schema
			.then(( ) => {

			})
			.catch(( ) => {

			})


	})
}




class ExecutableDependency {
	constructor (config) {
		this.config = config
	}
	report ( ) {

		this.config.names.map(name => {
			return execa.shell(`which "${name}"`)
				.catch(err => {

					if (err.code === 1) {
						throw new Error(`command "${name}" has no 'which' entry.`)
					}

				})
		})

	}
}





```
module.exports = deps
