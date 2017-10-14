
'use strict'





const config = require('config')
const fs = require('fs')
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





api.newSSHKey = async (name, publicKey) => {

	const newOpts = {
		uri: `${constants.urls.digitalOceanUrl}/account/keys/`,
		headers: {
			Authorization: `Bearer ${ config.get('digitalOcean.token') }`
		},
		json: {
			name,
			public_key: publicKey
		}
	}

	return request.post(newOpts)

}

api.updateSSHKey = async (name, publicKey) => {

	const existingKey = await api.findSSHKeys({name})

	const deleteOpts = {
		uri: `${constants.urls.digitalOceanUrl}/account/keys/${ existingKey.id }`,
		headers: {
			Authorization: `Bearer ${ config.get('digitalOcean.token') }`
		}
	}

	await request.delete(deleteOpts)
	await api.newSSHKey(name, publicKey)

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

	const signaturePath = config.get('digitalOcean.sshKeyPath') + '.sig'
	const signature = await new Promise((resolve, reject) => {
		fs.readFile(signaturePath, (err, body) => {
			err ? reject(err) : resolve(body.toString( ))
		})
	})

	const sshKey = await api.findSSHKeys({
		name: config.get('digitalOcean.sshKeyName')
	})

	if (signature !== sshKey.fingerprint) {
		throw new Error(`mismatching local / remote SSH key signatures; ${ signature }, ${ sshKey.fingerprint }`)
	}

	if (!existingVM) {

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
				],
				monitoring: true,
				user_data: conf.userData
			}
		}

		return request.post(reqOpts)

	} else {
		// unimplemented at the moment!
	}

}






module.exports = api
