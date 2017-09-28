
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

ansible.setupVM.run = async ( ) => {

	await deps.check([
		new deps.Executable({ name: 'ansible' }),
		new deps.Droplet({ name: config.get('vm.name') }),
		new deps.Path({ path: config.get('digitalOcean.sshKeyPath') }),
	], {
		ctx: {
			task: 'Pre-Software Configurations'
		}
	})

	const existingVM = await digitalOcean.findVMs({
		name: config.get('vm.name')
	})

	const currentIP = existingVM.networks.v4[0].ip_address

	await deps.check([
		new deps.SSH({
			path: config.get('digitalOcean.sshKeyPath'),
			username: 'root',
			ip: currentIP
		})
	], {
		ctx: {
			task: 'Pre-Software Configuration'
		}
	})

	exec.shell(`export ANSIBLE_CONFIG="src/build/ansible/ansible.cfg" && ansible-playbook --inventory src/build/ansible/settings.js src/build/ansible/setup-vm.yaml`).then(result => {
		console.log(result.stdout)
	})




//	exec.shell(`ansible all -i ../ansible/settings.py ../ansible/setup-vm.yaml`)

}





module.exports = ansible
