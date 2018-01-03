
const {Build, Task} = require('../../build-framework')
const utils = require('@rgrannell1/utils')
const DigitalOcean = require('@rgrannell1/utils').digitalOcean
const deps = require('@rgrannell1/utils').dependencies
const minify = require('../../utils/minify')
const chalk = require('chalk')
const exec = require('execa')
const spawn = require('child_process').spawn
const Database = require('better-sqlite3')

const path = require('path')
const config = require('config')
const ansible = require('../../utils/ansible')
const constants = require('../constants')

const PROJECT_PATH = path.join(__dirname, '../../..')
const CLIENT_PATH = path.join(PROJECT_PATH, 'src/client')
const DIST_PATH = path.join(PROJECT_PATH, 'dist')
const docker = require('./docker')

const tasks = {
  build: {},
  security: {},
  server: {},
  docker: {},
  test: {}
}

const conditions = { }

conditions.distChanged = async () => {
  const checksumPath = `${PROJECT_PATH}/dist.checksum`
  const currentSum = (await exec.shell(`rhash -r ${DIST_PATH} --simple | sha256sum | cut -d " " -f1`)).stdout
  const previousSum = (await utils.fs.testFile(checksumPath))
    ? (await utils.fs.readFile(checksumPath)).toString()
    : ''

  await utils.fs.writeFile(checksumPath, currentSum)

  // return currentSum === previousSum
  return false
}

function dockerBuild (dockerFile, imageName) {
  return new Task({
    title: 'Build docker-image',
    run: async () => {
    // -- load, then save

      const tpath = await utils.fs.writeTmpFile(dockerFile, __dirname)

      await deps.check([
        new deps.Path({path: tpath})
      ])

      const cmd = `docker build -t ${imageName}:latest -f ${tpath} .`
      const result = exec.shell(cmd)

      result.stdout
        .on('data', chunk => console.log(chalk.blue(chunk)))
        .on('end', chunk => console.log(chalk.blue(chunk)))

      return result
    },
    skip: conditions.distChanged
  })
}

tasks.docker.buildImage = dockerBuild(docker.poloniumServer(), config.get('docker.imageName'))
tasks.docker.buildElasticSearchImage = dockerBuild(docker.elasticSearch(), config.get('docker.elasticsearchImageName'))

tasks.docker.login = new Task({
  title: 'Login to docker',
  run: async () => {
    const cmd = `docker login --username=${config.get('docker.username')} --password=${config.get('docker.password')}`
    return exec.shell(cmd)
  },
  skip: conditions.distChanged
})

function publishDockerImage (imageName) {
  return new Task({
    title: 'Publish docker-image',
    run: async () => {
      await exec.shell(`docker tag ${imageName} ${config.get('docker.username')}/${imageName}:latest`)

      const result = exec.shell(`docker push ${config.get('docker.username')}/${imageName}`)

      result.stdout
      .on('data', chunk => console.log(chalk.blue(chunk)))
      .on('end', chunk => console.log(chalk.blue(chunk)))

      await result
    },
    skip: conditions.distChanged
  })
}
tasks.docker.publishImage = publishDockerImage(config.get('docker.imageName'))
tasks.docker.publishElasticSearchImage = publishDockerImage(config.get('docker.elasticsearchImageName'))

tasks.security.openTerminal = new Task({
  title: 'Download SSL certificates from remote server',
  run: async () => {
    const vm = await new DigitalOcean(config.get('digitalOcean.token')).findVMs({name: config.get('vm.name')})

    if (vm) {
      const ip = vm.networks.v4[0].ip_address
      const command = `gnome-terminal -e "ssh ${config.get('digitalOcean.sshUserName')}@${ip} -i ${config.get('digitalOcean.sshKeyPath')}"`

      return exec.shell(command)
    }
  }
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
    ].map(utils.fs.testFile))

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

    const hasPrivKey = await utils.fs.testFile(paths.priv)
    const hasPubKey = await utils.fs.testFile(paths.pub)
    const hasSigKey = await utils.fs.testFile(paths.sig)
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
      await utils.fs.testFile(paths.privateKey),
      await utils.fs.testFile(paths.cert)
    ]

    if (paths.chain) {
      parts.push(await utils.fs.testFile(paths.chain))
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
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.on('exit', (code, signal) => {
      console.log(`exited with code ${code} & signal ${signal}`)
    })
  }
})

tasks.server.runLocalInfrastructure = new Task({
  title: 'Run Polonium & surrounding servers locally',
  run: () => {
    const child = spawn('docker-compose', ['--file', `${PROJECT_PATH}/src/builds/tasks/docker-compose.yml`, 'up'])
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.on('exit', (code, signal) => {
      console.log(`exited with code ${code} & signal ${signal}`)
    })
  }
})

tasks.server.createVM = new Task({
  title: 'Setup a VM',
  run: async () => {
    await new DigitalOcean(config.get('digitalOcean.token'))
      .setVM(config.get('vm'), {
        sshKeyPath: config.get('digitalOcean.sshKeyPath'),
        sshKeyName: config.get('digitalOcean.sshKeyName'),
        vmName: config.get('vm.name')
      })

    const addresses = ['0.0.0.0/0', '::/0']

    await new DigitalOcean(config.get('digitalOcean.token'))
      .setFirewall({
        vmName: config.get('vm.name'),
        firewallName: 'primary',
        inbound: [
          {ports: '22', addresses},
          {ports: '80', addresses},
          {ports: '443', addresses}
        ],
        outbound: [
          {ports: 'all', addresses}
        ]
      })
  }
})

tasks.server.setupVM = new Task({
  title: 'Install software on the VM',
  run: async () => {
    await deps.check([
      new deps.Path({path: constants.paths.ansible.setupVm})
    ])

    return ansible.runPlaybook(constants.paths.ansible.setupVm)
  }
})

tasks.server.startServer = new Task({
  title: 'Start Polonium on the remote server',
  run: async () => {
    await deps.check([
      new deps.Path({path: constants.paths.ansible.startServer})
    ])

    return ansible.runPlaybook(constants.paths.ansible.startServer)
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
    await utils.fs.removeFolder(DIST_PATH)
    await utils.fs.mkdir(DIST_PATH)
    await utils.fs.mkdir(CLIENT_PATH)
  }
})

/**
 *
 */

tasks.build.copyStaticFiles = new Task({
  title: 'Copy Static Files',
  run: async () => {
    await Promise.all([
      utils.fs.mkdir(`${DIST_PATH}/client`),
      utils.fs.mkdir(`${DIST_PATH}/client/css`),
      utils.fs.mkdir(`${DIST_PATH}/client/fonts`),
      utils.fs.mkdir(`${DIST_PATH}/client/core`),
      utils.fs.mkdir(`${DIST_PATH}/server`)
    ])

    await Promise.all([
      utils.fs.copyDir(`${CLIENT_PATH}/fonts`, `${DIST_PATH}/client/fonts`),
      utils.fs.copyDir(`${CLIENT_PATH}/css`, `${DIST_PATH}/client/css`),
      utils.fs.copyDir(`${CLIENT_PATH}/core`, `${DIST_PATH}/client/core`),
      utils.fs.copyDir(`${PROJECT_PATH}/src/server`, `${DIST_PATH}/server`),
      utils.fs.copyDir(`${PROJECT_PATH}/config`, `${DIST_PATH}/config`),
      utils.fs.copy(`${CLIENT_PATH}/templates/index.html`, `${DIST_PATH}/client/index.html`),
      utils.fs.copy(`${CLIENT_PATH}/manifest.json`, `${DIST_PATH}/client/manifest.json`),
      utils.fs.copy(`${CLIENT_PATH}/favicon.ico`, `${DIST_PATH}/client/favicon.ico`),
      utils.fs.copy(`${CLIENT_PATH}/icon-256.png`, `${DIST_PATH}/client/icon-256.png`),
      utils.fs.copy(`${CLIENT_PATH}/icon-512.png`, `${DIST_PATH}/client/icon-512.png`),
      utils.fs.copy(`${PROJECT_PATH}/package.json`, `${DIST_PATH}/package.json`)
    ])
  }
})

tasks.build.minifyCss = new Task({
  title: 'Minify CSS Files',
  run: async () => {
    await Promise.all([
      minify.css(`${CLIENT_PATH}/css/polonium.css`, `${DIST_PATH}/client/css/polonium.min.css`)
    ])
  }
})

tasks.build.minifyJS = new Task({
  title: 'Minify JS Files',
  run: async () => {
    await deps.check([
      new deps.Path({path: `${DIST_PATH}/build-index.js`})
    ])

    await Promise.all([
      minify.js(`${DIST_PATH}/build-index.js`, `${DIST_PATH}/client/build-index.min.js`),
      minify.js(`${DIST_PATH}/build-web-workers.js`, `${DIST_PATH}/client/build-web-workers.min.js`)
    ])
  }
})

tasks.build.createWebPackArtifacts = new Task({
  title: 'Create WebPack artifacts',
  run: async () => {
    deps.check([
      new deps.Path({path: constants.bin.webpack})
    ])

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

tasks.test.checkSSL = new Task({
  title: 'Check the SSL grade is sufficient',
  run: async () => {
    const host = `${config.get('vm.subDomain')}.${config.get('vm.domain')}`
    const certResults = await utils.sslLabs().scan(host)

    const acceptableGrades = new Set(['B', 'B+', 'A-', 'A', 'A+'])
    if (acceptableGrades.has(certResults.grade)) {
      throw new Error(`unacceptable status code "${certResults.grade}".`)
    }
  }
})

tasks.test.checkAccess = new Task({
  title: 'Check the site is accessible',
  run: async () => {
    deps.check([
      new deps.HttpResponse({
        url: `${config.get('vm.subDomain')}.${config.get('vm.domain')}`
      })
    ])
  }
})

tasks.test.postDeployment = new Build({
  title: 'Test that the website is superficially working',
  tasks: [
    tasks.test.checkAccess,
    tasks.test.checkSSL
  ]
})

tasks.build.setupDeploymentDatabase = new Task({
  title: 'Set up a local SQL database',
  run: async () => {
    global.SQL_DEPLOYMENT_DB = new Database(path.join(__dirname, '../../../data/deployment.db'))
  }
})

module.exports = tasks
