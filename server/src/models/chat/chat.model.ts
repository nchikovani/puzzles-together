import { model, Schema, Model, Document } from 'mongoose';

export interface IChat extends Document {
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  userId: string;
  content: string;
  date: Date;
}

const ChatSchema = new Schema({
  messages: [{
    id: {type: String, required: true},
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    content: {type: String, required: true},
    date: {type: Date, required: true},
  }]
});

const Chat: Model<IChat> = model('Chat', ChatSchema);

export default Chat;