var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter();

emitter.alpha = 0;

window.addEventListener('deviceorientation', function (e) {
    emitter.alpha = e.alpha;
    emitter.emit('alpha', e.alpha);
    emitter.emit('change');
});

module.exports = emitter;
