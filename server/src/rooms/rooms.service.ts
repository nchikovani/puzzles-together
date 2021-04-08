import Rooms from "./room.model";
import {Types} from 'mongoose';
import UsersService from '../users/users.service';
import {ServerError} from 'shared';

class RoomsService {
  async getRooms() {
    return await Rooms.find({}).exec();
  }

  async getRoomById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, 'Room not found.');
    return await Rooms.findById(id).exec();
  }

  async getRoomsByUserId(userId: string) {
    const user = await UsersService.getUserById(userId);
    if (!user) throw new ServerError(404, 'User not found');
    return await Rooms.find({owner: user._id}).exec();
  }

  async addRoom(userId: string) {
    const user = await UsersService.getUserById(userId);
    if (!user) throw new ServerError(404, 'User not found');
    const newRoom = new Rooms({
      owner: user._id,
    });
    return await newRoom.save();
  }

  async updateLastVisit(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, 'Room not found.');
    return await Rooms.findByIdAndUpdate(id, {lastVisit: new Date()}).exec();
  }

  async deleteRoom(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, 'Room not found.');
    return await Rooms.findByIdAndDelete(id).exec();
  }
}

export default new RoomsService()