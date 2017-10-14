
'use strict'





const Koa = require('koa')
const app = new Koa( )
const path = require('path')
const koaStatic = require('koa-static-server')
const router    = require('koa-router')




const routers = { }

routers.static = koaStatic({
	rootDir: path.join(__dirname, '../../../dist/')
})

routers.dynamic = router( )

routers.dynamic.get('/health', async ctx => {
	ctx.status = 200
})



app
.use(routers.dynamic.routes( ))
.use(routers.static)




app.listen(8080)
