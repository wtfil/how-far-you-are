var app = require('koa')(),
	router = require('koa-router'),
    stat = require('koa-static'),
    rooms = require('./lib/rooms'),
    socket = require('./lib/socket'),
    http = require('http'),
    fs = require('fs'),
    server;

app.use(router(app));
app.use(stat('./public'));
app.get('/rooms', rooms);

app.use(function *() {
    this.type = 'text/html';
    this.body = fs.createReadStream('./public/index.html');
});

server = http.Server(app.callback());
socket(server);

server.listen(Number(process.env.PORT || 3000));
