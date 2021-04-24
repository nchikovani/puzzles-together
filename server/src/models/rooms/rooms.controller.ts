import RoomsService from './rooms.service';
import ChatService from '../chat/chat.service';
import {ServerError, serverErrorMessages} from 'shared';
import {Request, Response} from 'express';
import * as fs from "fs";
import config from "../../config";
import {IRoom} from './room.model';

class RoomsController {
  async getRooms(req: Request, res: Response) {
    const userId = req.params.userId;
    const userIdFromToken = req.userId;
    if (userId !== userIdFromToken) throw new ServerError(403, serverErrorMessages.accessIsDenied);
    const ownRooms = await RoomsService.getOwnRoomsByUserId(userId);
    const visitedRooms = await RoomsService.getVisitedRoomsByUserId(userId);

    const getRoomWithImage = (room: IRoom) => {
      if (fs.existsSync(`${config.roomJsonPuzzlePath}${room._id}.json`)) {
        const jsonPuzzle = fs.readFileSync(`${config.roomJsonPuzzlePath}${room._id}.json`, {encoding: 'utf8'});
        const puzzleImage = JSON.parse(jsonPuzzle).image;
        return {...room.toObject(), puzzleImage};
      }
      return {...room.toObject()};
    }

    const resultOwnRooms = ownRooms.map(room => {
      return getRoomWithImage(room);
    });

    const resultVisitedRooms = visitedRooms.map(room => {
      return getRoomWithImage(room);
    });

    return res.status(200).json({ownRooms: resultOwnRooms, visitedRooms: resultVisitedRooms});
  }

  async createRoom(req: Request, res: Response) {
    const userIdFromToken = req.userId;
    const chat = await ChatService.createChat();
    const room = await RoomsService.createRoom(userIdFromToken, chat._id);
    return res.status(200).json({room: room});
  }

  async deleteRoom(req: Request, res: Response) {
    const userIdFromToken = req.userId;
    const roomId = req.params.roomId;
    const room = await RoomsService.getRoomById(roomId);
    if (!room) throw new ServerError(404, serverErrorMessages.roomNotFound);
    if (room.owner != userIdFromToken) throw new ServerError(403, serverErrorMessages.noAccessRights);
    await RoomsService.deleteRoom(roomId);
    return res.sendStatus(200);
  }
}

export default new RoomsController();