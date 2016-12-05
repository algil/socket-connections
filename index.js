'use strict';

const http = require('http').createServer(server);
const fs = require('fs');
const io = require('socket.io')(http);

let connections = 0;

function server(req, res) {
    fs.readFile('index.html', (error, data) => {
        if (error) {
            res.writeHead(500, {'Content-Type': 'text/html'})
            return res.end('<h1>Internal Server Error</h1>');
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'})
            return res.end(data, 'utf-8');
        }
    });
} 

http.listen(3000, ()=> console.log('Running on localhost:3000'));

io.on('connection', socket => {
    connections++;
    
    socket.emit('hello', {message: 'Hello from the server using socket.io'});
    socket.emit('user connection', {connectedUsers: connections});
    socket.broadcast.emit('user connection', {connectedUsers: connections});

    socket.on('disconnect', () => {
        connections--;
        socket.broadcast.emit('user connection', {connectedUsers: connections});
    });
});