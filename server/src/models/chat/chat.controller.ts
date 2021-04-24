import ChatService from './chat.service';
import {Request, Response} from 'express';
import {ServerError, serverErrorMessages} from "shared";

class ChatController {
  async getChat(req: Request, res: Response) {
    const roomId = req.params.roomId;
    const chat = await ChatService.getChat(roomId);
    if (!chat) throw new ServerError(404, serverErrorMessages.chatNotFound)
    return res.status(200).json({id: chat._id, messages: chat?.messages});
  }
}

export default new ChatController();