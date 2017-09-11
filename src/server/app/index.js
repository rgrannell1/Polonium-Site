
'use strict'





const Koa = require('koa')
const app = new Koa( )
const path = require('path')
const koaStatic = require('koa-static-server')




const routers = { }

routers.static = koaStatic({
	rootDir: path.join(__dirname, '../../../dist/')
})




app.use(routers.static)




app.listen(8080)
