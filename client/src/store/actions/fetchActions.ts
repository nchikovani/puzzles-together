import * as userService from '../../service/userService';
import {setUser, setPersonalArea, addRoom} from './index';

export const fetchGetUser = () => async (dispatch: any) => {
  const {id, registered} = await userService.getUser();
  typeof id === 'string' && dispatch(setUser(id, registered));
};

export const fetchGetRooms = (userId: string) => async (dispatch: any) => {
  const {rooms, error} = await userService.getRooms(userId);
  if (error) {
    dispatch(setPersonalArea([]));
    throw new Error(error);
  }
  rooms && dispatch(setPersonalArea(rooms));
};

export const fetchAddRoom = (joinRoom: (id: string) => void) => async (dispatch: any) => {//addRoom
  const {room} = await userService.addRoom();
  joinRoom(room._id);
  room && dispatch(addRoom(room));//открыть окошко
};