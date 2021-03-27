import React from 'react';
import Game from "../../components/Game";
import SocketService from '../../service/socketService';
import {connect} from "react-redux";
import { withRouter, RouteComponentProps  } from "react-router";

type PathParamsType = {
  roomId: string,
}

type PropsType = RouteComponentProps<PathParamsType> & {
  socketService: SocketService;
  options: object[];
}

class Room extends React.Component<PropsType, {}>  {
  constructor(props: PropsType) {
    super(props);
    const roomId = props.match.params.roomId;
    props.socketService.joinRoom(roomId);
  }

  componentDidUpdate(prevProps: Readonly<PropsType>) {
    if (this.props.options !== prevProps.options) {
      let optionsText = 'Выбирай: ';
      this.props.options.forEach(option => {
        // @ts-ignore
        if (!option.columnCount || !option.rowCount) return
        // @ts-ignore
        optionsText += `${option.columnCount * option.rowCount}, `
      })

      const result = prompt(optionsText);
      // @ts-ignore
      const targetOption = this.props.options.find(option => result == option.partCount);
      targetOption && this.props.socketService.createPuzzle(targetOption);
    }
  }

  handleImage (e: React.ChangeEvent<HTMLInputElement>) {
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
        <Game socketService={this.props.socketService}/>
      </div>
    )
  }
}

const mapStateToProps = (store: any) => {
  return {
    options: store.game.options
  }
}

export default connect(mapStateToProps)(withRouter(Room));