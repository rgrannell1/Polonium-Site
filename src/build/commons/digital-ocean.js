
'use strict'





const config = require('config')
const request = require('request-promise')
const constants = require('./constants')




const api = { }




api.listSSHKeys = ( ) => {

	const listOpts = {
		url: `${constants.urls.digitalOceanUrl}/account/keys`,
		headers: {
			Authorization: `Bearer ${ config.get('digitalOcean.token') }`
		}
	}

	return request.get(listOpts)

}





api.findSSHKeys = async fields => {

	if (Object.keys(fields).length === 0) {
		throw new Error('no fields provided.')
	}

	const res = JSON.parse(await api.listSSHKeys( ))

	return res.ssh_keys.find(keyFields => {

		return Object.keys(fields).every(field => {
			return keyFields[field] === fields[field]
		})

	})

}





api.updateSSHKey = async (name, publicKey) => {

	throw new Error('not implemented!')

}





api.setSSHKey = async (name, publicKey) => {

	const existingKey = await api.findSSHKeys({name})

	if (!existingKey) {
		return api.newSSHKey(name, publicKey)
	} else if (existingKey.public_key.trim( ) !== publicKey.trim( )) {
		return api.updateSSHKey(name, publicKey)
	}

}





api.listVMs = async ( ) => {

	const reqOpts = {
		uri: `${constants.urls.digitalOceanUrl}/droplets?`,
		headers: {
			Authorization: `Bearer ${ config.get('digitalOcean.token') }`
		}
	}

	return request.get(reqOpts)

}

api.findVMs = async fields => {

	if (Object.keys(fields).length === 0) {
		throw new Error('no fields provided.')
	}

	const res = JSON.parse(await api.listVMs( ))

	return res.droplets.find(keyFields => {

		return Object.keys(fields).every(field => {
			return keyFields[field] === fields[field]
		})

	})

}



api.setVM = async conf => {

	const existingVM = await api.findVMs({
		name: config.get('vm.name')
	})

	if (!existingVM) {

		const sshKey = await api.findSSHKeys({
			name: config.get('digitalOcean.sshKeyName')
		})

		const reqOpts = {
			uri:  `${constants.urls.digitalOceanUrl}/droplets`,
			headers: {
				Authorization: `Bearer ${ config.get('digitalOcean.token') }`
			},
			json: {
				name: conf.name,
				region: conf.region,
				image: conf.image,
				size: conf.size,
				ssh_keys: [
					sshKey.fingerprint
				]
			}
		}

		return request.post(reqOpts)

	} else {
		// unimplemented at the moment!
	}

}






module.exports = api
