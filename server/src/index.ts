import path = require("path");
import bodyParser = require('body-parser');
import express = require("express");
import http = require("http");
import cookieParser = require('cookie-parser');
import {Server, Socket} from "socket.io";
import mongoose = require('mongoose');
import usersRouters from './users/users.routers';
import roomsRouters from './rooms/rooms.routers';
import SocketService from "./service/SocketService";
const port = process.env.PORT || 8080;
const uri = "mongodb+srv://admin:admin@cluster0.vr7at.mongodb.net/puzzles-together?retryWrites=true&w=majority";

const app = express();
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server);

app.use('/users', usersRouters);
app.use('/rooms', roomsRouters);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

io.on('connection', (socket: Socket & {roomId?: string;}) => {
  console.log('User connected to webSocket');
  const socketService = new SocketService(io, socket);
  socketService.registerListener();
  socket.on('disconnect', () => {
    console.log('User disconnected from webSocket');
    socket.roomId && socket.leave(socket.roomId);
  })
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}, function(err){
  if(err) return console.log(err);
  server.listen(port, () => {
    console.log("Сервер ожидает подключения...");
  });
});
