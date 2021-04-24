import React from 'react';
import Game from "../../components/Game";
import RoomControl from '../../components/RoomControl';
import Chat from '../../components/Chat';
import SocketService from '../../service/socketService';
import store from '../../store';
import {clearRoom} from '../../store/actions';
import {connect} from "react-redux";
import {WithTranslation, withTranslation} from 'react-i18next';
import {withRouter, RouteComponentProps} from "react-router";
import {IRoomState, IStore} from '../../store/store.types';
import {Helmet} from "react-helmet";
import './style.scss';

interface IMatchParams {
  roomId: string;
}

interface IRoomProps extends RouteComponentProps<IMatchParams>, WithTranslation {
  socketService: SocketService;
  room: IRoomState;
}

class Room extends React.Component<IRoomProps, {}> {
  constructor(props: IRoomProps) {
    super(props);
    const roomId = props.match.params.roomId;
    props.socketService.connect();
    props.socketService.joinRoom(roomId);
  }

  componentDidMount() {
    //получить комнату
  }

  componentWillUnmount() {
    this.props.socketService.disconnect();
    store.dispatch(clearRoom());
  }

  render() {
    return (
      <>

        {
          this.props.room.isLoaded
            ? <div className="room" style={{width: '100%'}}>
              <Helmet
                title={`${this.props.t('room.room')}: ${this.props.room.name || this.props.match.params.roomId}`}
              />
              <div className="room-game">
                <div className="room-game__game">
                  <Game socketService={this.props.socketService}/>
                </div>
                <aside className="room-game__sidebar">
                  <div className="room-game__room-control">
                    <RoomControl socketService={this.props.socketService}/>
                  </div>
                  <div className="room-game__chat">
                    <Chat socketService={this.props.socketService} chatId={this.props.room.chatId}/>
                  </div>
                </aside>
              </div>
            </div>
            : null
        }
      </>

    )
  }
}

const mapStateToProps = (store: IStore) => {
  return {
    room: store.room
  }
}

export default connect(mapStateToProps)(withRouter(withTranslation()(Room)));