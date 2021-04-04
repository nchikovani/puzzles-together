import Rooms from "./room.model";
import {Types} from 'mongoose';
import UsersService from '../users/users.service';
import Error from "../utils/Error";

const validateId = (id: any, error: Error) => {
  if (!Types.ObjectId.isValid(id)) throw error;
}

const checkData = (data: any, error: Error) => {
  if (!data) throw error;
}

class RoomsService {
  async getRoomById(id: string) {
    try {
      validateId(id, new Error(404, 'Room not found.'));
      return await Rooms.findById(id).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(500, 'Unable find room.');
      }
    }
  }

  async getRoomsByUserId(userId: string) {
    try {
      const user = await UsersService.getUserById(userId);
      if (!user) throw new Error(404, 'User not found');
      return await Rooms.find({owner: user._id}).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(500, 'Unable find user.');
      }
    }
  }

  async addRoom(userId: string) {
    try {
      const user = await UsersService.getUserById(userId);
      if (!user) throw new Error(404, 'User not found');
      const newRoom = new Rooms({
        owner: user._id,
      });
      return await newRoom.save();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(500, 'Unable create room.');
      }
    }
  }
}

export default new RoomsService()