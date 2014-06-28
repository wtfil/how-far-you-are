var EventEmiter = require('./event-emiter'),
    emiter = new EventEmiter();

emiter.userName = localStorage.getItem('userName') || '';

emiter.changeName = function (name) {
    this.userName = name;
    localStorage.setItem('userName', name);
    this.emit('name', name);
}

module.exports = emiter;
