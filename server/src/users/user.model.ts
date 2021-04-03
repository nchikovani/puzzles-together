import { model, Schema, Model, Document } from 'mongoose';

export interface UserTypes extends Document {
  registered: boolean;
}

const UsersSchema = new Schema({
  registered: { type: Boolean, required: true },
  // hash: String,
  // salt: String,
});

const Users: Model<UserTypes> = model('Users', UsersSchema);

export default Users;