
'use strict'



const config = Object.assign({ },
	require('../default'),
	require('../' + process.env.NODE_ENV)
)

console.log(JSON.stringify(config))
