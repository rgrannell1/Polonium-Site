
'use strict'

const avow = require('avow')
const request = require('request-promise')
const config = require('config')
const digitalOcean = require('../commons/digital-ocean')
const deps = require('../commons/dependencies')
const constants = require('../commons/constants')
const exec = require('execa')

const tasks = { }

tasks.createVM = {
  title: 'Create DigitalOcean VM'
}

tasks.createVM.run = async () => {
  await digitalOcean.setVM({
    name: config.get('vm.name'),
    region: config.get('vm.region'),
    image: config.get('vm.image'),
    size: config.get('vm.size'),
    userData: config.get('vm.userData')
  })

  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('failed to setup network within set time.'))
    }, 45000)
  })

  const ensure = Promise.retry(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        digitalOcean.findVMs({
          name: config.get('vm.name')
        })
        .then(existingVM => {
  existingVM.networks.v4[0].ip_address
})
        .then(resolve, reject)
      }, 1000)
    })
  }, 10)

  return Promise.race([timeout, ensure])
}

module.exports = tasks
