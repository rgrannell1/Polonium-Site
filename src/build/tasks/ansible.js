
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
		new deps.Executable({ name: 'ansible' }),
		new deps.Droplet({ name: config.get('vm.name') })
	])

	const existingVM = await digitalOcean.findVMs({
		name: config.get('vm.name')
	})

	console.dir(existingVM)


}





module.exports = ansible
