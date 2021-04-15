import Rooms from "./room.model";
import {Types} from 'mongoose';
import UsersService from '../users/users.service';
import {ServerError, serverErrorMessages} from 'shared';

class RoomsService {
  async getRooms() {
    return await Rooms.find({}).exec();
  }

  async getRoomById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, serverErrorMessages.roomNotFound);
    return await Rooms.findById(id).exec();
  }

  async getRoomsByUserId(userId: string) {
    const user = await UsersService.getUserById(userId);
    if (!user) throw new ServerError(404, serverErrorMessages.userNotFound);
    return await Rooms.find({owner: user._id}).exec();
  }

  async addRoom(userId: string) {
    const user = await UsersService.getUserById(userId);
    if (!user) throw new ServerError(404, serverErrorMessages.userNotFound);
    const newRoom = new Rooms({
      owner: user._id,
    });
    return await newRoom.save();
  }

  async setSettings(id: string, name: string, createPuzzleOnlyOwner: boolean) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, serverErrorMessages.roomNotFound);
    return await Rooms.findByIdAndUpdate(id, {name, createPuzzleOnlyOwner}).exec();
  }

  async updateLastVisit(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, serverErrorMessages.roomNotFound);
    return await Rooms.findByIdAndUpdate(id, {lastVisit: new Date()}).exec();
  }

  async deleteRoom(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, serverErrorMessages.roomNotFound);
    return await Rooms.findByIdAndDelete(id).exec();
  }
}

export default new RoomsService()