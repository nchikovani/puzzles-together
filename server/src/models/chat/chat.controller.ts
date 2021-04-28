import ChatService from './chat.service';
import {Request, Response} from 'express';
import {ServerError, serverErrorMessages} from "shared";

class ChatController {
  async getChat(req: Request, res: Response) {
    const chatId = req.params.chatId;
    const chat = await ChatService.getChat(chatId);
    if (!chat) throw new ServerError(404, serverErrorMessages.chatNotFound);
    return res.status(200).json({chat});
  }
}

export default new ChatController();