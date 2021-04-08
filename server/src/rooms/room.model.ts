import { model, Schema, Model, Document } from 'mongoose';

export interface RoomTypes extends Document {
  owner: any;
  name: string;
  lastVisit: Date;
}

const RoomsSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: false},
  lastVisit: {type: Date, required: true, default: new Date() }
});

const Rooms: Model<RoomTypes> = model('Rooms', RoomsSchema);

export default Rooms;