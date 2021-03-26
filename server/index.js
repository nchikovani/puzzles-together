const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const registerPuzzleHandlers = require('./handlers/puzzleHandlers');
const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json({limit: '10mb', extended: true}));

const server = http.createServer(app);
const io = socketIo(server);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

io.on('connection', (socket) => {
  console.log('User connected');

  registerPuzzleHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
});

server.listen(port, () => {
  console.log("Сервер ожидает подключения...");
});
