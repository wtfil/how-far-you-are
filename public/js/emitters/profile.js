var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter();

var userName = localStorage.getItem('userName') || '';

emitter.setName = function (name) {
    userName = name;
    localStorage.setItem('userName', name);
    this.emit('name', name);
    this.emit('change');
};

emitter.getName = function () {
    return userName;
};

module.exports = emitter;
