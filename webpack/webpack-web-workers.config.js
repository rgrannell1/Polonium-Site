
'use strict'

const path = require('path')

const config = {
  context: path.resolve('src/client'),
  entry: {
    app: './core/web-workers.js'
  },
  output: {
    filename: 'build-web-workers.js',
    path: path.resolve('./dist'),
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
