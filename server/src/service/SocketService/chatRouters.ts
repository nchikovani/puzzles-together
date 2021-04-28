import ChatService from '../../models/chat/chat.service';
import {SocketObject} from "./SocketService.types";
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import ActivePuzzlesService from "./ActivePuzzlesService";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {chatMessageAction} from "shared/webSocketServerActions";
import {IMessage} from "../../models/chat/chat.model";
const shortid = require('shortid');

export default async function chatRouters(action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>, socket: SocketObject, activePuzzlesService: ActivePuzzlesService) {
  switch (action.type) {
    case webSocketActionsTypes.SEND_CHAT_MESSAGE_ACTION: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      if (!socket.userId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      const message: IMessage = {
        id: shortid.generate(),
        userId: socket.userId,
        content: action.message,
        date: new Date,
      }
      await ChatService.addMessage(action.chatId, message);
      //отправлять отправителю isFetched
      io.to(roomId).emit("chat", chatMessageAction(message));//всем кроме отправителя
    }
  }
}