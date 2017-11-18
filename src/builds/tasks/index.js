
const {Build, Task} = require('../../build-framework')
const fsUtils = require('../../utils/fs')
const minify = require('../../utils/minify')
const exec = require('execa')
const spawn = require('child_process').spawn

const fs = require('fs')
const path = require('path')
const config = require('config')
const digitalOcean = require('../../utils/digitalocean')
const ansible = require('../../utils/ansible')
const constants = require('../constants')

const PROJECT_PATH = path.join(__dirname, '../../..')
const CLIENT_PATH = path.join(PROJECT_PATH, 'src/client')
const DIST_PATH = path.join(PROJECT_PATH, 'dist')

const tasks = {
  build: {},
  security: {},
  server: {},
  docker: {}
}

const conditions = { }

conditions.distChanged = async () => {
  const checksumPath = `${PROJECT_PATH}/dist.checksum`
  const currentSum = (await exec.shell(`rhash -r ${DIST_PATH} --simple | sha256sum | cut -d " " -f1`)).stdout
  const previousSum = (await fsUtils.testFile(checksumPath))
      ? (await fsUtils.readFile(checksumPath)).toString()
      : ''

  await fsUtils.writeFile(checksumPath, currentSum)
  return currentSum === previousSum
}

tasks.docker.buildImage = new Task({
  title: 'Build docker-image',
  run: async () => {
    return exec.shell(`docker build -t ${config.get('docker.imageName')}:latest -f ${constants.paths.dockerfile} .`)
  },
  skip: conditions.distChanged
})
tasks.docker.login = new Task({
  title: 'Login to docker',
  run: async () => {
    return exec.shell(`docker login --username=${config.get('docker.username')} --password=${config.get('docker.password')}`)
  },
  skip: conditions.distChanged
})
tasks.docker.publishImage = new Task({
  title: 'Publish docker-image',
  run: async () => {
    await exec.shell(`docker tag ${config.get('docker.imageName')} ${config.get('docker.username')}/${config.get('docker.imageName')}:latest`)
    await exec.shell(`docker push ${config.get('docker.username')}/${config.get('docker.imageName')}`)
  },
  skip: conditions.distChanged
})

tasks.security.getCerts = new Task({
  title: 'Download SSL certificates from remote server',
  run: async () => {
    return ansible.runPlaybook(constants.paths.ansible.getCerts)
  },
  skip: async () => {
    const exists = await Promise.all([
      `${PROJECT_PATH}/config/credentials/certs/cert1.pem`,
      `${PROJECT_PATH}/config/credentials/certs/chain1.pem`,
      `${PROJECT_PATH}/config/credentials/certs/fullchain1.pem`,
      `${PROJECT_PATH}/config/credentials/certs/privkey1.pem`
    ].map(fsUtils.testFile))

    return exists.every(val => val)
  }
})

tasks.security.addSSHCert = new Task({
  title: 'Ensure an SSH certificate exists',
  run: async () => {
    const paths = {
      priv: config.get('digitalOcean.sshKeyPath'),
      pub: `${config.get('digitalOcean.sshKeyPath')}.pub`,
      sig: `${config.get('digitalOcean.sshKeyPath')}.sig`
    }

    const hasPrivKey = await fsUtils.testFile(paths.priv)
    const hasPubKey = await fsUtils.testFile(paths.pub)
    const hasSigKey = await fsUtils.testFile(paths.sig)
    const hasAll = hasPrivKey && hasPubKey && hasSigKey

    if (!hasAll) {
      if (hasPrivKey || hasPubKey || hasSigKey) {
        throw new Error(`has some, but not all, ssh credentials. Delete & retry.`)
      }

      await exec.shell(`ssh-keygen -t rsa -b 4096 -P '' -f ${paths.priv}`)
      const result = await exec.shell(`openssl pkey -in ${paths.priv} -pubout -outform DER | openssl md5 -c`)

      await fs.writeFileSync(paths.sig, result.stdout.replace('(stdin)= ', ''))
    }
  }
})

tasks.security.addLocalSSLCert = new Task({
  title: 'Create local self-signed certificates',
  run: async () => {
    const paths = {
      privateKey: config.get('ssl.privateKey'),
      chain: config.get('ssl.chain'),
      cert: config.get('ssl.cert')
    }

    // todo foldy

    const parts = [
      await fsUtils.testFile(paths.privateKey),
      await fsUtils.testFile(paths.cert)
    ]

    if (paths.chain) {
      parts.push(await fsUtils.testFile(paths.chain))
    }

    const hasAll = parts.every(part => part)

    if (!hasAll) {
      if (parts.some(part => part)) {
        throw new Error(`has some, but not all, local-ssl credentials. Delete & retry.`)
      }

      await exec.shell(`yes "" | openssl req -x509 -nodes -newkey rsa:4096 -keyout ${paths.privateKey} -out ${paths.cert} -days 365`)
    }
  }
})

tasks.server.runLocalServer = new Task({
  title: 'Run Polonium server locally',
  run: async () => {
    const child = spawn('node', [`${DIST_PATH}/server/app/index.js`])
    child.on('exit', (code, signal) => {
      console.log(`exited with code ${code} & signal ${signal}`)
    })
  }
})

tasks.server.createVM = new Task({
  title: 'Setup a VM',
  run: async () => {
    await digitalOcean.setVM(config.get('vm'))
  }
})

/**
 *
 */

tasks.security.publishSSHCert = new Task({
  title: 'Publish an SSH certificate to DigitalOcean',
  run: async () => {
    await exec.shell(``)
  }
})

/**
 *
 */

tasks.build.cleanDistFolder = new Task({
  title: 'Clean artifact folder',
  run: async () => {
    await fsUtils.removeFolder(DIST_PATH)
    await fsUtils.mkdir(DIST_PATH)
    await fsUtils.mkdir(CLIENT_PATH)
  }
})

/**
 *
 */

tasks.build.copyStaticFiles = new Task({
  title: 'Copy Static Files',
  run: async () => {
    await Promise.all([
      fsUtils.mkdir(`${DIST_PATH}/css`),
      fsUtils.mkdir(`${DIST_PATH}/fonts`),
      fsUtils.mkdir(`${DIST_PATH}/server`)
    ])

    await Promise.all([
      fsUtils.copyDir(`${CLIENT_PATH}/fonts`, `${DIST_PATH}/fonts`),
      fsUtils.copyDir(`${CLIENT_PATH}/css`, `${DIST_PATH}/css`),
      fsUtils.copyDir(`${PROJECT_PATH}/src/server`, `${DIST_PATH}/server`),
      fsUtils.copyDir(`${PROJECT_PATH}/config`, `${DIST_PATH}/config`),
      fsUtils.copy(`${CLIENT_PATH}/index.html`, `${DIST_PATH}/index.html`),
      fsUtils.copy(`${CLIENT_PATH}/manifest.json`, `${DIST_PATH}/manifest.json`),
      fsUtils.copy(`${CLIENT_PATH}/favicon.ico`, `${DIST_PATH}/favicon.ico`),
      fsUtils.copy(`${CLIENT_PATH}/icon.png`, `${DIST_PATH}/icon.png`),
      fsUtils.copy(`${PROJECT_PATH}/package.json`, `${DIST_PATH}/package.json`)
    ])
  }
})

tasks.build.minifyCss = new Task({
  title: 'Minify CSS Files',
  run: async () => {
    await Promise.all([
      minify.css(`${CLIENT_PATH}/css/polonium.css`, `${DIST_PATH}/css/polonium.min.css`)
    ])
  }
})

tasks.build.minifyJS = new Task({
  title: 'Minify JS Files',
  run: async () => {
    await Promise.all([
      minify.js(`${DIST_PATH}/build-index.js`, `${DIST_PATH}/build-index.min.js`),
      minify.js(`${DIST_PATH}/build-web-workers.js`, `${DIST_PATH}/build-web-workers.min.js`),
      minify.js(`${DIST_PATH}/build-service-worker.js`, `${DIST_PATH}/build-service-worker.min.js`)
    ])
  }
})

tasks.build.createWebPackArtifacts = new Task({
  title: 'Create WebPack artifacts',
  run: async () => {
    return Promise.all([
      exec.shell(`${constants.bin.webpack} --config webpack/webpack.config.js`),
      exec.shell(`${constants.bin.webpack} --config webpack/webpack-service-worker.config.js`),
      exec.shell(`${constants.bin.webpack} --config webpack/webpack-web-workers.config.js`)
    ])
  }
})

tasks.build.buildDistFolder = new Build({
  title: 'Build Server & Related Resources',
  tasks: [
    tasks.security.addSSHCert,
    tasks.security.addLocalSSLCert,
    tasks.security.publishSSHCert,
    tasks.build.copyStaticFiles,
    tasks.security.addLocalSSLCert,
    tasks.build.minifyCss,
    tasks.build.createWebPackArtifacts,
    tasks.build.minifyJS
  ]
})

module.exports = tasks
