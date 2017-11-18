
'use strict'

const fs = require('fs')
const path = require('path')
const exec = require('execa')
const minify = require('minify')
const config = require('config')
const tmp = require('tmp')

const constants = {
  nodeEnv: process.env.NODE_ENV
}

const docker = { }

docker.buildDockerImage = {
  title: 'Build Server Docker Image'
}

docker.buildDockerImage.run = async () => {
  return exec.shell(`docker build -t ${config.docker.imageName}:latest -f src/build/build.dockerfile .`)
}

docker.startDockerImage = {
  title: 'Start Server Docker Image'
}

docker.startDockerImage.run = async () => {
  return exec.shell(`docker run --publish 8080:8080 -t ${config.docker.imageName}:latest`)
}

docker.login = {
  title: 'Log Into DockerHub'
}

docker.login.run = async () => {
  return exec.shell(`docker login --username=${config.docker.username} --password=${config.docker.password}`)
}

docker.startDockerImage = {
  title: 'Start Server Docker Image'
}

// -- get id for image.tag image. push tag.

docker.startDockerImage.run = async () => {
  return exec.shell(`docker run --publish 8080:8080 -t ${config.docker.imageName}:latest`)
}

docker.publishDockerImage = {
  title: 'Publish Docker Image'
}

// -- get id for image.tag image. push tag.

docker.publishDockerImage.run = async () => {
  await exec.shell(`docker tag ${config.docker.imageName} ${config.docker.username}/${config.docker.imageName}:latest`)
  await exec.shell(`docker push ${config.docker.username}/${config.docker.imageName}`)
}

module.exports = docker
