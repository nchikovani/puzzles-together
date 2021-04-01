import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import './style.scss';
import UserService from "../../service/userService";

interface UserRoomsPropsTypes {
  userService: UserService;
}

function UserRooms ({userService}: UserRoomsPropsTypes) {
  const [rooms, setRooms] = useState(null)
  const history = useHistory();
  useEffect(() => {
    const localStoreToken = localStorage.getItem('token');
    foo(localStoreToken);

    async function foo(localStoreToken: string | null) {
      if (!localStoreToken) {
        const token = await userService.postUser();
        localStorage.setItem('token', token);
      }
      const rooms = await userService.getRooms();
      setRooms(rooms);
    }
  }, []);



  const joinRoom = (roomId: string) => {
    history.push(`/Room/` + roomId);
  }
  const createRoom = async () => {
    console.log('create Room');
    const rooms = await userService.postRoom('название');
    setRooms(rooms);
  }
  // const rooms: any[] = [{id: 1}, {id: 5}];

  return (
    <div className="room-list">
      <div
        className="room-list__item room-list__create-room"
        onClick={createRoom}
      >
        Создать комнату
      </div>
      {
        // @ts-ignore
        rooms && rooms.map(room => <div
          key={room.id}
          className="room-list__item"
          onClick={() => joinRoom(room.id)}
        >
          {room.id}
        </div>)
      }
    </div>
  )
}

export default UserRooms;