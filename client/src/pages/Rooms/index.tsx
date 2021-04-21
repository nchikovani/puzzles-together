import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import './style.scss';
import {connect, useDispatch} from "react-redux";
import {fetchAddRoom, fetchGetRooms} from '../../store/actions/fetchActions';
import {IRoomsState, IStore} from "../../store/store.types";
import {useRouteMatch} from "react-router-dom";
import {setRooms} from '../../store/actions';
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import Button from '@material-ui/core/Button';

interface IMatchParams {
  userId: string;
}

interface IRoomsProps {
  rooms: IRoomsState;
}

const Rooms: React.FC<IRoomsProps> = ({rooms}) => {
  type roomType = 'own' | 'visited';
  const [roomShown, setRoomShown] = useState<roomType>('own');
  const match = useRouteMatch<IMatchParams>();
  const dispatch = useDispatch();
  const history = useHistory();
  const {t} = useTranslation();

  useEffect(() => {
    dispatch(fetchGetRooms(match.params.userId));
    return () => {
      dispatch(setRooms([], [], false));
    }
  }, [match.params]);

  const joinRoom = (roomId: string) => {
    history.push(`/room/` + roomId);
  }
  const createRoom = () => {
    dispatch(fetchAddRoom(history))
  }
  console.log(rooms);

  return <div className="rooms-page">
    <Helmet
      title={`${t('rooms.myRooms')}`}
    />
    <div className="rooms-page__navigation">
      <Button
        onClick={() => setRoomShown('own')}
      >Мои комнаты</Button>
      <Button
        onClick={() => setRoomShown('visited')}
      >Комнаты которые я посещал</Button>
    </div>
    {
      rooms.isLoaded
      ? roomShown === 'own'
        ? <div className="room-list">
          <div
            className="room-list__item room-list__create-room"
            onClick={createRoom}
          >
            {t('rooms.createRoom')}
          </div>
          {
            rooms.ownRooms.map(room => <div
              key={room._id}
              className="room-list__item"
              style={{backgroundImage: `url(${room.puzzleImage})`}}
              onClick={() => joinRoom(room._id)}
            >
              {room.name || room._id}
            </div>)
          }
        </div>
        : <div className="room-list">
          {
            rooms.visitedRooms.map(room => <div
              key={room._id}
              className="room-list__item"
              style={{backgroundImage: `url(${room.puzzleImage})`}}
              onClick={() => joinRoom(room._id)}
            >
              {room.name || room._id}
            </div>)
          }
        </div>
      : null
    }
  </div>

}
const mapStateToProps = (store: IStore) => {
  return {
    rooms: store.rooms,
  }
}

export default connect(mapStateToProps)(Rooms);