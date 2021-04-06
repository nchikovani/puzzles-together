import { model, Schema, Model, Document } from 'mongoose';

export interface RoomTypes extends Document {
  owner: any;
  name: string;
}

const RoomsSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: false},
});

const Rooms: Model<RoomTypes> = model('Rooms', RoomsSchema);

export default Rooms;