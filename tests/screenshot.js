
const path = require('path')

const dimensions = (width, height) => {
  return [width, height]
}

/**
 *
 *
 * Most common resolutions.
 */
const constants = {
  devices: {
    laptop15: dimensions(1366, 768),
    tv1080: dimensions(1920, 1080),
    notebook14: dimensions(1280, 800),
    iphone4: dimensions(320, 568),
    monitor19wide: dimensions(1440, 900),
    monitor19: dimensions(1280, 1024),
    iphone35: dimensions(320, 480),
    monitor20: dimensions(1600, 900),
    ipad10: dimensions(768, 1024),
    monitor15: dimensions(1024, 768),
    monitor22: dimensions(1680, 1050),
    a12: dimensions(360, 640),
    monitor24: dimensions(1920, 1200),
    galaxy: dimensions(720, 1280),
    a15: dimensions(480, 800),
    a16: dimensions(1360, 768),
    tv720p: dimensions(1280, 720)
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
