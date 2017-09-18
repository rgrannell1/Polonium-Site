
'use strict'





const utils = { }




utils.asTask = (description, taskList) => {

	return {
		title: description,
		task: ( ) => taskList
	}

}






module.exports = utils
