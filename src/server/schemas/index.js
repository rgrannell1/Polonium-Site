
const fs = require('fs')
const hjson = require('hjson')

const schemas = {}
const entities = {}

fs.readdirSync(__dirname)
  .filter(item => item.endsWith('.hjson'))
  .forEach(item => {
    const name = item.replace('.hjson', '')
    const schema = hjson.parse(fs.readFileSync(__dirname + '/' + item).toString())
    schemas[name] = schema
  })

Object.entries(schemas).forEach(([key, value]) => {
  entities[key] = (config) => {
    Object.keys(config).forEach(supplied => {
      if (!value['@context'].hasOwnProperty(supplied)) {
        throw new Error(`parameter "${supplied}" not supported.`)
      }
    })

    return Object.assign({}, value, config)
  }
})

module.exports = entities
