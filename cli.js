#!/usr/bin/env node

const neodoc = require('neodoc')
const cli = require('./src/build-cli')

process.on('unhandledRejection', err => {
  throw err
})

const docs = { }

docs.main = `
Notes:
  Author: Ryan Grannell

Usage:`

Object.keys(cli).forEach(commandPrefix => {
  const subcommands = Object.keys(cli[commandPrefix])
  docs.main += `\n    build ${commandPrefix} [${subcommands.join('|')}]`

  docs[commandPrefix] = '\nUsage:'
  subcommands.forEach(command => {
    docs[commandPrefix] += `\n    build ${commandPrefix} ${command}`
  })
})

docs.main += `

Description:
    Execute a Polonium build-step.

Commands:
`
Object.keys(cli).forEach(commandPrefix => {
  const subcommands = Object.keys(cli[commandPrefix])

  subcommands.forEach(subcommand => {
    const title = cli[commandPrefix][subcommand] ? cli[commandPrefix][subcommand].title : '<missing>'
    docs.main += `\n    ${commandPrefix} ${subcommand}: ${title}`
  })
})

const args = neodoc.run(docs.main, {
  optionsFirst: true,
  startOptions: true
})

/**
 *
 * @params {object} args arbitrary command-line arguments.
 *
 * lookup the command to run based on provided cli arguments.
 *
 * return {function?} this command to run.
 *
 */
function findCommand (args) {
  let command

  const commands = Object.keys(cli)

  commands.forEach(commandPrefix => {
    if (args[commandPrefix]) {
      const commandArgs = neodoc.run(docs[commandPrefix], {
        optionsFirst: true,
        startOptions: true
      })
      const commandName = Object.keys(cli[commandPrefix]).find(command => commandArgs[command])

      command = cli[commandPrefix][commandName]
    }
  })

  return command
}

const command = findCommand(args)
command.run()
  .catch(err => {
    throw err
  })
