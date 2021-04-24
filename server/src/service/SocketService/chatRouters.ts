import ChatService from '../../models/chat/chat.service';
import {SocketObject} from "./SocketService.types";
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import ActivePuzzlesService from "./ActivePuzzlesService";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export default async function chatRouters(action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>, socket: SocketObject, activePuzzlesService: ActivePuzzlesService) {
  switch (action.type) {
    case webSocketActionsTypes.SEND_CHAT_MESSAGE_ACTION: {
      const roomId = socket.roomId;
      if (!roomId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      if (!socket.userId) throw new ServerError(400, serverErrorMessages.didNotJoin);
      await ChatService.addMessage(action.chatId, socket.userId, action.message);
    }
  }
}