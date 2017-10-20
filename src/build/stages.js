#!/usr/bin/env node

'use strict'

const tasks  = require('./tasks')
const models = require('./models')






const stages = { }

stages.buildDistFolder = models.Stage({
	title: 'Build Server & Other Remote Resources',
	steps: [
//		tasks.security.createSSHCert,
//		tasks.security.publishSSHCert,
		tasks.clean,
		tasks.copyStaticFiles,
		tasks.minifyCss,
		tasks.createWebpackArtifacts,
		tasks.minifyJs
	]
})

stages.publishDockerImage = models.Stage({
	title: 'Publish Docker Images',
	steps: [
		tasks.docker.buildDockerImage,
		tasks.docker.login,
		tasks.docker.publishDockerImage
	]
})

stages.lintCode = models.Stage({
	title: 'Link Source-Code ',
	steps: [tasks.lintJS]
})

stages.tests = models.Stage({
	title: 'Test Source-Code',
	steps: [
		tasks.frontEndSystemTests,
		tasks.startJSTests
	]
})

stages.runLocally = models.Stage({
	title: 'Start Local Server',
	steps: [
		tasks.startServer
	]
})

stages.createVM = models.Stage({
	title: 'Create DigitalOcean VM',
	steps: [
		tasks.vm.createVM,
		tasks.security.addDomainRecord
	]
})

stages.runLocally = models.Stage({
	title: 'Start Local Server',
	steps: [
		tasks.startServer
	]
})

stages.deployServer = models.Stage({
	title: 'Deploy Server to DigitalOcean',
	steps: [
		tasks.ansible.setupVM,
		tasks.ansible.obtainCertificates,
		tasks.ansible.startServer
	]
})

stages.openSSHTerminal = models.Stage({
	title: 'Open SSH Connection',
	steps: [
		tasks.security.openSSHTerminal
	]
})





module.exports = stages
