
'use strict'

const utils = require('@rgrannell1/utils')
const fs = require('fs')
const Koa = require('koa')
const http2 = require('http2')
const constants = require('../commons/constants')
const {observations} = require('../commons/constants')
const routers = require('../routers')
const entities = require('../commons/entities')
const config = require('config')
const facts = require('../commons/facts')

function run () {
  const apps = {
    http: new Koa(),
    https: new Koa()
  }

  apps.http.use(routers.http)
  apps.https.use(routers.https)

  const certOptions = {
    key: fs.readFileSync(config.get('ssl.privateKey')).toString(),
    cert: fs.readFileSync(config.get('ssl.cert')).toString()
  }

  if (config.get('ssl.chain')) {
    certOptions.ca = fs.readFileSync(config.get('ssl.chain')).toString()
  }

  const server = http2.createSecureServer(certOptions, apps.https.callback())
  .listen(constants.ports.https)

  server.on('connection', socket => {
    socket.setNoDelay(true)
  })
  server.on('close', () => {
    const entity = Object.assign(entities.Event({name: 'close'}), {
      ctx: {
        observation: observations.CONNECTION_CLOSED,
        type: observations.type.DIRECT
      }
    })
    facts.note(entity)
  })
  server.on('upgrade', () => {
    const entity = Object.assign(entities.Event({name: 'upgrade'}), {
      ctx: {
        observation: observations.CONNECTION_UPGRADE,
        type: observations.type.DIRECT
      }
    })
    facts.note(entity)
  })
}

run()
