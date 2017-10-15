
'use strict'





const Koa = require('koa')
const app = new Koa( )
const path = require('path')
const koaStatic = require('koa-static-server')
const router    = require('koa-router')
const bunyan = require('bunyan')
const constants = require('../commons/constants')

const log = bunyan.createLogger({
	name: constants.appName,
	streams: [{
		path: './logs'
	}]
})



const routers = { }

routers.static = koaStatic({
	rootDir: path.join(__dirname, '../../../dist/')
})

routers.dynamic = router( )

routers.dynamic.get('/health', async ctx => {
	ctx.status = 200
})



app
.use(async (ctx, next) => {

	await next( )

	log.info({
		method: ctx.method,
		url: ctx.url,
	})


})
.use(routers.dynamic.routes( ))
.use(routers.static)




app.listen(8080)
