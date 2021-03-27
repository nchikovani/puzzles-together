const Puzzle = require('../utils/Puzzle');

module.exports = (io, socket, rooms) => {
  socket.on("puzzle:getOptions", (data) => {
    const room = rooms[socket.roomId];
    if (!room) return;
    room.puzzle = new Puzzle(data.image);

    const options = room.puzzle.getPartsCountOptions();
    socket.emit("puzzle:options", options);
  });
  socket.on("puzzle:create", (data) => {
    const room = rooms[socket.roomId];
    if (!room || !room.puzzle) return;

    room.puzzle.createPuzzle(data.option);
    const gameData = room.puzzle.getGameData();

    io.to(socket.roomId).emit("puzzle", gameData);
  });

  socket.on("puzzle:setUpdate", (data) => {
    const room = rooms[socket.roomId];
    if (!room || !room.puzzle) return;
    room.puzzle.update(data.update);
    socket.broadcast.to(socket.roomId).emit("puzzle:getUpdate", data);
  });

}