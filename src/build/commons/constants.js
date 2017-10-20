
'use strict'

const path = require('path')





const constants = {
	urls: {
		digitalOceanUrl: 'https://api.digitalocean.com/v2'
	},
	timeouts: {
		awaitNetwork: 45000
	},
	delays: {
		vmIpAddress: 1000
	},
	events: {
		pipeline: {
			started: 'pipeline/started',
			pending: 'pipeline/pending',
			failure: 'pipeline/failure',
			success: 'pipeline/success'
		},
		stage: {
			started: 'stage/started',
			pending: 'stage/pending',
			failure: 'stage/failure',
			success: 'stage/success'
		},
		step: {
			started: 'step/started',
			pending: 'step/pending',
			failure: 'step/failure',
			success: 'step/success'
		}
	},
	paths: {
		ansibleCfg:                path.join(__dirname, '../ansible/ansible.cfg'),
		ansibleInventory:          path.join(__dirname, '../ansible/settings.js'),
		setupVmPlaybook:           path.join(__dirname, '../ansible/setup-vm.yaml'),
		obtainCertificatePlaybook: path.join(__dirname, '../ansible/obtain-certificates.yaml'),
		startServerPlaybook:       path.join(__dirname, '../ansible/start-server.yaml'),
	}
}




module.exports = constants
