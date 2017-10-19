
'use strict'

const pipelines = require('./pipelines')





const cli = {
	deploy: { },
	open: { },
	run: { }
}

cli.deploy.server        = pipelines.deployServer
cli.open['ssh-terminal'] = pipelines.openSSHTerminal
cli.run['depcheck']      = pipelines.runDepCheck



module.exports = cli
