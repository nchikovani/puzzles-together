import {IGameData, IUpdate, IOption} from 'shared'
import * as actions from "./actions";
import React from "react";

export interface IGameState {
  gameData: IGameData | null;
  update: IUpdate | null;
  options: IOption[] | null;
  isSolved: boolean;
}

export interface IRoomsState {
  list: IRoomItemState[];
  isLoaded: boolean;
}

export interface IRoomItemState {
  _id: string;
  owner: string;
  name?: string;
  puzzle?: string;//?
}

export interface IRoomState {
  id: string | null;
  owner: string | null;
  name: string | null;
  createPuzzleOnlyOwner: boolean;
  isLoaded: boolean;
}

export interface IUserState {
  id: string | null;
  registered: false;
  isLoaded: boolean;
}

export interface IErrorState {
  isError: boolean,
  showType: ErrorShowType,
  message: string | null,
  statusCode: number | null,
}

export type ErrorShowType = 'page' | "modalWindow" | null;

export interface IModalWindowState {
  isOpen: boolean;
  content: React.ComponentElement<any, any> | null;
}

export interface IStore {
  room: IRoomState;
  game: IGameState;
  user: IUserState;
  rooms: IRoomsState;
  error: IErrorState;
  modalWindow: IModalWindowState;
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
export type ActionType = ReturnType<InferValueTypes<typeof actions>>;
