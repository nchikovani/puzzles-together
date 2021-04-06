import { model, Schema, Model, Document } from 'mongoose';
import {LinkTypes} from "../../../shared";

export interface RoomTypes extends Document {
  owner: any;
  name: string;
  jsonPuzzle?: string;
  // puzzle: {
  //   imageUrl?: string;
  // }
}

const RoomsSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: false},
  jsonPuzzle: { type: String, required: false},
  // puzzle: {
  //   imageUrl: {type: String, required: false},
  //   parts: [{
  //     id: String,
  //     xIndex: Number,
  //     yIndex: Number,
  //     x: Number,
  //     y: Number,
  //     topLink: {
  //       type: String,
  //       connected: Boolean,
  //       id: String,
  //     },
  //     leftLink: {
  //       type: String,
  //       connected: Boolean,
  //       id: String,
  //     },
  //     rightLink: {
  //       type: String,
  //       connected: Boolean,
  //       id: String,
  //     },
  //     bottomLink: {
  //       type: String,
  //       connected: Boolean,
  //       id: String,
  //     },
  //   }],
  // }
});

const Rooms: Model<RoomTypes> = model('Rooms', RoomsSchema);

export default Rooms;