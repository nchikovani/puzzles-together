import RoomsService from './rooms.service';
import Error from "../utils/Error";
import {NextFunction, Request, Response} from 'express';

class RoomsController {
  async getRooms(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    // @ts-ignore
    const userIdFromToken = req.userId;
    try {
      const rooms = await RoomsService.getRoomsByUserId(userId);
      if (userId === userIdFromToken) {
        return res.status(200).json({rooms});
      } else {
        return next(new Error(403, 'Access to the page is denied.'));
      }
    } catch(error) {
      return next(error);
    }
  }

  async addRoom(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const userIdFromToken = req.userId;
    try {
      const room = await RoomsService.addRoom(userIdFromToken);
      return res.status(200).json({room: room});
    } catch (error) {
      return next(error);
    }
  }
}

export default new RoomsController();