var app = require('koa')();
var router = require('koa-router');
var stat = require('koa-static');
var rooms = require('./lib/rooms');
var io = require('socket.io');
var http = require('http');
var fs = require('fs');
var server;

app.use(router(app));
app.use(stat('./public'));
app.get('/rooms', rooms);

app.use(function *() {
    this.type = 'text/html';
    this.body = fs.createReadStream('./public/index.html');
});

server = http.Server(app.callback());
io = io(server);

io.on('connection', function (socket) {
	socket.on('join', function (data) {
		socket.join(data.id);
		socket.user = {name: '<username>'};
		sync(socket, true);
	});
	socket.on('leave', function (data) {
		socket.leave(data.id);
		sync(socket);
	});
	socket.on('username', function (name) {
		socket.user.name = name
		sync(socket);
	});
	socket.on('position', function (position) {
		socket.user.position = position
		sync(socket);
	});
	socket.on('sync', function (data) {
		socket.broadcast.emit('sync', data);
	});
});

function sync(socket, isLoopback) {
	var rooms = socket.adapter.rooms;
	var roomId = Object.keys(rooms).reduce(function (a, b) {
		if (b !== socket.id && rooms[b][socket.id]) {
			return b;
		}
		return a;
	}, null);
	var room = rooms[roomId];
	var users = Object.keys(room)
		.filter(function (item) {
			return item !== socket.id;
		})
		.map(function (id) {
			return io.sockets.adapter.nsp.connected[id].user;
		});
	if (isLoopback) {
		socket.emit('sync', users);
	} else {
		socket.broadcast.emit('sync', users);
	}
}

server.listen(Number(process.env.PORT || 3000));
