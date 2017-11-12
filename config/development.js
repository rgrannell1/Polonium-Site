
const path = require('path')
const credentials = require('./credentials/credentials.json')

const userData = `
#!/bin/bash

apt-get install git docker.io python2.7 --assume-yes
`

module.exports = {
  build: {
    minifyJS: false,
    minifyCSS: false
  },
  digitalOcean: {
    sshUserName: 'root',
    sshKeyName: 'polonium_ssh_key',
    sshKeyPath: path.resolve('config/credentials/dev_key')
  },
  ssl: {
    privateKey: path.resolve('config/credentials/local_ssl_certs/privkey1.pem'),
    cert: path.resolve('config/credentials/local_ssl_certs/cert1.pem'),
    chain: null
  },
  vm: {
    name: 'dev-polonium-site',
    region: 'lon1',
    image: 'ubuntu-16-04-x64',
    size: '512mb',
    userData,
    domain: credentials.vmDomain,
    subDomain: 'polonium'
  },
  tests: {

  },
  docker: {
    imageName: 'polonium_site'
  }
}
