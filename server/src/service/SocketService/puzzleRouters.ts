import Puzzle from "../../utils/Puzzle";
import {SocketObject} from "./SocketService.types";
import ActiveRoomsService from './ActiveRoomsService';
import * as webSocketServerActions from 'shared/webSocketServerActions';
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
const {gameDataAction, optionsAction, updateAction, solvedAction} = webSocketServerActions;

export default async function puzzleRouter(action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>, socket: SocketObject, activeRoomsService: ActiveRoomsService) {
  switch (action.type) {
    case webSocketActionsTypes.GET_OPTIONS: {//проверять токен  //берет опции и СОЗДАЕТ НОВЫЙ ОБЪЕКТ ПАЗЛА
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const room = activeRoomsService.findRoom(roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      const newPuzzle = new Puzzle();
      newPuzzle.init(action.image);
      room.puzzle = newPuzzle;
      socket.emit("puzzle", optionsAction(newPuzzle.options));
      break;
    }
    case webSocketActionsTypes.CREATE: {//проверять токен
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const room = activeRoomsService.findRoom(roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      if (!room.puzzle) throw new ServerError(400, serverErrorMessages.puzzleNotCreated);
      room.puzzle.createPuzzle(action.optionId);
      const gameData = room.puzzle.getGameData();
      io.to(roomId).emit("puzzle", gameDataAction(gameData));
      break;
    }
    case webSocketActionsTypes.SET_UPDATE: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const room = activeRoomsService.findRoom(roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      if (!room.puzzle) throw new ServerError(400, serverErrorMessages.puzzleNotCreated);
      const beforeIsSolved = room.puzzle.isSolved;
      room.puzzle.update(action.update);
      socket.broadcast.to(roomId).emit("puzzle", updateAction(action.update));
      if (!beforeIsSolved && room.puzzle.isSolved) {
        io.to(roomId).emit("puzzle", solvedAction());
      }
      break;
    }
  }
}