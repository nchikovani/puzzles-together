import {Puzzle} from "../../utils/Puzzle";
import RoomsService from '../../models/rooms/rooms.service';
import {SocketObject} from "./SocketService.types";
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import * as fs from "fs";
import config from '../../config';
import ActivePuzzlesService from "./ActivePuzzlesService";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {roomAction, roomSettingsAction} from "shared/webSocketServerActions";

export default async function roomRouters(action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>, socket: SocketObject, activePuzzlesService: ActivePuzzlesService) {
  switch (action.type) {
    case webSocketActionsTypes.JOIN: {
      await RoomsService.updateLastVisit(action.roomId);
      let puzzle = null;
      const activePuzzle = activePuzzlesService.findPuzzle(action.roomId);
      const room = await RoomsService.getRoomById(action.roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);

      if(socket.userId && socket.userId != room.owner && !room.visitorsId.find(visitorId => visitorId == socket.userId)) {
        await RoomsService.pushVisitor(room._id, socket.userId);
      }

      const roomId = String(room._id);

      if (activePuzzle !== undefined) {
        puzzle = activePuzzle;
      } else {
        if (fs.existsSync(`${config.roomJsonPuzzlePath}${roomId}.json`)) {
          const jsonPuzzle = fs.readFileSync(`${config.roomJsonPuzzlePath}${roomId}.json`, {encoding: 'utf8'});
          const savedPuzzle = new Puzzle();
          savedPuzzle.createPuzzleFromJson(jsonPuzzle);
          puzzle = savedPuzzle;
        }
        activePuzzlesService.addPuzzle(roomId, puzzle);
      }
      socket.roomId = roomId;
      const gameData = (puzzle && puzzle.puzzleIsCreated) ? puzzle.getGameData() : null;

      socket.emit("room", roomAction(room, gameData));
      socket.join(roomId);
      break;
    }
    case webSocketActionsTypes.SET_ROOM_SETTINGS: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const room = await RoomsService.getRoomById(roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      if (socket.userId != room.owner) throw new ServerError(403, serverErrorMessages.noAccessRights);
      await RoomsService.setSettings(roomId, action.settings.name, action.settings.createPuzzleOnlyOwner);
      io.to(roomId).emit("room", roomSettingsAction(action.settings.name, action.settings.createPuzzleOnlyOwner));
      break;
    }
  }
}