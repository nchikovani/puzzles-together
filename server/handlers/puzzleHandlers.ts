import {Server, Socket} from "socket.io";
import Puzzle from '../utils/Puzzle';
import {RoomsTypes} from "../server.types";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

const puzzleHandlers =  (io: Server<DefaultEventsMap, DefaultEventsMap>, socket: Socket & {roomId?: string;}, rooms: RoomsTypes) => {
  socket.on("puzzle:getOptions", (image: any) => {
    if (!socket.roomId) return;
    const room = rooms[socket.roomId];
    if (!room) return;
    room.puzzle = new Puzzle(image);


    const options = room.puzzle.getPartsCountOptions();
    //если что, отправлять ошибку, проверять входящие данные??
    socket.emit("puzzle:options", options);
  });
  socket.on("puzzle:create", (option: any) => {
    if (!socket.roomId) return;
    const room = rooms[socket.roomId];
    if (!room || !room.puzzle) return;

    room.puzzle.createPuzzle(option);
    const gameData = room.puzzle.getGameData();
    //если что, отправлять ошибку, проверять входящие данные??
    io.to(socket.roomId).emit("puzzle", gameData);
  });

  socket.on("puzzle:setUpdate", (update: any) => {
    if (!socket.roomId) return;
    const room = rooms[socket.roomId];
    if (!room || !room.puzzle) return;
    const beforeIsSolved = room.puzzle.isSolved;
    room.puzzle.update(update);
    //если что, отправлять ошибку, проверять входящие данные??
    socket.broadcast.to(socket.roomId).emit("puzzle:getUpdate", update);

    if (!beforeIsSolved && room.puzzle.isSolved) {
      io.to(socket.roomId).emit("puzzle:solved");
    }
  });
}

export default puzzleHandlers;