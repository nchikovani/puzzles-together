const Puzzle = require('../utils/Puzzle');
let puzzle = null;

module.exports = (io, socket) => {
  puzzle && socket.emit("puzzle", puzzle.getGameData());

  socket.on("puzzle:add", (data) => {
    puzzle = new Puzzle(4, 4, data.image, 100, 100);
    const gameData = puzzle.getGameData();
    socket.broadcast.emit("puzzle", gameData);
    socket.emit("puzzle", gameData);
  });

  socket.on("puzzle:setUpdate", (data) => {
    if (!puzzle) return;
    puzzle.update(data.update);
    socket.broadcast.emit("puzzle:update", data);
  });

}