var EventEmiter = require('./event-emiter'),
    emiter = new EventEmiter();

window.addEventListener('deviceorientation', function (e) {
    emiter.emit('alpha', e.alpha);
});

module.exports = emiter;
