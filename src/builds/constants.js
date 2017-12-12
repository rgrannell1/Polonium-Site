
'use strict'

const path = require('path')

const constants = {
  timeouts: {
    awaitNetwork: 45000
  },
  delays: {
    vmIpAddress: 1000
  },
  paths: {
    ansibleInventory: path.join(__dirname, '../ansible/settings.js'),
    ansible: {
      getCerts: path.join(__dirname, '../ansible/obtain-certificates.yaml'),
      startServer: path.join(__dirname, '../ansible/start-server.yaml'),
      setupVm: path.join(__dirname, '../ansible/setup-vm.yaml')
    }
  },
  bin: {
    webpack: 'node_modules/webpack/bin/webpack.js',
    uglifyjs: 'node_modules/uglify-es/bin/uglifyjs',
    minifier: 'node_modules/minifier/index.js'
  }
}

module.exports = constants
