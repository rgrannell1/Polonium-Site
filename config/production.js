
const path = require('path')
const credentials = require('./credentials/credentials.json')

const userData = `
#cloud-config

apt-get install git docker.io python2.7 --assume-yes
`

module.exports = {
  build: {
    minifyJS: true,
    minifyCSS: true
  },
  digitalOcean: {
    sshKeyName: 'polonium_ssh_key',
    sshKeyPath: 'config/credentials/prod_key'
  },
  vm: {
    name: 'prod-polonium-site',
    region: 'lon1',
    image: 'ubuntu-16-04-x64',
    size: '512mb',
    userData
  },
  ssl: {
    privateKey: path.resolve('config/credentials/certs/privkey1.pem'),
    cert: path.resolve('config/credentials/certs/cert1.pem'),
    chain: path.resolve('config/credentials/certs/fullchain1.pem')
  },
  tests: {

  }
}
