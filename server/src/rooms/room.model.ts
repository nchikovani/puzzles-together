import { model, Schema, Model, Document, ObjectId } from 'mongoose';

export interface RoomTypes extends Document {
  owner: ObjectId;
  name: string;
  puzzleData: string | null;
}

const RoomsSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: false},
  puzzle: { type: String, required: false}
});

const Rooms: Model<RoomTypes> = model('Rooms', RoomsSchema);

export default Rooms;