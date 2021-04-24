import { model, Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  registered: boolean;
}

const UsersSchema = new Schema({
  registered: { type: Boolean, required: true },
  // hash: String,
  // salt: String,
});

const Users: Model<IUser> = model('Users', UsersSchema);

export default Users;