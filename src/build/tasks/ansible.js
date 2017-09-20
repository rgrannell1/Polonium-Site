
'use strict'




const exec = require('execa')
const config = require('config')
const deps = require('../utils/dependencies')
const digitalOcean = require('../commons/digital-ocean')




const ansible = { }

ansible.setupVM = {
	title: 'Install Software'
}

ansible.setupVM.task = async ( ) => {

	await deps.check([
		new deps.Executable({ name: 'ansible' })
	])

	const existingVM = await digitalOcean.findVMs({
		name: config.get('vm.name')
	})


	console.log( existingVM )
	console.log( existingVM )
	console.log( existingVM )
	console.log( existingVM )

}





module.exports = ansible
