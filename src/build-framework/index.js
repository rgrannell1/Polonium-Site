
const chalk = require('chalk')
const constants = require('./constants')
const fsUtils = require('../utils/fs')
const path = require('path')

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
  buildReloaded ({state, title}) {
    this._write({type: 'build', title, suffix: chalk.yellow('!')})
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
  taskReloaded ({state, title}) {
    this._write({type: 'build', title, suffix: chalk.yellow('!')})
  }
  taskSuccess ({state, title}) {
    const elapsedTime = Date.now()
    this._write({type: 'task', title, elapsedTime, suffix: chalk.green('✓')})
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
  async run (watch = true) {
    const state = {
      startTime: new Date()
    }
    this.reporter.buildPending({state, title: this.title})

    let hasPassed = true

    for (let task of this.tasks) {
      this.reporter.taskPending({state, title: task.title})
      try {
        await task.run()
        if (watch && this.watch && this.watch.folder) {
          fsUtils.watch(path.resolve(this.watch.folder), async () => {
            this.reporter.buildReloaded({state, title: task.title})
            await task.run()
          })
        }
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
