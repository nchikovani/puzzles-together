import * as userService from '../../service/userService';
import {setUser, setRooms, deleteRoom, setChat} from './index';
import { History } from 'history';
import {Dispatch} from "redux";

export const fetchGetUser = () => async (dispatch: Dispatch) => {
  const {id, registered} = await userService.getUser();
  typeof id === 'string' && dispatch(setUser(id, registered));
};

export const fetchGetRooms = (userId: string) => async (dispatch: Dispatch) => {
  const {ownRooms, visitedRooms} = await userService.getRooms(userId);

  dispatch(setRooms(ownRooms, visitedRooms, true));
};

export const fetchAddRoom = ( history: History) => async (dispatch: Dispatch) => {
  const {room} = await userService.addRoom();
  room && history.push(`/room/` + room._id);
};

export const fetchDeleteRoom = ( roomId: string) => async (dispatch: Dispatch) => {
  await userService.deleteRoom(roomId);
  dispatch(deleteRoom(roomId));
};

export const fetchGetChat = (chatId: string) => async (dispatch: Dispatch) => {
  const {chat} = await userService.getChat(chatId);

  dispatch(setChat(chat));
};