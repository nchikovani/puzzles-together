import * as userService from '../../service/userService';
import {setUser, setRooms} from './index';
import { History } from 'history';
import {Dispatch} from "redux";

export const fetchGetUser = () => async (dispatch: Dispatch) => {
  const {id, registered} = await userService.getUser();
  typeof id === 'string' && dispatch(setUser(id, registered));
};

export const fetchGetRooms = (userId: string) => async (dispatch: Dispatch) => {
  const {rooms} = await userService.getRooms(userId);

  rooms && dispatch(setRooms(rooms, true));
};

export const fetchAddRoom = ( history: History) => async (dispatch: Dispatch) => {
  const {room} = await userService.addRoom();
  room && history.push(`/room/` + room._id);
};