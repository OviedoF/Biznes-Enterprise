const path = require('path');
const app = require(path.join(__dirname, 'app.js')); 
require('dotenv').config(); 
const SocketIO = require('socket.io');

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {console.log(`[EXPRESS] 🚀🚀 Server is running on  http://localhost:${port}.`)} ); 

// websockets
const io = SocketIO(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    console.log('a user connected');
});

module.exports = server;