import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import './style.scss';
import {connect, useDispatch} from "react-redux";
import {fetchAddRoom, fetchGetRooms} from '../../../store/actions/fetchActions';
import {RoomTypes, StoreTypes} from "../../../store/store.types";
import {useRouteMatch} from "react-router-dom";

interface UserRoomsTypes {
  rooms: RoomTypes[];
}

function Rooms (props: UserRoomsTypes) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchGetRooms(match.params.userId));
  }, [dispatch, match.params]);


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
        props.rooms.map(room => <div
          key={room._id}
          className="room-list__item"
          onClick={() => joinRoom(room._id)}
        >
          {room.name || room._id}
        </div>)
      }
    </div>
  )
}
const mapStateToProps = (store: StoreTypes) => {
  return {
    rooms: store.rooms,
  }
}

export default connect(mapStateToProps)(Rooms);