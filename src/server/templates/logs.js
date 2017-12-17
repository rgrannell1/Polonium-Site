
/**
 * create index template for logging.
 * @return {object} a valid elasticsearch template mapping.
 */
const logs = () => {
  return {
    template: 'logs-*',
    settings: {
      number_of_shards: 1
    },
    mappings: {
      type: {
        _source: {
          enabled: true
        },
        properties: {

        }
      }
    }
  }
}

module.exports = logs
