
const path = require('path')
const credentials = require('./credentials/credentials.json')

const userData = `
#!/bin/bash

apt-get install git docker.io python2.7 --assume-yes
`

module.exports = {
  build: {
    minifyJS: true,
    minifyCSS: true
  },
  digitalOcean: {
    sshUserName: 'root',
    sshKeyName: 'polonium_ssh_key',
    sshKeyPath: path.resolve('config/credentials/dev_key')
  },
  ssl: {
    privateKey: path.join(__dirname, 'credentials/certs/privkey1.pem'),
    cert: path.join(__dirname, 'credentials/certs/cert1.pem'),
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
  }
}
