
'use strict'

const fs = require('fs')
const path = require('path')
const exec = require('execa')
const minify = require('minify')
const config = require('config')
const tmp = require('tmp')




const constants = {
	nodeEnv: process.env.NODE_ENV,
	images: {
		dockerSite: 'polonium_site'
	}
}





const docker = { }





docker.buildDockerImage = {
	title: 'Build Server Docker Image'
}

docker.buildDockerImage.run = async ( ) => {
	return exec.shell(`docker build -t ${ constants.images.dockerSite } -f src/build/build.dockerfile .`)
}



docker.startDockerImage = {
	title: 'Start Server Docker Image'
}

docker.startDockerImage.run = async ( ) => {
	return exec.shell('docker run --publish 8080:8080 -t polonium_site:latest')
}






module.exports = docker
