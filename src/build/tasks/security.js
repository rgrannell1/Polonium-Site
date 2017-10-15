
'use strict'



const fs = require('fs')
const config = require('config')
const request = require('request-promise')
const digitalOcean = require('../commons/digital-ocean')
const exec = require('execa')




const constants = {
	urls: {
		digitalOceanUrl: 'https://api.digitalocean.com/v2'
	}
}





const security = { }




/*
	Create a new, local SSH key.
*/

security.createSSHCert = {
	title: 'Create SSH Certificates'
}

security.createSSHCert.run = async ( ) => {

	await Promise.all([
		exec.shell(`rm "${ config.get('digitalOcean.sshKeyPath') }" || true`),
		exec.shell(`rm ${ config.get('digitalOcean.sshKeyPath') }.pub || true`),
		exec.shell(`rm ${ config.get('digitalOcean.sshKeyPath') }.sig || true`)
	])

	await exec.shell(`ssh-keygen -t rsa -b 4096 -P '' -f ${ config.get('digitalOcean.sshKeyPath') }`)
	const result = await exec.shell(`openssl pkey -in ${ config.get('digitalOcean.sshKeyPath') } -pubout -outform DER | openssl md5 -c`)

	fs.writeFileSync(config.get('digitalOcean.sshKeyPath') + '.sig', result.stdout.replace('(stdin)= ', ''))

	return

}




/*
	Add an SSH key to DigitalOcean.
*/

security.publishSSHCert = {
	title: 'Publish SSH Public Key to DigitalOcean'
}

security.publishSSHCert.run = async ( ) => {

	const publicKeyPath = `${ config.get('digitalOcean.sshKeyPath') }.pub`
	const publicKey = fs.readFileSync(publicKeyPath).toString( )

 	return digitalOcean.setSSHKey(config.get('digitalOcean.sshKeyName'), publicKey)

}






security.openSSHTerminal = {
	title: 'Open SSH Terminal'
}

security.openSSHTerminal.run = async ( ) => {

	const vm = await digitalOcean.findVMs({
		name: config.get('vm.name')
	})

	if (vm) {

		const ip = vm.networks.v4[0].ip_address
		const command = `gnome-terminal -e "ssh ${ config.get('digitalOcean.sshUserName') }@${ip} -i ${ config.get('digitalOcean.sshKeyPath') }"`

		return exec.shell(command)

	} else {

	}


}




module.exports = security
