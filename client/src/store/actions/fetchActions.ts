import * as userService from '../../service/userService';
import {setUser, setRooms} from './index';

export const fetchGetUser = () => async (dispatch: any) => {
  const {id, token} = await userService.getUser();
  localStorage.setItem('token', token);
  typeof id === 'string' && dispatch(setUser(id));
};

export const fetchGetRooms = () => async (dispatch: any) => {
  const {rooms} = await userService.getRooms();
  rooms && dispatch(setRooms(rooms));
};

export const fetchPostRoom = (name: string) => async (dispatch: any) => {
  const {rooms} = await userService.postRoom(name);
  rooms && dispatch(setRooms(rooms));
};