
'use strict'





const logger = ( ) => {

	const state = {
		listeners: [ ]
	}

	const emit = event => {

		state.listeners.forEach( ({predicate, callback}) => {

			if (predicate(event) === true) {
				callback(event)
			}

		} )

	}

	const on = (predicate, callback) => {
		state.listeners.push({predicate, callback})
	}

	return {emit, on}

}






module.exports = logger





logger({
	message: 'foobar'
})