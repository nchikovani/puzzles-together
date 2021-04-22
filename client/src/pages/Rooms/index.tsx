import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import './style.scss';
import {connect, useDispatch} from "react-redux";
import {openModalWindow} from '../../store/actions'
import ConfirmWindow from '../../components/ConfirmWindow';
import {fetchAddRoom, fetchGetRooms, fetchDeleteRoom} from '../../store/actions/fetchActions';
import {IRoomsState, IStore} from "../../store/store.types";
import {useRouteMatch} from "react-router-dom";
import {setRooms} from '../../store/actions';
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
  const deleteRoom = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, roomId: string) => {
    e.stopPropagation();
    dispatch(openModalWindow(<ConfirmWindow message={t("confirm.deleteRoom")} confirmAction={()=>dispatch(fetchDeleteRoom(roomId))}/>))
  }
  const getRooms = () => {
    const targetRooms = roomShown === 'own' ? rooms.ownRooms : rooms.visitedRooms;
    return <div className="room-list">
      {
        roomShown === 'own' &&
        <Card
          className="room-item room-item_create"
          onClick={createRoom}
        >
          <div className="room-item__content">
            <Typography variant="h6">
              {t('rooms.createRoom')}
            </Typography>
          </div>
        </Card>
      }
      {
        targetRooms.map(room => <Card
          key={room._id}
          className="room-item"
          style={{backgroundImage: `url(${room.puzzleImage})`}}
          onClick={() => joinRoom(room._id)}
        >
          <div className="room-item__background"/>
          <div className="room-item__content">
            {
              roomShown === 'own' &&
              <div className="room-item__button-group">
                <IconButton
                  onClick={(e) => deleteRoom(e, room._id)}
                  aria-label="delete"
                  size="small"
                >
                  <CloseIcon/>
                </IconButton>
              </div>
            }
            <Typography variant="h6">
              {room.name || room._id}
            </Typography>
          </div>
        </Card>)
      }
    </div>
  }

  return <div className="rooms-page">
    <Helmet
      title={`${t('rooms.myRooms')}`}
    />
    <div className="rooms-page__navigation">
      <Button
        onClick={() => setRoomShown('own')}
      >{t("rooms.myRooms")}</Button>
      <Button
        onClick={() => setRoomShown('visited')}
      >{t("rooms.visitedRooms")}</Button>
    </div>
    {
      rooms.isLoaded
      ? getRooms()
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