import React, {useState} from 'react';
import GameControl from './components/GameControl';
import Settings from './components/Settings';
import './style.scss';
import ExtensionIcon from '@material-ui/icons/Extension';
import SettingsIcon from '@material-ui/icons/Settings';
import SocketService from "../../service/socketService";

interface IRoomControlProps {
  socketService: SocketService;
}

const RoomControl: React.FC<IRoomControlProps> = ({socketService}) => {
  type activeControlType = 'game' | 'settings';
  const [activeControl, setActiveControl] = useState<activeControlType>('game');

  const getControl = () => {
    let controlComponent;
    switch (activeControl) {
      case 'game':
        controlComponent = <GameControl socketService={socketService}/>
        break;
      case 'settings':
        controlComponent = <Settings/>
        break;
    }
    return controlComponent;
  }

  return (
    <div className="room-control">
      <ul className="room-control__nav">
        <li
          className={`room-control__item ${activeControl === 'game' ? 'room-control__item_active': ''}`}
          onClick={() => setActiveControl('game')}
        >
          <ExtensionIcon color={"action"}/>
        </li>
        <li
          className={`room-control__item ${activeControl === 'settings' ? 'room-control__item_active': ''}`}
          onClick={() => setActiveControl('settings')}
        >
          <SettingsIcon color={"action"}/>
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

export default RoomControl;