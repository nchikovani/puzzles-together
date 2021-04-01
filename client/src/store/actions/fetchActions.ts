import * as userService from '../../service/userService';
import {setUser, setPersonalArea, addRoom} from './index';

export const fetchGetUser = () => async (dispatch: any) => {
  const {id, registered, token} = await userService.getUser();
  localStorage.setItem('token', token);
  typeof id === 'string' && dispatch(setUser(id, registered));
};

export const fetchGetPersonalArea = (userId: string) => async (dispatch: any) => {
  const {rooms, isOwner, error} = await userService.getPersonalArea(userId);
  if (error) {
    dispatch(setPersonalArea([], false));
    throw new Error(error);
  }
  rooms && dispatch(setPersonalArea(rooms, isOwner));
};

export const fetchAddRoom = (joinRoom: (id: string) => void) => async (dispatch: any) => {//addRoom
  const {room} = await userService.addRoom();
  joinRoom(room.id);
  room && dispatch(addRoom(room));//открыть окошко
};