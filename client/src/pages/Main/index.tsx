import React from 'react';
import SocketService from "../../service/socketService";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";

interface IMainProps {
  socketService: SocketService;
}

const Main: React.FC<IMainProps> = () => {
  const {t} = useTranslation();
  // const createRoom = () => {
  //   props.socketService.createRoom();
  // }

  return (
    <div>
      <Helmet
        title={`${t('common.appName')}`}
      />
      {/*<button*/}
      {/*  // onClick={createRoom}*/}
      {/*  style={{cursor: "pointer"}}*/}
      {/*>Создать Комнату</button>*/}
    </div>
  )
}

export default Main;
