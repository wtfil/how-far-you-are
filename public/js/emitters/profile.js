var EventEmitter = require('events').EventEmitter;
    emitter = new EventEmitter();

/**
 * Current user name
 */ 
emitter.userName = localStorage.getItem('userName') || '';

/**
 * Update user name
 * @param {String} name
 */
emitter.changeName = function (name) {
    this.userName = name;
    localStorage.setItem('userName', name);
    this.emit('name', name);
    this.emit('change');
};

module.exports = emitter;
