
'use strict'




const path = require('path')
const exec = require('execa')
const config = require('config')
const deps = require('../commons/dependencies')
const digitalOcean = require('../commons/digital-ocean')
const constants = require('../commons/constants')




const ansible = { }

ansible.setupVM = {
	title: 'Install Software'
}

async function runAnsiblePlaybook (ansiblePlaybook) {

	await deps.check([
		new deps.Executable({ name: 'ansible' }),
		new deps.Droplet({ name: config.get('vm.name') }),
		new deps.Path({ path: config.get('digitalOcean.sshKeyPath') }),
	])

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
	])

	return exec.shell(`export ANSIBLE_CONFIG="${ constants.paths.ansibleCfg }" && ansible-playbook --inventory "${ constants.paths.ansibleInventory }" "${ ansiblePlaybook }"`).then(result => {
		//console.log(result.stdout)
	})

}

ansible.setupVM.run = async ( ) => {
	return runAnsiblePlaybook(constants.paths.setupVmPlaybook)
}

ansible.obtainCertificates = {
	title: 'Obtain LetsEncrypt Certificates'
}

ansible.obtainCertificates.run = async ( ) => {
	return runAnsiblePlaybook(constants.paths.obtainCertificatePlaybook)
}

ansible.startServer = {
	title: 'Start Server'
}

ansible.startServer.run = async ( ) => {
	return runAnsiblePlaybook(constants.paths.startServerPlaybook)
}





module.exports = ansible
