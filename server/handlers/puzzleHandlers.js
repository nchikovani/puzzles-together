const Puzzle = require('../utils/Puzzle');

module.exports = (io, socket, rooms) => {
  // const roomId = socket.roomId;
  // if (!roomId) return;
  // const room = rooms[roomId];
  //
  // room && room.puzzle && socket.emit("puzzle", room.puzzle.getGameData());

  socket.on("puzzle:create", (data) => {
    const room = rooms[socket.roomId];
    if (!room) return;
    room.puzzle = new Puzzle(4, 4, data.image, 100, 100);
    const gameData = room.puzzle.getGameData();
    console.log(socket.roomId);
    io.to(socket.roomId).emit("puzzle", gameData);
  });

  socket.on("puzzle:setUpdate", (data) => {
    const room = rooms[socket.roomId];
    if (!room || !room.puzzle) return;
    room.puzzle.update(data.update);
    socket.broadcast.to(socket.roomId).emit("puzzle:getUpdate", data);
  });

}