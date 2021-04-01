import React from 'react';
import {useHistory} from 'react-router-dom'
import './style.scss';
import {useDispatch} from "react-redux";
import {fetchAddRoom} from '../../../store/actions/fetchActions';

interface UserRoomsTypes {
  rooms: any[];
}

function Rooms (props: UserRoomsTypes) {
  const history = useHistory();
  const dispatch = useDispatch();

  const joinRoom = (roomId: string) => {
    history.push(`/room/` + roomId);
  }
  const createRoom = () => {
    dispatch(fetchAddRoom(joinRoom))
  }

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
        props.rooms.map(room => <div
          key={room.id}
          className="room-list__item"
          onClick={() => joinRoom(room.id)}
        >
          {room.name}
        </div>)
      }
    </div>
  )
}

export default Rooms;