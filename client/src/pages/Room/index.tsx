import React from 'react';
import Game from "../../components/Game";
import SocketService from '../../service/socketService';
import {connect} from "react-redux";
import {withRouter, RouteComponentProps} from "react-router";
import {OptionTypes} from '../../../../shared/Game.types'
import {StoreTypes} from '../../store/store.types';
import './style.scss';

type PathParamsType = {
  roomId: string,
}

type PropsType = RouteComponentProps<PathParamsType> & {
  socketService: SocketService;
  options: OptionTypes[] | null;
}

class Room extends React.Component<PropsType, {}> {
  constructor(props: PropsType) {
    super(props);
    const roomId = props.match.params.roomId;
    props.socketService.connect();
    props.socketService.joinRoom(roomId);
  }

  componentDidUpdate(prevProps: Readonly<PropsType>) {
    if (this.props.options && this.props.options !== prevProps.options) {
      let optionsText = 'Выбирай: ';
       this.props.options.forEach(option => {
        if (!option.columnCount || !option.rowCount) return
        optionsText += `${option.columnCount * option.rowCount}, `
      })

      const result = prompt(optionsText);

      const targetOption = this.props.options.find(option => Number(result) === option.partCount);
      targetOption && this.props.socketService.createPuzzle(targetOption);
    }
  }

  componentWillUnmount() {
    this.props.socketService.disconnect();
  }

  handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target && e.target.files && e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
      // @ts-ignore
      this.props.socketService.getOptions(e.target.result);
    });
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="App" style={{width: '100%'}}>
        <input type="file" onChange={(e) => this.handleImage(e)} style={{display: 'block'}}/>
        <div className="room-game">
          <div className="room-game__game">
            <Game socketService={this.props.socketService}/>
          </div>
          <div className="room-game__chat"/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store: StoreTypes) => {
  return {
    options: store.game.options
  }
}

export default connect(mapStateToProps)(withRouter(Room));