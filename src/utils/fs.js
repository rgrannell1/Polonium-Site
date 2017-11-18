
const fs = require('fs')
const mkdirp = require('mkdirp-promise')
const rimraf = require('rimraf-promise')
const cpr = require('cpr')

const fsUtils = {}

fsUtils.readFile = path => {
  return new Promise((resolve, reject) => {
    return fs.readFile(path, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

fsUtils.writeFile = (path, content) => {
  return new Promise((resolve, reject) => {
    return fs.writeFile(path, content, err => {
      err ? reject(err) : resolve()
    })
  })
}

fsUtils.removeFolder = path => {
  return rimraf(path)
}

fsUtils.mkdir = path => {
  return mkdirp(path)
}

fsUtils.copyDir = (source, dest) => {
  return new Promise((resolve, reject) => {
    const opts = {
      deleteFirst: true,
      overwrite: true,
      confirm: true
    }
    cpr(source, dest, opts, err => {
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

module.exports = fsUtils
