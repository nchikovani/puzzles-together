import * as userService from '../../service/userService';
import {setUser, setPersonalArea, setPersonalAreaRooms} from './index';

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

export const fetchPostRoom = (name: string) => async (dispatch: any) => {
  const {rooms} = await userService.postRoom(name);
  rooms && dispatch(setPersonalAreaRooms(rooms));
};