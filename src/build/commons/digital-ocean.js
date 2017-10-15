
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

api.listDomainRecords = async (domain) => {

	const getOpts = {
		uri: `${constants.urls.digitalOceanUrl}/domains/${ domain }/records`,
		headers: {
			Authorization: `Bearer ${ config.get('digitalOcean.token') }`
		}
	}

	return request.get(getOpts)

}

api.findDomainRecord = async (domain, fields) => {

	if (Object.keys(fields).length === 0) {
		throw new Error('no fields provided.')
	}

	const res = JSON.parse(await api.listDomainRecords(domain))

	return res.domain_records.find(recordFields => {

		return Object.keys(fields).every(field => {
			return recordFields[field] === fields[field]
		})

	})

}

api.newDomainRecord = async (conf) => {

	const reqOpts = {
		uri:  `${constants.urls.digitalOceanUrl}/domains/${conf.domain}/records`,
		headers: {
			Authorization: `Bearer ${ config.get('digitalOcean.token') }`
		},
		json: {
			type: conf.type,
			name: conf.subDomain,
			data: conf.ipv4Address,
			priority: null,
			port: null,
			ttl: conf.ttl,
			weight: null,
			flags: null,
			tag: null
		}
	}

	return request.post(reqOpts)

}

api.setDomainRecord = async (conf) => {

	const vm = await api.findVMs({
		name: conf.name
	})

	const ipv4Address = vm.networks.v4[0].ip_address

	if (!vm) {
		throw new Error('cannot add domain-record for non-existing droplet.')
	} else if (!ipv4Address) {
		throw new Error('cannot add domain-record for droplet without IP address.')
	}

	const existingRecord = await api.findDomainRecord(conf.domain, {
		type: 'A',
		name: conf.subDomain,
		data: ipv4Address
	})

	if (!existingRecord) {

		return api.newDomainRecord({
			domain: conf.domain,
			type: 'A',
			subDomain: conf.subDomain,
			ipv4Address,
			ttl: conf.ttl
		})

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

		const publicKey = await new Promise((resolve, reject) => {

			fs.readFile(`${config.get('digitalOcean.sshKeyPath')}.pub`, (err, content) => {
				err ? reject(err) : resolve(content.toString( ))
			})

		})

	//	await api.updateSSHKey(config.get('digitalOcean.sshKeyName'), publicKey)

	//	throw new Error(`mismatching local / remote SSH key signatures; ${ signature }, ${ sshKey.fingerprint }`)
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
