
const credentials = require('./credentials/credentials')

module.exports = {
  digitalOcean: {
    token: process.env.DIGITAL_OCEAN_TOKEN
  },
  docker: {
    username: credentials.dockerUsername,
    email: credentials.dockerEmail,
    password: credentials.dockerPassword,
    imageName: 'polonium_site',
    elasticsearchImageName: 'polonium_elasticsearch'
  },
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  },
  apm: {
    url: process.env.APM_URL || 'http://localhost:8200'
  }
}
