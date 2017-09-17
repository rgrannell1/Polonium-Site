
'use strict'





describe('/ route', ( ) => {

	const expectedIds = [
		'website',
		'password'
	]

	expectedIds.forEach(id => {
		it (`has a #${id} element.`, done => {

			const element = document.getElementById(id)

			element === null
				? done(new Error(`${id} element is missing.`))
				: done( )

		})
	})

})
