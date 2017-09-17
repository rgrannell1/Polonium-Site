
'use strict'





const tests = {
	routes: {
		home: { }
	}
}





tests.routes.home.hasExpectedIds = ( ) => {

	return new Promise((res, rej) => {

		const expectedIds = [
			'icon-brand',
			'website-input-container',
			'password-input-container'
		]

		expectedIds.forEach(id => {
			it (`has a #${id} element.`, done => {

				const element = document.getElementById(id)

				if (element === null) {
					done(new Error(`${id} element is missing.`))
					rej( )
				} else {
					done( )
					res( )
				}

			})
		})

	})


}

tests.routes.home.iconLeadsToHome = ( ) => {

	return new Promise((res, rej) => {

		it('has a logo icon that leads to the home-page', done => {

			const brandLink = document.querySelector('a h1#icon-brand')

			if (brandLink === null) {
				done(new Error(`link not found`))
				rej( )
			} else {
				done( )
				res( )
			}

		})

	})

}





describe('/ route', done => {

	const testPromises = [
		tests.routes.home.hasExpectedIds( ),
		tests.routes.home.iconLeadsToHome( )
	]

	setTimeout(( ) => {

		throw 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
		Promise.all(done).then(done, done)

	}, 9000)

})
