
"use strict"




const forge = require('node-forge')
// const polonium  = require('polonium')




const processes = {
	//getPassword: require('worker-loader!./workers')
	getPassword: require('./workers')
}





function foo ( ) {

	/*
	const getPasswordWorker = new processes.getPassword

	getPasswordWorker.postMessage({
		a: 'xxx'
	})



	const bar = new Promise((resolve, reject) => {

		forge.pbkdf2('a', '0123456789abc', 1000, 20, (err, value) => {

			resolve(value)

		})

	})

	bar.then(value => {

		console.log(
			forge.util.bytesToHex(value)
		)

	})
	*/


}




module.exports = {
	foo
}
