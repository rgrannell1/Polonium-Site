
'use strict'



const constants = require('../commons/constants')
const moment = require('moment')




const runPipeline = async (data, emitter) => {

	const startTime = new Date( )

	emitter.emit('event', Object.assign(data, {
		event: constants.events.pipeline.started
	}) )

	emitter.emit('event', Object.assign(data, {
		event: constants.events.pipeline.pending
	}) )

	let hasPassed = true

	for (let stage of data.stages) {

		try {

			await stage.run(emitter)

			var diff = moment(new Date( )).diff(startTime, 'milliseconds')

			emitter.emit('event', Object.assign(data, {
				event: constants.events.pipeline.success,
				diff
			}) )

		} catch (err) {

			hasPassed = false

			emitter.emit('event', Object.assign(data, {
				error: err,
				event: constants.events.pipeline.failure,
				diff
			}) )

			break

		}

	}

	if (hasPassed) {

		emitter.emit('event', Object.assign(data, {
			event: constants.events.pipeline.success
		}) )

	} else {

		emitter.emit('event', Object.assign(data, {
			event: constants.events.pipeline.failure
		}) )

	}

	return emitter

}



const runStage = async (data, emitter) => {

	if (!emitter) {
		throw new Error('emitter not supplied to stage "' + data.title + '"')
	}

	const startTime = new Date( )

	emitter.emit('event', Object.assign(data, {
		event: constants.events.stage.started
	}) )

	emitter.emit('event', Object.assign(data, {
		event: constants.events.stage.pending
	}) )

	let hasPassed = true
	let returnedErr

	for (let step of data.steps) {

		emitter.emit('event', Object.assign(step, {
			event: constants.events.step.started,
			time:  new Date( )
		}) )

		emitter.emit('event', Object.assign(step, {
			event: constants.events.step.pending,
			time:  new Date( )
		}) )


		try {

			await step.run( )

			var diff = moment(new Date( )).diff(startTime, 'milliseconds')

			emitter.emit('event', Object.assign(step, {
				event: constants.events.step.success,
				diff
			}) )

		} catch (err) {

			hasPassed = false
			returnedErr = err

			emitter.emit('event', Object.assign(step, {
				event: constants.events.step.failure,
				error: err,
				diff
			}) )

			break

		}

	}

	if (hasPassed) {

		emitter.emit('event', Object.assign(data, {
			event: constants.events.stage.success
		}) )

	} else {

		emitter.emit('event', Object.assign(data, {
			event: constants.events.stage.failure
		}) )

	}

	if (returnedErr) {
		throw returnedErr
	}

}





const models = { }





models.Stage = ({title, steps}) => {

	const data = {title, steps}

	return {
		data,
		run: runStage.bind(null, data)
	}

}

models.Pipeline = ({title, stages}) => {

	const data = {title, stages}

	return {
		data,
		run: runPipeline.bind(null, data)
	}

}




module.exports = models
