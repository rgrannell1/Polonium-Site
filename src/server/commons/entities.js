
require('@rgrannell1/utils')

const entities = {}
/**
 * @param  {object} config
 * @param  {object} config.ip
 *
 * @throws {[exceptionType]} Throws when required props are missing.
 *
 * @return {object}
 */
entities.User = config => {
  config.assertProperties(['ip'])
  return config
}
/**
 * @param  {object} config
 * @param  {object} config.url
 * @param  {object} config.startTime
 *
 * @throws {[exceptionType]} Throws when required props are missing.
 *
 * @return {object}
 */
entities.Request = config => {
  config.assertProperties(['url', 'startTime'])
  return config
}
/**
 * @param  {object} config
 * @param  {object} config.url
 * @param  {object} config.user
 * @param  {object} config.startTime
 *
 * @throws {[exceptionType]} Throws when required props are missing.
 *
 * @return {object}
 */
entities.UserRequest = config => {
  config.assertProperties(['url', 'user', 'startTime'])
  return config
}

module.exports = entities
