import Rooms from "./room.model";
import { ObjectId } from 'mongoose';

class RoomsService {
  async getRoomById(id: string) {
    try {
      return await Rooms.findById(id).exec();
    } catch (error) {
      console.log(error);
    }
  }

  async getRoomsByUserId(userId: ObjectId) {
    try {
      return await Rooms.find({owner: userId}).exec();
    } catch (error) {
      console.log(error);
    }
  }

  async addRoom(userId: string) {
    try {
      const newRoom = new Rooms({
        owner: userId,
      });
      return await newRoom.save();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new RoomsService()