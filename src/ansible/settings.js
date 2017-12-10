#!/usr/bin/env node

'use strict'

const config = require('config')
const DigitalOcean = require('@rgrannell1/utils').digitalOcean

const createInventoryScript = async () => {
  const existingVM = await new DigitalOcean(config.get('digitalOcean.token')).findVMs({name: config.get('vm.name')})

  const result = {
    group: {
      hosts: [
        existingVM.networks.v4[0].ip_address
      ],
      vars: {
        ansible_ssh_user: 'root',
        ansible_ssh_private_key_file: config.get('digitalOcean.sshKeyPath'),
        ansible_python_interpreter: '/usr/bin/python2.7',
        host_key_checking: false,
        docker_username: config.get('docker.username'),
        docker_password: config.get('docker.password'),
        docker_email: config.get('docker.email')
      }
    }
  }

  console.log(JSON.stringify(result, null, 4))
}

createInventoryScript()
