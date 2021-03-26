import {io} from "socket.io-client";
import {UpdateType, GameDataType} from '../components/Game/Puzzles/Puzzles.types'
const SERVER_URL = 'http://localhost:8080';
export default class socketService {
  socket;
  constructor() {
    this.socket = io(SERVER_URL, {transports: ['websocket', 'polling', 'flashsocket']});

  }

  createPuzzle(image: string) {
    this.socket.emit('puzzle:add', { image })
  }

  handleGettingPuzzle(handle: (puzzles: GameDataType)=>void) {
    this.socket.on('puzzle', (puzzles) => {
      handle(puzzles);
    });
  }

  sendUpdate (update: UpdateType) {
    this.socket.emit('puzzle:setUpdate', { update })
  }

  handleGettingUpdate (handler: (update: UpdateType) => void) {
    this.socket.on('puzzle:update', (data) => {
      handler(data.update);
    });
  }


}