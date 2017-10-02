
'use strict'



const constants = require('../commons/constants')




const runPipeline = async (data, emitter) => {

	emitter.emit('event', Object.assign(data, {
		event: constants.events.pipeline.started
	}) )

	emitter.emit('event', Object.assign(data, {
		event: constants.events.pipeline.pending
	}) )

	for (let stage of data.stages) {

		try {

			await stage.run(emitter)

			emitter.emit('event', Object.assign(data, {
				event: constants.events.pipeline.success
			}) )

		} catch (err) {

			emitter.emit('event', Object.assign(data, {
				error: err,
				event: constants.events.pipeline.failure
			}) )

			break

		}

	}

	return emitter

}



const runStage = async (data, emitter) => {

	if (!emitter) {
		throw new Error('emitter not supplied to stage "' + data.title + '"')
	}

	emitter.emit('event', Object.assign(data, {
		event: constants.events.stage.started
	}) )

	emitter.emit('event', Object.assign(data, {
		event: constants.events.stage.pending
	}) )


	for (let step of data.steps) {

		emitter.emit('event', Object.assign(step, {
			event: constants.events.step.started
		}) )

		emitter.emit('event', Object.assign(step, {
			event: constants.events.step.pending
		}) )

		try {

			await step.run( )

			emitter.emit('event', Object.assign(step, {
				event: constants.events.step.success
			}) )

		} catch (err) {

			emitter.emit('event', Object.assign(step, {
				event: constants.events.step.failure,
				error: err
			}) )

		}

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
