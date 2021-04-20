import {Puzzle, PuzzleOptions} from "../../utils/Puzzle";
import {SocketObject} from "./SocketService.types";
import ActivePuzzlesService from './ActivePuzzlesService';
import * as webSocketServerActions from 'shared/webSocketServerActions';
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import RoomsService from "../../rooms/rooms.service";
const {gameDataAction, optionsAction, updateAction, solvedAction} = webSocketServerActions;

export default async function puzzleRouter(action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>, socket: SocketObject, activePuzzlesService: ActivePuzzlesService) {
  switch (action.type) {
    case webSocketActionsTypes.GET_OPTIONS: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const room = await RoomsService.getRoomById(roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      if (socket.userId != room.owner && room.createPuzzleOnlyOwner) throw new ServerError(403, serverErrorMessages.noAccessRights);
      const puzzleOptions = new PuzzleOptions(action.image);
      socket.puzzleOptions = puzzleOptions;
      socket.emit("puzzle", optionsAction(puzzleOptions.options));
      break;
    }
    case webSocketActionsTypes.CREATE: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const room = await RoomsService.getRoomById(roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      if (socket.userId != room.owner && room.createPuzzleOnlyOwner) throw new ServerError(403, serverErrorMessages.accessIsDenied);
      if (!socket.puzzleOptions) throw new ServerError(400, serverErrorMessages.optionsNotCreated);
      const newPuzzle = new Puzzle();
      const option = socket.puzzleOptions.getOption(action.optionId);
      newPuzzle.createPuzzle(socket.puzzleOptions.image, socket.puzzleOptions.width, socket.puzzleOptions.height, option);
      delete socket.puzzleOptions;
      activePuzzlesService.changePuzzle(roomId, newPuzzle);
      const gameData = newPuzzle.getGameData();
      io.to(roomId).emit("puzzle", gameDataAction(gameData));
      break;
    }
    case webSocketActionsTypes.SET_UPDATE: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const activePuzzle = activePuzzlesService.findPuzzle(roomId);
      if (!activePuzzle) throw new ServerError(400, serverErrorMessages.puzzleNotCreated);
      const beforeIsSolved = activePuzzle.isSolved;
      activePuzzle.update(action.update);
      socket.broadcast.to(roomId).emit("puzzle", updateAction(action.update));
      if (!beforeIsSolved && activePuzzle.isSolved) {
        io.to(roomId).emit("puzzle", solvedAction());
      }
      break;
    }
  }
}