
'use strict'




const exec = require('execa')





const ansible = { }





ansible.tasks.setupVM = async ( ) => {

	deps.check([
		deps.Executable({
			name: 'ansible'
		})
	])

	exec.shell('ansible')

}





module.exports = ansible
