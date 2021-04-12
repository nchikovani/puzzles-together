import * as webSocketClientActions from "./webSocketClientActions";
import * as webSocketServerActions from "./webSocketServerActions";
import * as webSocketActionsTypes from './webSocketActionsTypes';
import ServerError, {serverErrorMessages} from "./ServerError";

import {IConnection, IGameData, ILink, IMove, IOption, IPart, IUpdate} from './Game.types';

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;

type WebSocketClientActionsType = ReturnType<InferValueTypes<typeof webSocketClientActions>>;
type WebSocketServerActionsType = ReturnType<InferValueTypes<typeof webSocketServerActions>>;

export {
  webSocketActionsTypes,
  webSocketClientActions,
  webSocketServerActions,
  ServerError,
  serverErrorMessages,
};
export type {
  IConnection,
  IGameData,
  ILink,
  IMove,
  IOption,
  IPart,
  IUpdate,

  WebSocketClientActionsType,
  WebSocketServerActionsType
};