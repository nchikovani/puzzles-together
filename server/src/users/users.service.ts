import Users from "./user.model";
import {ServerError, serverErrorMessages} from 'shared';
import {Types} from "mongoose";

class UsersService {
  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, serverErrorMessages.userNotFound);
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