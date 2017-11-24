/* eslint-env node, serviceworker */

const constants = {
  cacheUrls: [
    '/',
    '#!/',
    '/#!/'
  ],
  caches: {
    offline: 'offline-v1'
  }
}

const reactions = {}

/**
 * @param {object} event an install event.
 *
 *
 * Add URLs to the cache.
 */
reactions.populateCache = async event => {
  event.waitUntil(caches.open(constants.caches.offline).then(cache => {
    return cache.addAll(constants.cacheUrls)
  }))
}

/**
 * @param {object} event an activate event.
 *
 *
 */
reactions.cleanCache = async event => {

}

/**
 * @param {object} event a fetch event.
 *
 * Should a request be cached?
 *
 */
const shouldCache = event => {
  const request = event.request

  const criteria = {
    isGetRequest: request.method === 'GET'
  }

  return Object.values(criteria).every(val => val)
}

/**
 * @param {object} event a fetch event.
 *
 * return GET request-responses from a cache when appropriate.
 *
 */
const onFetch = async event => {
  const request = event.request
  let cacheResponse = await caches.match(event.request)
  let freshResponse

  if (cacheResponse) {
    console.log(`Cache hit for ${request.method} ${request.url}`)
  } else {
    try {
      console.log(`Cache miss for ${request.method} ${request.url}`)
      freshResponse = await fetch(event.request)
    } catch (err) {
      console.error(err)
    }

    if (shouldCache(event)) {
      const cache = await caches.open(constants.caches.offline)
      cache.put(event.request, freshResponse.clone())
    }
  }

  event.respondWith(cacheResponse || freshResponse)
}

/**
 * @param {object} event a fetch event.
 *
 *
 */
reactions.proxyCache = async event => {
  if (shouldCache(event)) {
    onFetch(event)
  }
}

self.addEventListener('install', reactions.populateCache)
self.addEventListener('activate', reactions.cleanCache)
self.addEventListener('fetch', reactions.proxyCache)
