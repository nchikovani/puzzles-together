import Users from "./user.model";
import Error from "../utils/Error";
import {Types} from "mongoose";

class UsersService {
  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error(404, 'User not found.');
    return await Users.findById(id).exec();
  }

  async createUser() {
    const newUser = new Users({
      registered: false,
    });
    return await newUser.save();
  }
}

export default new UsersService()