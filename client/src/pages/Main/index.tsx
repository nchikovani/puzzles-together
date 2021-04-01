import React from 'react';
import SocketService from "../../service/socketService";

interface MainPropsTypes {
  socketService: SocketService;
}

function Main(props: MainPropsTypes) {
  // const createRoom = () => {
  //   props.socketService.createRoom();
  // }
  return (
    <div>
      {/*<button*/}
      {/*  // onClick={createRoom}*/}
      {/*  style={{cursor: "pointer"}}*/}
      {/*>Создать Комнату</button>*/}
    </div>
  )
}

export default Main;
