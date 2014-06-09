var app = require('koa')(),
    reactify = require('reactify'),
    browserify = require('koa-browserify'),
    stat = require('koa-static'),
    rooms = require('./lib/socket'),
    http = require('http'),
    fs = require('fs'),
    server;

app.use(browserify({
    root: './public',
    debug: true,
    transform: reactify
}));

app.use(stat('./public'));

app.use(function *() {
    this.type = 'text/html';
    this.body = fs.createReadStream('./public/index.html');
});

server = http.Server(app.callback());
rooms(server);

server.listen(Number(process.env.PORT || 3000));
