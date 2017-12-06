
const {
  FILE,
  FROM,
  LABEL,
  EXPOSE,
  ENV,
  COPY,
  CMD,
  RUN
} = require('@rgrannell1/utils').docker

module.exports = function (env) {
  return FILE([
    FROM('ubuntu'),
    LABEL({
      maintainer: 'Ryan Grannell <r.grannell2@gmail.com>',
      description: 'This private image runs a Polonium server'
    }),
    EXPOSE('8080'),
    ENV({
      NODE_CONFIG_DIR: '/usr/local/app/dist/config',
      NODE_ENV: 'production'
    }),
    RUN(['mkdir -p /usr/local/app/src']),
    EXPOSE('8080'),
    RUN([
      'apt-get update && apt-get install -y curl git snapd',
      'curl -sL https://deb.nodesource.com/setup_9.x | bash -',
      'apt-get update && apt-get install --assume-yes nodejs letsencrypt',
      'npm install --global yarn'
    ]),
    COPY('config/credentials/certs /etc/letsencrypt/archive/polonium.rgrannell.world'),
    CMD(['node dist/server/app/index.js'])
  ])
}
