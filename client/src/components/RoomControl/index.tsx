import React, {useState} from 'react';
import GameControl from './components/GameControl';
import Settings from './components/Settings';
import './style.scss';
import ExtensionIcon from '@material-ui/icons/Extension';
import SettingsIcon from '@material-ui/icons/Settings';
import ShareIcon from '@material-ui/icons/Share';
import SocketService from "../../service/socketService";
import Share from "./components/Share";
import {IStore} from "../../store/store.types";
import {connect} from "react-redux";

interface IRoomControlProps {
  socketService: SocketService;
  owner: string | null;
  createPuzzleOnlyOwner: boolean;
  userId: string | null;
}

const RoomControl: React.FC<IRoomControlProps> = ({socketService, owner, createPuzzleOnlyOwner, userId}) => {
  type activeControlType = 'game' | 'settings' | 'share';
  const initialActiveControl = (owner === userId || !createPuzzleOnlyOwner) ? 'game' : 'share';
  const [activeControl, setActiveControl] = useState<activeControlType>(initialActiveControl);

  const getControl = () => {
    let controlComponent;
    switch (activeControl) {
      case 'game':
        controlComponent = <GameControl socketService={socketService}/>
        break;
      case 'settings':
        controlComponent = <Settings socketService={socketService}/>
        break;
      case 'share':
        controlComponent = <Share/>
        break;
    }
    return controlComponent;
  }
  return (
    <div className="room-control">
      <ul className="room-control__nav">
        {
          (owner === userId || !createPuzzleOnlyOwner) && (
            <li
              className={`room-control__item ${activeControl === 'game' ? 'room-control__item_active': ''}`}
              onClick={() => setActiveControl('game')}
            >
              <ExtensionIcon color={"action"}/>
            </li>
          )
        }
        {
          owner === userId && (
            <li
              className={`room-control__item ${activeControl === 'settings' ? 'room-control__item_active' : ''}`}
              onClick={() => setActiveControl('settings')}
            >
              <SettingsIcon color={"action"}/>
            </li>
          )
        }
        <li
          className={`room-control__item ${activeControl === 'share' ? 'room-control__item_active': ''}`}
          onClick={() => setActiveControl('share')}
        >
          <ShareIcon color={"action"}/>
        </li>
      </ul>
      <div className="room-control__control">
        {
          getControl()
        }
      </div>
    </div>
  )
}

const mapStateToProps = (store: IStore) => {
  return {
    owner: store.room.owner,
    createPuzzleOnlyOwner: store.room.createPuzzleOnlyOwner,
    userId: store.user.id,
  }
}

export default connect(mapStateToProps)(RoomControl);