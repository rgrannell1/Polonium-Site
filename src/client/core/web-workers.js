/* eslint-env node, worker */

'use strict'

/*
const polonium = require('polonium')
polonium.polonium({
  browser: true, password: 'xxxxx', salt: 'ssssss', rounds: 50000, digest: 'SHA1', len: 20
})
*/

Promise.resolve()
  .then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        postMessage('this_is_a_password')
        resolve()
      }, 1500)
    })
  })
