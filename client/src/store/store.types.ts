import {IGameData, IUpdate, IOption} from 'shared'
import * as actions from "./actions";

export interface IGameState {
  gameData: IGameData | null;
  update: IUpdate | null;
  options: IOption[] | null;
  isSolved: boolean;
}

export interface IRoomsState {
  list: IRoomState[];
  isLoaded: boolean;
}

export interface IRoomState {
  _id: string;
  owner: string;
  name?: string;
  puzzle?: string;
}

export interface IUserState {
  id: string | null;
  registered: false;
  isLoaded: boolean;
}

export interface IErrorState {
  isError: boolean,
  showType: string | null,
  message: string | null,
  statusCode: number | null,
}

export interface IStore {
  game: IGameState;
  user: IUserState;
  rooms: IRoomsState;
  error: IErrorState;
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
export type ActionType = ReturnType<InferValueTypes<typeof actions>>;
