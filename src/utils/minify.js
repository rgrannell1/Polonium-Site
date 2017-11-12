
const fsUtils = require('./fs')
const exec = require('execa')
const config = require('config')

const constants = {
  bin: {
    webpack: 'node_modules/webpack/bin/webpack.js',
    uglifyjs: 'node_modules/uglify-es/bin/uglifyjs',
    minifier: 'node_modules/minifier/index.js'
  }
}

const minify = { }

minify.js = (from, to) => {
  return config.get('build.minifyJS')
    ? exec.shell(`${constants.bin.uglifyjs} ${from} ${to}`)
    : fsUtils.copy(from, to)
}

minify.css = (from, to) => {
  return config.get('build.minifyCSS')
      ? exec.shell(`${constants.bin.minifier} --output ${to} ${from}`)
      : fsUtils.copy(from, to)
}

module.exports = minify
