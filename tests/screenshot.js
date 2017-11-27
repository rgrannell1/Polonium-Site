
const path = require('path')

const constants = {
  devices: {
    galaxyS5: {width: 360, height: 640},
    nexus5x: {width: 412, height: 732},
    xps: {width: 1880, height: 820}
  }
}

const puppeteer = require('puppeteer')
const config = require('config')

const screenshot = async (prefix, device, setup) => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true
  })

  const {width, height} = constants.devices[device]

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

Object.keys(constants.devices).forEach(async device => {
  await screenshot('screen-load', device)
  await screenshot('click', device, async (browser, page) => {
    await page.click('#links')
  })
})
