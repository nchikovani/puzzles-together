import RoomsService from './rooms.service';
import UsersService from '../users/users.service';
import {Types} from 'mongoose';

import { Request, Response } from 'express';

class RoomsController {
  async getRooms(req: Request, res: Response) {
    const userId = req.params.userId;
    // @ts-ignore
    const userIdFromToken = req.userId;

    if (Types.ObjectId.isValid(userId)) {
      const user = await UsersService.getUserById(userId);
      if (user !== undefined) {
        if (user) {
          if (userId === userIdFromToken) {
            const rooms = await RoomsService.getRoomsByUserId(user._id);
            if (rooms) {
              return res.status(200).json({rooms});
            } else {
              return res.status(500).send({ message: 'Unable find rooms.' });
            }
          } else {
            return res.status(403 ).send({message: 'Access to the page is denied.'});
          }
        } else {
          res.status(404).send({ message: 'User not found.' });
        }
      } else {
        res.status(500).send({ message: 'Unable find user.' });
      }
    } else {
      res.status(404).send({ message: 'User not found.' });
    }
  }

  async addRoom(req: Request, res: Response) {
    // @ts-ignore
    const userIdFromToken = req.userId;
    const room = await RoomsService.addRoom(userIdFromToken);
    if (room) {
      return res.status(200).json({room: room});
    } else {
      return res.status(500).send({ message: 'Unable create room.' });
    }
  }
}

export default new RoomsController();