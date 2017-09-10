
"use strict"



const utils = {
	promise: { }
}




utils.promise.timeout = (fn, timeout) => {

	return new Promise((res, rej) => {
		setTimeout(( ) => res(fn( )), timeout)
	})

}

module.exports = utils
