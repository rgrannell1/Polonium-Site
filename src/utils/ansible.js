
const exec = require('execa')
const path = require('path')

const constants = {
  paths: {
    ansibleCfg: path.join(__dirname, '../ansible/ansible.cfg'),
    ansibleInventory: path.join(__dirname, '../ansible/settings.js')
  }
}

const ansible = {}

async function runPlaybook (ansiblePlaybook) {
  return exec.shell(`export ANSIBLE_CONFIG="${constants.paths.ansibleCfg}" && ansible-playbook --inventory "${constants.paths.ansibleInventory}" "${ansiblePlaybook}"`).then(result => {
    // console.log(result.stdout)
  })
}

ansible.runPlaybook = runPlaybook

module.exports = ansible
