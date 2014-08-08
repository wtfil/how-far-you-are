var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    eio = require('engine.io-client'),
    socket = eio.Socket('ws://' + location.host);

function send(data) {
    socket.send(JSON.stringify(data));
}

socket.on('message', function (data) {
    try {
        data = JSON.parse(data);
    } catch(e){
        return emitter.emit('error', e);
    }
    emitter.emit('message', data);
});

emitter.send = send;
module.exports = emitter;
