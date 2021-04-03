import Users from "./user.model";

class UsersService {
  async getUserById(id: string) {
    try {
      return await Users.findById(id).exec();
    } catch (error) {
      console.log(error);
    }
  }

  async createUser() {
    try {
      const newUser = new Users({
        registered: false,
      });
      return await newUser.save();
    } catch (error) {
     console.log(error);
    }
  }
}

export default new UsersService()