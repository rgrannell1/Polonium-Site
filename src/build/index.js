
'use strict'

const pipelines = require('./pipelines')





const cli = { }

cli.deploy = {
	server: pipelines.deployServer
}
cli.open = {
	'ssh-terminal': pipelines.openSSHTerminal
}
cli.run = {
	'depcheck': pipelines.runDepCheck
}
cli.get = {
	'ssl-certificate': pipelines.getSSLCertificate
}

module.exports = cli
