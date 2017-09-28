
'use strict'




const puppeteer = require('puppeteer')
const constants = {
	domains: {
		local: 'http://localhost:8080'
	}
}





const cases = { }

cases.navLink = async (chrome) => {

	const page = await chrome.newPage( )
	await page.goto(constants.domains.local)

	await page.click('.brand')

	await page.close( )

}

cases.pageLoad = async (chrome) => {

	const page = await chrome.newPage( )
	await page.goto(constants.domains.local)

	await page.click('#website-input-container')
	await page.type('asasdasdasd', {
		delay: 100
	})

	await page.click('#password-input-container')
	await page.type('asasdasdasd', {
		delay: 100
	})

	await page.close( )

}





async function runner ( ) {

	const chrome = await puppeteer.launch({
		headless: false
	})

	await cases.pageLoad(chrome)
	await cases.navLink(chrome)

	await chrome.close( )

}




runner( )