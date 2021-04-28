import React, {useEffect, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmWindow from "../../../ConfirmWindow";
import './style.scss';
import {IStore} from "../../../../store/store.types";
import {connect, useDispatch} from "react-redux";
import SocketService from "../../../../service/socketService";
import {IOption} from "../../../../../../shared";
import {useTranslation} from "react-i18next";
import {setOptions, openModalWindow, clearGame} from '../../../../store/actions';

interface IGameControlProps {
  socketService: SocketService;
  options: IOption[] | null;
  puzzleIsCreated: boolean;
}

const GameControl: React.FC<IGameControlProps> = ({socketService, options, puzzleIsCreated}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!options || !options[0]) return;
    setSelectedOption(options[0].id);
  }, [options]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target && e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size >= 3e6) throw new Error(t("error.imageTooBig"));
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setSelectedOption('');
        dispatch(setOptions(null));
        socketService.getOptions(e.target.result);
        if (inputFileRef.current) inputFileRef.current.value = '';
      }
    });
    reader.readAsDataURL(file);
  }

  const createPuzzle = () => {
    dispatch(clearGame());
    socketService.createPuzzle(selectedOption);
    setSelectedOption('');
  }

  const confirmCreatePuzzle = () => {
    if (puzzleIsCreated) {
      return dispatch(openModalWindow(<ConfirmWindow message={t('confirm.createPuzzle')} confirmAction={createPuzzle}/>))
    }
    return createPuzzle()
  }

  return (
    <div className="game-control">
      <input ref={inputFileRef} type="file" accept="image/*" onChange={(e) => handleImage(e)} style={{display: 'none'}}/>
      <Button
        onClick={() => inputFileRef.current && inputFileRef.current.click()}
        style={{marginBottom: "5px"}}
        size="small"
      >{t("room.loadImage")}</Button>
      <TextField
        style={{marginLeft: "5px", marginBottom: "10px"}}
        select
        disabled={!options}
        size="small"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        helperText="Выберите количество деталей"
      >
        {options
          ? options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.columnCount * option.rowCount}
            </MenuItem>
          )) : <MenuItem/>
        }
      </TextField>
      <Button
        onClick={() => confirmCreatePuzzle()}
        disabled={!selectedOption}
        size="small"
        variant="contained"
        color="primary"
      >{t("room.createPuzzle")}</Button>
    </div>
  )
}
const mapStateToProps = (store: IStore) => {
  return {
    options: store.game.options,
    puzzleIsCreated: !!store.game.gameData,
  }
}

export default connect(mapStateToProps)(GameControl);