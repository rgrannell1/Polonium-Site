
'use strict'

const apm = require('elastic-apm-node').start({
  appName: 'polonium',
  serverUrl: 'http://polonium_apm:8200'
})

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
const monitors = require('../monitors')
const Elasticsearch = require('@rgrannell1/utils').elasticsearch
const templates = require('../templates')

const startServer = () => {
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

const startMonitors = async () => {
  monitors.elasticsearch()
  monitors.resources()
}

const configureElasticsearch = async () => {
  const client = new Elasticsearch({host: 'http://localhost:9200'})
  client.setDynamicMapping({
    name: 'logs',
    body: templates.logs()
  })
}

/**
 * start a polonium server instance
 * @return {Promise} a result promise
 */
const startPolonium = async () => {
  await configureElasticsearch()
  await startMonitors()
  await startServer()
}

startPolonium()
