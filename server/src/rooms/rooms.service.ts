import Rooms from "./room.model";
import {Types} from 'mongoose';
import UsersService from '../users/users.service';
import AppError from "../utils/AppError";

class RoomsService {
  async getRoomById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new AppError(404, 'Room not found.');
    return await Rooms.findById(id).exec();
  }

  async getRoomsByUserId(userId: string) {
    const user = await UsersService.getUserById(userId);
    if (!user) throw new AppError(404, 'User not found');
    return await Rooms.find({owner: user._id}).exec();
}

  async addRoom(userId: string) {
    const user = await UsersService.getUserById(userId);
    if (!user) throw new AppError(404, 'User not found');
    const newRoom = new Rooms({
      owner: user._id,
    });
    return await newRoom.save();
  }
}

export default new RoomsService()