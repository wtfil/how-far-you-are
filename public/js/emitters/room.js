var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    extend = require('extend'),
    geo = require('./geo-location'),
    profile = require('./profile'),
    socket = require('./socket'),
    remote = {},
    local;

function updateLocal() {
    local = extend({userName: profile.getName()}, geo.getPosition());
    emitter.emit('change');
    socket.send({position: local});
}

function updateRemote(data) {
    if (data.newMember) {
        console.log(1);
        remote[data.newMember] = {};
    } else if (data.position) {
        console.log(2);
        remote[data.socketId] = data.position;
    } else if (data.disconnected) {
        console.log(3);
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

emitter.join = join;
emitter.left = left;
emitter.getMembers = getMembers;
module.exports = emitter;
