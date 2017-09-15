
'use strict'





const constants = {
	cacheUrls: [
		'css/polonium.css'
	],
	contentTypes: {
		html: 'text/html'
	},
	caches: {
		offline: 'offline-v1'
	}
}




const cacheBustedRequest = url => {
	return new Request(url, {cache: 'reload'})
}

const isCacheable = request => {
	return true
}






const listeners = { }

listeners.populateCache = async event => {

	const cache = await caches.open(constants.caches.offline)
	await cache.addAll(constants.cacheUrls)

	try {
		return event.waitUntil(self.skipWaiting( ))
	} catch (err) {
		return Promise.resolve( )
	}

}

listeners.tidyCache = async event => {

	const expectedCaches = Object.keys(constants.caches).map(cacheName => {
		return constants.caches[cacheName]
	})

	const cacheNames     = await caches.keys( )
	const deletePromises = cacheNames.map(cacheName => {

		if (expectedCaches.indexOf(cacheName) === -1) {

			console.log('deleting out of date cache.')
			return caches.delete(cacheName)

		}

	})

	return Promise.all(deletePromises)

}

listeners.serveFromCache = async event => {

	if (isCacheable(event.request)) {

		const cachedResponse = await caches.match(event.request)

		if (cachedResponse) {

			console.log(`cache hit for ${event.request.method} ${event.request.url}`)
			return cachedResponse

		}

	}

	const uncachedResponse = await fetch(event.request)

	if (isCacheable(event.request)) {

		console.log(`cache miss for ${event.request.method} ${event.request.url}`)

		const cache = await caches.open(constants.caches.offline)
		await cache.put(event.request, uncachedResponse.clone( ))

	}

	return uncachedResponse

}





self.addEventListener('install',  listeners.populateCache)
self.addEventListener('activate', listeners.tidyCache)
self.addEventListener('fetch',    listeners.serveFromCache)
