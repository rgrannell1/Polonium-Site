
'use strict'




const path = require('path')
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
		new deps.Droplet({ name: config.get('vm.name') }),
		new deps.Path({ path: config.get('digitalOcean.sshKeyPath') })
	])

	const existingVM = await digitalOcean.findVMs({
		name: config.get('vm.name')
	})

	const currentIP = existingVM.networks.v4[0].ip_address

	exec.shell(`export ANSIBLE_CONFIG="src/build/ansible/ansible.cfg" && ansible all -i src/build/ansible/settings.js -m ping`).then(result => {
		console.log(result.stdout)
	})




//	exec.shell(`ansible all -i ../ansible/settings.py ../ansible/setup-vm.yaml`)

}





module.exports = ansible
