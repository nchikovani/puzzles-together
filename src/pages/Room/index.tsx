import React from 'react';
import Game from "../../components/Game";
import {useParams} from 'react-router-dom';
import SocketService from '../../service/socketService';

interface RoomPropsTypes {
  socketService: SocketService;
}

function Room(props: RoomPropsTypes) {
  // @ts-ignore
  let { roomId } = useParams();
  props.socketService.joinRoom(roomId);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>)=> {
    let file = e.target && e.target.files && e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
      // @ts-ignore
      props.socketService.createPuzzle(e.target.result);
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="App" style={{width: '100%'}}>
      <input type="file" onChange={handleImage} style={{display: 'block'}}/>
      <Game socketService={props.socketService}/>
    </div>
  )
}

export default Room;