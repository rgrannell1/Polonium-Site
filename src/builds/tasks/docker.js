
const {
  ADD,
  CMD,
  COPY,
  ENV,
  EXPOSE,
  FILE,
  FROM,
  HEALTHCHECK,
  LABEL,
  RUN,
  WORKDIR
} = require('@rgrannell1/utils').docker

const poloniumServer = env => {
  return FILE([
    FROM('ubuntu'),
    LABEL({
      maintainer: '"Ryan Grannell <r.grannell2@gmail.com>"',
      description: '"This private image runs a Polonium server"'
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
      'apt-get update && apt-get install --assume-yes nodejs letsencrypt build-essential',
      'npm install --global yarn'
    ]),

    ADD('dist /usr/local/app/dist'),
    WORKDIR('/usr/local/app'),

    RUN([
      'cd /usr/local/app/dist/ && yarn install',
      'mkdir -p /usr/local/app/dist/client/.well-known/acme-challenge',
      'mkdir /etc/letsencrypt/archive/polonium.rgrannell.world -p'
    ]),

    COPY('config/credentials/certs /etc/letsencrypt/archive/polonium.rgrannell.world'),

    HEALTHCHECK({
      interval: '1m',
      timeout: '5s'
    }, CMD('curl -f https://localhost:8081 || exit 1')),

    CMD('node dist/server/app/index.js')
  ])
}

const elasticSearch = name => {
  // -- todo write settings.

  return FILE([
    FROM('docker.elastic.co/elasticsearch/elasticsearch:6.0.1'),
    RUN([
      'echo "vm.max_map_count=262144" | tee -a "/etc/sysctl.conf"',
      'echo "soft memlock unlimited" | tee -a /etc/security/limits.conf',
      'echo "hard memlock unlimited" | tee -a /etc/security/limits.conf'
    ])
  ])
}

module.exports = {
  poloniumServer,
  elasticSearch
}
