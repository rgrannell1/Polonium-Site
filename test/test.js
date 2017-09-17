
'use strict'





const tests = {
	routes: {
		home: { }
	}
}

tests.routes.home.hasExpectedIds = ( ) => {

	const expectedIds = [
		'icon-brand',
		'website-input-container',
		'password-input-container'
	]

	expectedIds.forEach(id => {
		it (`has a #${id} element.`, done => {

			const element = document.getElementById(id)

			element === null
				? done(new Error(`${id} element is missing.`))
				: done( )

		})
	})

}

tests.routes.home.iconLeadsToHome = ( ) => {

	it('has a logo icon that leads to the home-page', done => {

		const brandLink = document.querySelector('a h1#icon-brand')

		if (brandLink === null) {
			done(new Error(`link not found`))
		}

		done( )


	})

}






describe('/ route', ( ) => {

	tests.routes.home.hasExpectedIds( )
	tests.routes.home.iconLeadsToHome( )

})
