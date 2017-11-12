
const credentials = require('./credentials/credentials')

module.exports = {
  digitalOcean: {
    token: process.env.DIGITAL_OCEAN_TOKEN
  },
  docker: {
    username: credentials.dockerUsername,
    email: credentials.dockerEmail,
    password: credentials.dockerPassword
  }
}
