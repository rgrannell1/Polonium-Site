
const fs = require('fs')
const watch = require('node-watch')
const mkdirp = require('mkdirp-promise')
const rimraf = require('rimraf-promise')
const ncp = require('ncp')

const fsUtils = {}

fsUtils.removeFolder = path => {
  return rimraf(path)
}

fsUtils.mkdir = path => {
  return mkdirp(path)
}

fsUtils.copyDir = (source, dest) => {
  return new Promise((resolve, reject) => {
    ncp(source, dest, err => {
      err ? reject(err) : resolve()
    })
  })
}

fsUtils.copy = (source, dest) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, dest, err => {
      err ? reject(err) : resolve()
    })
  })
}

fsUtils.testFile = path => {
  if (!path) {
    throw new Error('path not provided.')
  }

  return new Promise((resolve, reject) => {
    fs.stat(path, err => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false)
        } else {
          reject(err)
        }
      } else {
        resolve(true)
      }
    })
  })
}

fsUtils.watch = (path, listener) => {
  watch(path, {recursive: true}, listener)
}

module.exports = fsUtils
