import * as userService from '../../service/userService';
import {setUser, setRooms, addRoom} from './index';

export const fetchGetUser = () => async (dispatch: any) => {
  const {id, registered} = await userService.getUser();
  typeof id === 'string' && dispatch(setUser(id, registered));
};

export const fetchGetRooms = (userId: string) => async (dispatch: any) => {
  const {rooms} = await userService.getRooms(userId);

  rooms && dispatch(setRooms(rooms));
};

export const fetchAddRoom = (joinRoom: (id: string) => void) => async (dispatch: any) => {//addRoom
  const {room} = await userService.addRoom();
  joinRoom(room._id);
  room && dispatch(addRoom(room));//открыть окошко
};