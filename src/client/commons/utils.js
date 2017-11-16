
'use strict'

const utils = {
  promise: { }
}

utils.promise.timeout = (fn, timeout) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn()), timeout)
  })
}

module.exports = utils
