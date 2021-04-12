import RoomsService from './rooms.service';
import {ServerError, serverErrorMessages} from 'shared';
import {Request, Response} from 'express';

class RoomsController {
  async getRooms(req: Request, res: Response) {
    const userId = req.params.userId;
    const userIdFromToken = req.userId;
    const rooms = await RoomsService.getRoomsByUserId(userId);
    if (userId !== userIdFromToken) throw new ServerError(403, serverErrorMessages.accessIsDenied);
    return res.status(200).json({rooms});
  }

  async addRoom(req: Request, res: Response) {
    const userIdFromToken = req.userId;
    const room = await RoomsService.addRoom(userIdFromToken);
    return res.status(200).json({room: room});
  }
}

export default new RoomsController();