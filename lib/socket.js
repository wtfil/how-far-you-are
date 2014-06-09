var engine = require('engine.io'),
    sockets = Object.create(null),
    rooms = Object.create(null);

function addToRoom(socket, id) {
    if (!rooms[id]) {
        rooms[id] = [];
    }
    if (~rooms[id].indexOf(socket)) {
        return;
    }
    rooms[id].push(socket);
    sockets[socket.id] = id;
}

function removeFromRooms(socket) {
    var id = sockets[socket.id],
        room = rooms[id];

    if (!room) {
        return;
    }

    room.splice(room.indexOf(socket), 1);
}

function send(socket, message) {
    socket.send(JSON.stringify(message));
}

function broadcast(socket, message) {
    var id = sockets[socket.id];

    if (!id) {
        return;
    }

    rooms[id].forEach(function (item) {
        if (item === socket) {
            return;
        }
        send(item, message);
    });
}

module.exports = function (http) {
    var server = engine.attach(http);

    server.on('connection', function (socket) {
        socket.on('message', function(data){
            try {
                data = JSON.parse(data);
            } catch(e) {};

            if (data.room) {
                addToRoom(socket, data.room);
            } else if (data.distance) {
                broadcast(socket, data);
            }

        });
        socket.on('close', function () {
            removeFromRooms(socket);
        });
    });
}
