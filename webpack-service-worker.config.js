
"use strict"




const path = require('path')





const config = {
	context: path.resolve('src/client'),
	entry:   {
		app: './core/asset-cache.js'
	},
	output: {
		filename:   'build-service-worker.js',
		path:       path.resolve('./dist'),
		publicPath: '/assets/'
	},
	resolve: {
		extensions: ['.js']
	},
	plugins: [

	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		inline: true,
		hot: true
	}
}





module.exports = config
