import { model, Schema, Model, Document } from 'mongoose';

export interface IRoom extends Document {
  owner: any;
  visitorsId: any[];
  name: string;
  createPuzzleOnlyOwner: boolean
  lastVisit: Date;
}

const RoomsSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  visitorsId: [{type: Schema.Types.ObjectId, ref: 'Users'}],
  name: { type: String, required: false},
  createPuzzleOnlyOwner: {type: Boolean, required: true, default: true},
  lastVisit: {type: Date, required: true, default: new Date() }
});

const Rooms: Model<IRoom> = model('Rooms', RoomsSchema);

export default Rooms;