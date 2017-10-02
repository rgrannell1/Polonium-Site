
'use strict'



const fs = require('fs')
const config = require('config')
const request = require('request-promise')
const digitalOcean = require('../../commons/digital-ocean')
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
		exec.shell(`rm ${ config.get('digitalOcean.sshKeyPath') }.pub || true`)
	])

	return exec.shell(`ssh-keygen -t rsa -b 4096 -P '' -f ${ config.get('digitalOcean.sshKeyPath') }`)
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





module.exports = security
