#!/usr/bin/env node

'use strict'




const config = require('config')
const digitalOcean = require('../commons/digital-ocean')





const createInventoryScript = async ( ) => {

	const existingVM = await digitalOcean.findVMs({
		name: config.get('vm.name')
	})

	const result = {
		group: {
			hosts: [
				existingVM.networks.v4[0].ip_address
			],
			vars: {
				ansible_ssh_user: 'ubuntu',
				ansible_ssh_private_key_file: config.get('digitalOcean.sshKeyPath')
			}
		}
	}

	console.log(JSON.stringify(result, null, 4))

}





createInventoryScript( )
