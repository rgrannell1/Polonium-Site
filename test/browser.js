
'use strict'

const puppeteer = require('puppeteer')
const cases = require('./cases')

async function runner () {
  const chrome = await puppeteer.launch({
    headless: true
  })

  for (let method of Object.keys(cases)) {
    await cases[method](chrome)
  }

  await chrome.close()
}

runner()
