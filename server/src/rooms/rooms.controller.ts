import RoomsService from './rooms.service';
import {ServerError} from 'shared';
import {NextFunction, Request, Response} from 'express';

class RoomsController {
  async getRooms(req: Request, res: Response) {
    const userId = req.params.userId;
    // @ts-ignore
    const userIdFromToken = req.userId;
    const rooms = await RoomsService.getRoomsByUserId(userId);
    if (userId !== userIdFromToken) throw new ServerError(403, 'Access to the page is denied.')
    return res.status(200).json({rooms});
  }

  async addRoom(req: Request, res: Response) {
    // @ts-ignore
    const userIdFromToken = req.userId;
    const room = await RoomsService.addRoom(userIdFromToken);
    return res.status(200).json({room: room});
  }
}

export default new RoomsController();