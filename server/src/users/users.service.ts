import Users from "./user.model";
import Error from "../utils/Error";
import {Types} from "mongoose";

const validateId = (id: any, error: Error) => {
  if (!Types.ObjectId.isValid(id)) throw error;
}

class UsersService {
  async getUserById(id: string) {
    try {
      validateId(id, new Error(404, 'User not found.'));
      return await Users.findById(id).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(500, 'Unable find user.');
      }
    }
  }

  async createUser() {
    try {
      const newUser = new Users({
        registered: false,
      });
      return await newUser.save();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(500, 'Unable create user.');
      }
    }
  }
}

export default new UsersService()