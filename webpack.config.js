
"use strict"




const path = require('path')





const config = {
	context: path.resolve('src/client'),
	entry:   {
		app: './index.js'
	},
	output: {
		filename:   'build-index.js',
		path:       path.resolve('./dist'),
		publicPath: '/assets/'
	},
	resolve: {
		extensions: ['.js']
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		inline:      true,
		hot:         true
	}
}





module.exports = config
