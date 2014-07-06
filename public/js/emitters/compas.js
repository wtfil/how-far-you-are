var EventEmitter = require('events').EventEmitter,
    emiter = new EventEmitter();

window.addEventListener('deviceorientation', function (e) {
    emitter.emit('alpha', e.alpha);
	emitter.emit('change');
});

module.exports = emitter;
