
const path = require('path')

/**
 *
 *
 * Most common resolutions.
 */
const constants = {
  devices: {
    laptop15: [1366, 768],
    tv1080: [1920, 1080],
    notebook14: [1280, 800],
    iphone4: [320, 568],
    monitor19wide: [1440, 900],
    monitor19: [1280, 1024],
    iphone35: [320, 480],
    monitor20: [1600, 900],
    ipad10: [768, 1024],
    monitor15: [1024, 768],
    monitor22: [1680, 1050],
    a12: [360, 640],
    monitor24: [1920, 1200],
    galaxy: [720, 1280],
    a15: [480, 800],
    a16: [1360, 768],
    tv720p: [1280, 720]
  }
}

const puppeteer = require('puppeteer')
const config = require('config')

/**
 *
 * @param {string} prefix
 * @param {string} device
 * @param {function} setup
 *
 * Wrapper utility to capture screenshots of the application.
 *
 *
 */
const screenshot = async (prefix, device, setup) => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true
  })

  const [width, height] = constants.devices[device]

  const page = await browser.newPage()
  await page.goto(`https://${config.get('vm.subDomain')}.${config.get('vm.domain')}`)
  page.setViewport({width, height})

  if (setup) {
    await setup(browser, page)
  }

  await page.screenshot({
    path: path.join(__dirname, '../screenshots', `${prefix}-${device}.png`)
  })

  await browser.close()
}

/**
 *
 * Create each series of screenshots.
 *
 */
Object.keys(constants.devices).forEach(async device => {
  await screenshot('screen-load', device)
  await screenshot('click', device, async (browser, page) => {
    await page.click('#links')
  })
})
