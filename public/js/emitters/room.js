import io from 'socket.io-client';
import {EventEmitter} from 'events';
import geo from './geo-location';
import profile from './profile';

var emitter = new EventEmitter;
var socket = io(location.host);
var remote = [];

function join(id) {
    socket.emit('join', {id});
}
function leave(id) {
    socket.emit('leave', {id});
}
function getMembers() {
    return remote;
}

geo.on('position', socket.emit.bind(socket, 'position'));
profile.on('name', socket.emit.bind(socket, 'username'));
socket.on('sync', data => {
    remote = data;
    emitter.emit('change');
});

emitter.join = join;
emitter.leave = leave;
emitter.getMembers = getMembers;

module.exports = emitter;
