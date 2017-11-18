
const chalk = require('chalk')
const constants = require('./constants')
const fsUtils = require('../utils/fs')
const path = require('path')
const util = require('util')

class BuildReporter {
  constructor (config) {
    Object.assign(this, config)
  }
  _write ({type, title, suffix, elapsedTime = ''}) {
    const leftColumn = `[${type}] ${elapsedTime}`
    const rightColumn = `${title} ${suffix}`
    this.output.write(`${leftColumn.padEnd(constants.logLeftColumnWidth)}${rightColumn}\n`)
  }
  buildPending ({state, title}) {
    this._write({type: 'build', title, suffix: chalk.yellow('...')})
  }
  buildSuccess ({state, title}) {
    const elapsedTime = Date.now()
    this._write({type: 'build', title, elapsedTime, suffix: chalk.green('✓')})
  }
  buildFailure ({state, err, title}) {
    const elapsedTime = Date.now()
    this._write({type: 'build', title, elapsedTime, suffix: chalk.red('x')})
    throw err
  }
  taskPending ({state, title}) {
    this._write({type: 'task', title, suffix: chalk.yellow('...')})
  }
  taskSuccess ({state, title}) {
    const elapsedTime = Date.now()
    this._write({type: 'task', title, elapsedTime, suffix: chalk.green('✓')})
  }
  taskSkipped ({state, title}) {
    const elapsedTime = Date.now()
    this._write({type: 'task', title, elapsedTime, suffix: chalk.blue('-->')})
  }
  taskFailure ({state, err, title}) {
    const elapsedTime = Date.now()
    this._write({type: 'task', title, elapsedTime, suffix: chalk.red('x')})
    throw err
  }
}

class Build {
  constructor (config) {
    Object.assign(this, config)
    this.reporter = new BuildReporter({
      output: config.output ? config.output : process.stdout
    })

    for (let prop of ['title', 'tasks']) {
      if (!this.hasOwnProperty(prop)) {
        throw new Error(`missing required property "${prop}"`)
      }
    }
  }
  async run () {
    const state = {
      startTime: new Date()
    }
    this.reporter.buildPending({state, title: this.title})

    let hasPassed = true

    for (let task of this.tasks) {
      if (!task) {
        throw new Error(`task not defined in ${util.inspect(this.tasks)}`)
      }

      this.reporter.taskPending({state, title: task.title})
      try {
        if (task.skip) {
          const shouldSkip = await task.skip()
          if (shouldSkip) {
            this.reporter.taskSkipped({state, title: task.title})
            continue
          }
        }
        await task.run()
        this.reporter.taskSuccess({state, title: task.title})
      } catch (err) {
        this.reporter.taskFailure({state, err, title: task.title})
        hasPassed = false
      }
    }

    if (hasPassed) {
      this.reporter.buildSuccess({state, title: this.title})
    } else {
      this.reporter.buildFailure({state, title: this.title})
    }
  }
}

class Task {
  constructor (config) {
    Object.assign(this, config)
    for (let prop of ['title', 'run']) {
      if (!this.hasOwnProperty(prop)) {
        throw new Error(`missing required property "${prop}"`)
      }
    }
  }
  async run () {
    await this.run()
  }
}

module.exports = {
  Build,
  Task,
  BuildReporter
}
