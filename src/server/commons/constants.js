
module.exports = {
	appName: 'polonium',
	paths: {
		letsEncryptKey: '/etc/letsencrypt/archive/polonium.rgrannell.world/privkey1.pem',
		letsEncryptCa: '/etc/letsencrypt/archive/polonium.rgrannell.world/fullchain1.pem',
		letsEncryptCert: '/etc/letsencrypt/archive/polonium.rgrannell.world/cert1.pem'
	},
	ports: {
		http: 8080,
		https: 8081
	}
}
