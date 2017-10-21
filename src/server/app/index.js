
'use strict'

const fs = require('fs')
const http = require('http')
const https = require('https')

const Koa = require('koa')
const path = require('path')
const koaStatic = require('koa-static-server')
const router    = require('koa-router')
const constants = require('../commons/constants')
const bunyan = require('bunyan')
const forceSSL = require('koa-sslify');

const log = bunyan.createLogger({
	name: constants.appName
})




const routers = { }

routers.static = koaStatic({
	rootDir: path.join(__dirname, '../../../dist/')
})

routers.dynamic = router( )

routers.dynamic.use(async (ctx, next) => {

	log.info({
		method: ctx.method,
		url: ctx.url,
	})

	await next( )

})

routers.dynamic.get('/health', async ctx => {
	ctx.status = 200
})



const httpApp = new Koa( )
const httpsApp = new Koa( )

httpApp
.use(forceSSL( ));

httpsApp
.use(routers.dynamic.routes( ))
.use(routers.static)





const certOptions = {
	key: fs.readFileSync(constants.paths.letsEncryptKey).toString( ),
	ca: fs.readFileSync(constants.paths.letsEncryptCa).toString( ),
	cert: fs.readFileSync(constants.paths.letsEncryptCert).toString( )
};

http.createServer(httpApp.callback( ))
	.listen(constants.ports.http)

https.createServer(certOptions, httpsApp.callback( ))
	.listen(constants.ports.https)
