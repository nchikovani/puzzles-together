import Puzzle from "../../utils/Puzzle";
import RoomsService from '../../rooms/rooms.service';
import {SocketObject, ActiveRoomTypes} from "./SocketService.types";
import * as webSocketServerActions from 'shared/webSocketServerActions';
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsTypes} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import * as fs from "fs";
import config from '../../config';
import ActiveRoomsService from "./ActiveRoomsService";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
const {gameDataAction, optionsAction} = webSocketServerActions;

export default async function roomRouters(action: WebSocketClientActionsTypes, io: Server<DefaultEventsMap, DefaultEventsMap>, socket: SocketObject, activeRoomsService: ActiveRoomsService) {
  switch (action.type) {
    case webSocketActionsTypes.JOIN: {
      await RoomsService.updateLastVisit(action.roomId);
      let joinRoom: ActiveRoomTypes;
      const activeRoom = activeRoomsService.findRoom(action.roomId);
      if (activeRoom) {
        joinRoom = activeRoom;
        const puzzle = joinRoom.puzzle;
        if (puzzle) {
          if (puzzle.puzzleIsCreated) {//повторение
            const gameData = puzzle.getGameData();
            socket.emit("puzzle", gameDataAction(gameData));
          } else if (puzzle.isInit) {// пока else
            socket.emit("puzzle", optionsAction(puzzle.options));
          }
        }
      } else {
        const room = await RoomsService.getRoomById(action.roomId);
        if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
        joinRoom = {
          _id: String(room._id),
          owner: String(room.owner),
          puzzle: null,
        };
        if (fs.existsSync(`${config.roomJsonPuzzlePath}${room._id}.json`)) {
          const jsonPuzzle = fs.readFileSync(`${config.roomJsonPuzzlePath}${room._id}.json`, {encoding: 'utf8'});
          const puzzle = new Puzzle();

          puzzle.createPuzzleFromJson(jsonPuzzle);
          if (puzzle.puzzleIsCreated) {//повторение
            const gameData = puzzle.getGameData();
            socket.emit("puzzle", gameDataAction(gameData));
          }else if (puzzle.isInit) {// пока else
            socket.emit("puzzle", optionsAction(puzzle.options));
          }

          joinRoom.puzzle = puzzle;
        }
        activeRoomsService.addRoom(joinRoom);
      }
      socket.roomId = action.roomId;
      socket.join(action.roomId);
      break;
    }
  }
}