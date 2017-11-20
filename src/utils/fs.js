
const fs = require('fs')
const mkdirp = require('mkdirp-promise')
const rimraf = require('rimraf-promise')
const cpr = require('cpr')

const fsUtils = {}

/**
 *
 * @param {string} the path to read from.
 *
 * @returns {Promise} promise containing file content.
 *
 */

fsUtils.readFile = path => {
  return new Promise((resolve, reject) => {
    return fs.readFile(path, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

/**
 *
 * @param {string} path the path to write to.
 * @param {string} content the content to write to a file
 *
 * @returns {Promise} a result promise.
 */

fsUtils.writeFile = (path, content) => {
  return new Promise((resolve, reject) => {
    return fs.writeFile(path, content, err => {
      err ? reject(err) : resolve()
    })
  })
}

/**
 *
 * @param {string} path the path to remove.
 *
 * @returns {Promise} a result promise.
 */

fsUtils.removeFolder = path => {
  return rimraf(path)
}

/**
 *
 * @param {string} path the path to create.
 *
 * @returns {Promise} a result promise.
 */

fsUtils.mkdir = path => {
  return mkdirp(path)
}

/**
 *
 * @param {string} source the folder to copy
 * @param {string} source the destination of the folder
 *
 * @returns {Promise} a result promise.
 */

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

/**
 *
 * @param {string} source the path to copy
 * @param {string} source the destination of the file
 *
 * @returns {Promise} a result promise.
 */

fsUtils.copy = (source, dest) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, dest, err => {
      err ? reject(err) : resolve()
    })
  })
}

/**
 *
 * @param {string} source the path to test for
 *
 * @returns {Promise} a result promise containing a boolean value.
 */

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
