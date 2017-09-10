
"use strict"



const utils = {
	css: { }
}





utils.css.stylise = (elem, sheet) => {

	elem.type = 'type/css'

	if (elem.styleSheet) {
		elem.styleSheet.cssText = sheet
	} else {
		element.appendChild(document.createTextNode(sheet))
	}

	return elem

}





module.exports = utils
