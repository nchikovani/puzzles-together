import * as webSocketClientActions from "./webSocketClientActions";
import * as webSocketServerActions from "./webSocketServerActions";
import * as webSocketActionsTypes from './webSocketActionsTypes';

import {ConnectionTypes, GameDataTypes, LinkTypes, MoveTypes, OptionTypes, PartTypes, UpdateTypes} from './Game.types';

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;

type WebSocketClientActionsTypes = ReturnType<InferValueTypes<typeof webSocketClientActions>>;
type WebSocketServerActionsTypes = ReturnType<InferValueTypes<typeof webSocketServerActions>>;

export {
  webSocketActionsTypes,
  webSocketClientActions,
  webSocketServerActions
};
export type {
  ConnectionTypes,
  GameDataTypes,
  LinkTypes,
  MoveTypes,
  OptionTypes,
  PartTypes,
  UpdateTypes,

  WebSocketClientActionsTypes,
  WebSocketServerActionsTypes
};