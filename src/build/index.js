
'use strict'





const pipelines = require('./pipelines/pipelines')
const constants = require('./commons/constants')
const render = require('./render')
const events = require('events')



const runneable = { }




async function test ( ) {

	const emitter = new events.EventEmitter( )
		.on('event', render)

	await pipelines.deployServer.run(emitter);

}




test( )