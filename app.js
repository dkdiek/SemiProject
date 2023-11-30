// const express = require("express")
// const http = require("http")
// const app = express();
// const path = require("path")
// const server = http.createServer(app)
// const socketIO = require("socket.io")
// const moment = require("moment")

// const io = socketIO(server);

// app.use(express.static(path.join(__dirname, "src")))
// const PORT = process.env.PORT || 3000;

// io.on("connection",(socket)=>{
//     socket.on("chatting",(data)=>{
//         const { name, msg} = data;
//         io.emit("chatting", {
//             name: name,
//             msg : msg,
//             time : moment(new Date()).format("h:mm A")
//         })
//     })
// })



// server.listen(PORT, ()=> console.log(`server is running ${PORT}`))



// 캔버스 공유 테스트
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Listen for drawing events
  socket.on('draw', (data) => {
    io.emit('draw', data);
  });

  // Listen for chatting events
  socket.on("chatting", (data) => {
    const { name, msg } = data;
    io.emit("chatting", {
      name: name,
      msg: msg,
      time: moment(new Date()).format("h:mm A")
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
