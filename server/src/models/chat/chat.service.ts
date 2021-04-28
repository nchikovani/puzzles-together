import Chat from "./chat.model";

class ChatService {
  async getChat(id: string) {
    return await Chat.findById(id).exec();
  }

  async addMessage(chatId: string, message: any) {

    return await Chat.findByIdAndUpdate(chatId, {$push: {messages: message}}).exec();
  }

  async createChat() {
    const newChat = new Chat({});
    return await newChat.save();
  }

  async deleteChat(id: string) {
    return await Chat.findByIdAndDelete(id).exec();
  }
}

export default new ChatService()