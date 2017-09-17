
'use strict'




const {Chromeless} = require('chromeless')






const runBrowserTest = async (fn) => {

	const chromeless = new Chromeless( )

	await chromeless
		.goto('http://localhost:8080')
		.wait(10000)
		.evaluate(fn)

	await chromeless.end( )

}





module.exports = {
	runBrowserTest
}
