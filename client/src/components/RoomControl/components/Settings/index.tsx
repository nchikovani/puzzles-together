import React, {useState} from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './style.scss';
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import {IStore} from "../../../../store/store.types";
import SocketService from "../../../../service/socketService";

interface ISettingsProps {
  socketService: SocketService;
  name: string | null;
  createPuzzleOnlyOwner: boolean;
}

const Settings: React.FC<ISettingsProps> = ({socketService, name, createPuzzleOnlyOwner}) => {
  const [checked, setChecked] = useState(createPuzzleOnlyOwner);
  const [nameState, setNameState] = useState(name || '');
  const {t} = useTranslation();

  const saveSettings = () => {
    if (nameState.length > 20) throw new Error(t('error.roomNameTooBig'))
    socketService.setRoomSettings({
      name: nameState,
      createPuzzleOnlyOwner: checked,
    });
  }

  return (
    <div className="room-control-settings">
      <div className="room-control-settings__item">
        <TextField
          label="Название комнаты"
          variant="outlined"
          style={{width: '100%'}}
          value={nameState}
          size="small"
          onChange={(e) => setNameState(e.target.value)}
        />
      </div>
      <div className="room-control-settings__item">
        <div className="title">
          {
            !checked
              ? t("room.allMember")
              : t("room.onlyOwner")
          }
        </div>
        <Switch
          checked={!checked}
          onChange={(e) => setChecked(!e.target.checked)}
          color="primary"
          name="checkedB"
          inputProps={{'aria-label': 'primary checkbox'}}
        />
      </div>
      <Button
        size="small"
        variant="contained"
        color="primary"
        disabled={(name || '' ) === nameState && createPuzzleOnlyOwner === checked}
        onClick={saveSettings}
      >Сохранить</Button>
    </div>
  )
}

const mapStateToProps = (store: IStore) => {
  return {
    name: store.room.name,
    createPuzzleOnlyOwner: store.room.createPuzzleOnlyOwner,
  }
}

export default connect(mapStateToProps)(Settings);