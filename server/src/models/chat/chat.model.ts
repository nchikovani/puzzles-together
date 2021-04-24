import { model, Schema, Model, Document } from 'mongoose';
const shortid = require('shortid');

export interface IChat extends Document {
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  userId: string;
  content: string;
  date: string;
}

const ChatSchema = new Schema({
  // roomId: { type: Schema.Types.ObjectId, ref: 'Rooms', required: true },
  messages: [{
    id: {type: String, required: true, default: shortid.generate()},
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    content: {type: String, required: true},
    date: {type: Date, required: true, default: new Date},
  }]
});

const Chat: Model<IChat> = model('Chat', ChatSchema);

export default Chat;