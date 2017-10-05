
'use strict'

const pipelines = require('./pipelines/pipelines')





const cli = {
	deploy: { },
	run: { }
}

cli.deploy.server       = pipelines.deployServer
cli.run['ssh-terminal'] = pipelines.openSSHTerminal





module.exports = cli
