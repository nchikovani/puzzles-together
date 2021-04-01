import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import './style.scss';
import {connect, useDispatch} from "react-redux";
import {StoreTypes} from "../../store/store.types";
import {fetchGetRooms, fetchPostRoom} from '../../store/actions/fetchActions';

interface UserRoomsTypes {
  rooms: any[];
}

function UserRooms (props: UserRoomsTypes) {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetRooms());
  }, []);


  const joinRoom = (roomId: string) => {
    history.push(`/room/` + roomId);
  }
  const createRoom = () => {
    dispatch(fetchPostRoom('Название'))
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
          {room.id}
        </div>)
      }
    </div>
  )
}

const mapStateToProps = (store: StoreTypes) => {
  return {
    rooms: store.user.rooms
  }
}

export default connect(mapStateToProps)( UserRooms);