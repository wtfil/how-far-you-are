var EventEmitter = require('events').EventEmitter,
    emiter = new EventEmiter();

window.addEventListener('deviceorientation', function (e) {
    emitter.emit('alpha', e.alpha);
	emitter.emit('chane');
});

module.exports = emitter;
