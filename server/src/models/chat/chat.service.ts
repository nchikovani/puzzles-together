import Chat from "./chat.model";
import {ServerError, serverErrorMessages} from 'shared';
import {Types} from "mongoose";
import Rooms from "../rooms/room.model";

class ChatService {
  async getChat(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ServerError(404, serverErrorMessages.userNotFound);
    return await Chat.findById(id).exec();
  }

  async addMessage(chatId: string, userId: string, messageContent: string) {
    if (!Types.ObjectId.isValid(chatId)) throw new ServerError(404, serverErrorMessages.roomNotFound);

    console.log(messageContent);
    return await Rooms.findByIdAndUpdate(chatId, {$push: {messages: {userId, content: messageContent}}}).exec();
  }

  async createChat() {
    const newChat = new Chat({});
    return await newChat.save();
  }
}

export default new ChatService()