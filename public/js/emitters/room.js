var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    extend = require('extend'),
    geo = require('./geo-location'),
    profile = require('./profile'),
    socket = require('./socket'),
    debug = require('../utils/debug'),
    remote = {},
    local;

function updateLocal() {
    local = extend({userName: profile.getName()}, geo.getPosition());
    emitter.emit('change');
    socket.send({position: local});
}

function updateRemote(data) {
    if (data.newMember) {
    	debug('new member');
        remote[data.newMember] = {};
    } else if (data.position) {
    	debug('new position');
        remote[data.socketId] = data.position;
    } else if (data.disconnected) {
    	debug('disconnected');
        delete remote[data.socketId];
    }
    emitter.emit('change');
}

function join (id) {
    socket.send({joinRoom: id});
}

function left (id) {
    socket.send({leftRoom: id});
}

function getMembers() {
    return {
        local: local,
        remote: remote
    };
}

geo.on('change', updateLocal);
profile.on('change', updateLocal);
socket.on('message', updateRemote);
geo.on('error', emitter.emit.bind(emitter, 'error'));

emitter.join = join;
emitter.left = left;
emitter.getMembers = getMembers;
module.exports = emitter;
