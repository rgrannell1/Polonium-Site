
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
  paths: {
    ansibleInventory: path.join(__dirname, '../ansible/settings.js'),
    setupVmPlaybook: path.join(__dirname, '../ansible/setup-vm.yaml'),
    startServerPlaybook: path.join(__dirname, '../ansible/start-server.yaml'),
    ansible: {
      getCerts: path.join(__dirname, '../ansible/obtain-certificates.yaml')
    },
    dockerfile: path.join(__dirname, '../dockerfiles/build.dockerfile')
  },
  bin: {
    webpack: 'node_modules/webpack/bin/webpack.js',
    uglifyjs: 'node_modules/uglify-es/bin/uglifyjs',
    minifier: 'node_modules/minifier/index.js'
  }
}

module.exports = constants
