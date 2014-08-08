var crypto = require('crypto');

module.exports = function *() {
	var random = Date.now() + Math.random();

	var id = crypto
		.createHash('sha1')
		.update(String(random))
		.digest('hex')
		.slice(0, 6);
	
	this.body = {
		id: id
	};
};
