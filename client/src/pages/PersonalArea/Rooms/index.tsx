import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import './style.scss';
import {connect, useDispatch} from "react-redux";
import {fetchAddRoom, fetchGetRooms} from '../../../store/actions/fetchActions';
import {IRoomsState, IStore} from "../../../store/store.types";
import {useRouteMatch} from "react-router-dom";
import {setRooms} from '../../../store/actions';
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";

interface IMatchParams {
  userId: string;
}

interface IUserRooms {
  rooms: IRoomsState;
}

const Rooms: React.FC<IUserRooms> = ({rooms}) => {
  const match = useRouteMatch<IMatchParams>();
  const dispatch = useDispatch();
  const history = useHistory();
  const {t} = useTranslation();

  useEffect(() => {

    dispatch(fetchGetRooms(match.params.userId));
    return () => {
      dispatch(setRooms([], false));
    }
  }, [match.params]);

  const joinRoom = (roomId: string) => {
    history.push(`/room/` + roomId);
  }
  const createRoom = () => {
    dispatch(fetchAddRoom(history))
  }

  return <>
    <Helmet
      title={`${t('rooms.myRooms')}`}
    />
    {
      rooms.isLoaded
      ? <div className="room-list">
        <div
          className="room-list__item room-list__create-room"
          onClick={createRoom}
        >
          {t('rooms.createRoom')}
        </div>
        {
          rooms.list.map(room => <div
            key={room._id}
            className="room-list__item"
            onClick={() => joinRoom(room._id)}
          >
            {room.name || room._id}
          </div>)
        }
      </div>
      : null
    }
  </>

}
const mapStateToProps = (store: IStore) => {
  return {
    rooms: store.rooms,
  }
}

export default connect(mapStateToProps)(Rooms);