import {Puzzle} from "../../utils/Puzzle";
import RoomsService from '../../rooms/rooms.service';
import {SocketObject, IActionRoom} from "./SocketService.types";
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import * as fs from "fs";
import config from '../../config';
import ActiveRoomsService from "./ActiveRoomsService";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {roomAction, roomSettingsAction} from "shared/webSocketServerActions";

export default async function roomRouters(action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>, socket: SocketObject, activeRoomsService: ActiveRoomsService) {
  switch (action.type) {
    case webSocketActionsTypes.JOIN: {
      await RoomsService.updateLastVisit(action.roomId);
      let joinRoom: IActionRoom;
      const activeRoom = activeRoomsService.findRoom(action.roomId);
      const room = await RoomsService.getRoomById(action.roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      if (activeRoom) {
        joinRoom = activeRoom;
      } else {
        joinRoom = {
          _id: String(room._id),
          owner: String(room.owner),
          puzzle: null,
        };
        if (fs.existsSync(`${config.roomJsonPuzzlePath}${room._id}.json`)) {
          const jsonPuzzle = fs.readFileSync(`${config.roomJsonPuzzlePath}${room._id}.json`, {encoding: 'utf8'});
          const puzzle = new Puzzle();
          puzzle.createPuzzleFromJson(jsonPuzzle);
          joinRoom.puzzle = puzzle;
        }
        activeRoomsService.addRoom(joinRoom);
      }
      socket.roomId = action.roomId;
      const gameData = (joinRoom.puzzle && joinRoom.puzzle.puzzleIsCreated) ? joinRoom.puzzle.getGameData() : null;

      socket.emit("room", roomAction(joinRoom._id, joinRoom.owner, room.name, room.createPuzzleOnlyOwner, gameData));
      socket.join(action.roomId);
      break;
    }
    case webSocketActionsTypes.SET_ROOM_SETTINGS: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const room = activeRoomsService.findRoom(roomId);
      if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
      if (socket.userId !== room.owner) throw new ServerError(403, serverErrorMessages.roomNotFound);
      await RoomsService.setSettings(roomId, action.settings.name, action.settings.createPuzzleOnlyOwner);
      io.to(roomId).emit("room", roomSettingsAction(action.settings.name, action.settings.createPuzzleOnlyOwner));
      break;
    }
  }
}