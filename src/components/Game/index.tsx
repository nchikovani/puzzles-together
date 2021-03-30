import React, {createRef, Ref} from 'react';
import Puzzles from "./Puzzles/Puzzles";
import Part from './Puzzles/Part';
import {GameDataType, UpdateType} from "./Puzzles/Puzzles.types";
import SocketService from '../../service/socketService';
import './style.scss';
import {connect} from "react-redux";

interface GamePropsTypes {
  gameData: GameDataType | null;
  update: UpdateType | null;
  socketService: SocketService;
}

class Game extends React.Component<GamePropsTypes, any>{
  puzzles: Puzzles;
  canvas: Ref<HTMLCanvasElement>;
  mouseX: number;
  mouseY: number;
  movablePart?: Part | null;
  canvasIsMoving: boolean;
  movablePartXDiff: number;
  movablePartYDiff: number;
  startXMovingCanvas: number;
  startYMovingCanvas: number;
  oldUpdateFromServer: UpdateType | null;
  zoomIsChanged: boolean;

  constructor(props: GamePropsTypes) {
    super(props);
    this.canvas = createRef();

    this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<GamePropsTypes>, prevState: Readonly<any>, snapshot?: any) {
    const {gameData} = this.props;
    if (gameData && gameData !== prevProps.gameData) {
      let image = new Image();
      image.onload = () => {
        this.initGame(gameData, image);
      };
      image.src = gameData.image;
    }
  }

  componentDidMount() {
    // @ts-ignore
    this.canvas && this.canvas.current.addEventListener('wheel', this.mouseWheelHandler);
  }

  componentWillUnmount() {
    // @ts-ignore
    this.canvas && this.canvas.current.removeEventListener('wheel', this.mouseWheelHandler);
  }

  initGame(gameData: GameDataType, image: HTMLImageElement) {
    // if (!this.canvas || !this.canvas.current) return;
    // @ts-ignore
    let ctx = this.canvas.current.getContext("2d");
    ctx.canvas.width = 900;
    ctx.canvas.height = 700;

    this.puzzles = new Puzzles(gameData, ctx, image);
    this.puzzles.drawPuzzles();

    setInterval(() => {
      if (!this.canvasIsMoving && !this.movablePart && this.oldUpdateFromServer === this.props.update && !this.zoomIsChanged) return;
      const fullUpdate: UpdateType = {
        moves: [],
        connections: [],
      };

      if (this.canvasIsMoving) {
        this.puzzles.incrementIndent(this.mouseX - this.startXMovingCanvas, this.mouseY - this.startYMovingCanvas);
        this.startXMovingCanvas = this.mouseX;
        this.startYMovingCanvas = this.mouseY;
      }
      if (this.movablePart) {
        const update = this.puzzles.getUpdate(this.movablePart, this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff);
        this.props.socketService.sendUpdate(update);
        fullUpdate.moves.push(...update.moves);
        fullUpdate.connections.push(...update.connections);
        // this.puzzles.drawPuzzles();
      }
      if (this.oldUpdateFromServer !== this.props.update && this.props.update) {
        fullUpdate.moves.push(...this.props.update.moves);
        fullUpdate.connections.push(...this.props.update.connections);
        this.oldUpdateFromServer = this.props.update;
      }
      this.zoomIsChanged = false;
      this.puzzles.setUpdate(fullUpdate);
      this.puzzles.drawPuzzles();
    }, 33);
  }

  mouseDownHandler() {
    if (!this.puzzles) return;
    const movablePart = this.puzzles.getPartInCoords(this.mouseX, this.mouseY);

    if (movablePart) {
      this.movablePart = movablePart;
      this.movablePartXDiff = this.mouseX - movablePart.x;
      this.movablePartYDiff = this.mouseY - movablePart.y;
    } else {
      this.canvasIsMoving = true;
      this.startXMovingCanvas = this.mouseX;
      this.startYMovingCanvas = this.mouseY;
      // @ts-ignore
      this.canvas.current.style.cursor = 'grab';
      // @ts-ignore
      console.log(this.canvas.current.style.cursor);
    }
  }

  mouseMoveHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    // @ts-ignore
    const canvasElement = this.canvas.current;
    this.mouseX = e.pageX - canvasElement.offsetLeft - canvasElement.clientLeft;
    this.mouseY = e.pageY - canvasElement.offsetTop - canvasElement.clientTop;

    if (!this.puzzles || this.canvasIsMoving) return;
    const isOverPart = !!this.puzzles.getPartInCoords(this.mouseX, this.mouseY);
    canvasElement.style.cursor = isOverPart ? 'pointer' : 'default';
  }

  mouseWheelHandler(e: Event) {
    if (!this.puzzles) return;
    e.preventDefault();
    // @ts-ignore
    if (e.deltaY < 0) { //просто изменять значение zoom, в setTimeOut смотреть, если изменился, то перерисовывать буфер
      this.puzzles.zoomIncrement(this.mouseX, this.mouseY);
    } else {
      this.puzzles.zoomDecrement(this.mouseX, this.mouseY);
    }
    this.zoomIsChanged = true;
  }

  render() {
    return <canvas
      ref={this.canvas}
      className="game"
      onMouseDown={() => this.mouseDownHandler()}
      onMouseUp={() => {
        this.movablePart = null;
        this.canvasIsMoving = false;
        // @ts-ignore
        this.canvas.current.cursor = 'default';
      }}
      onMouseMove={(e)=>this.mouseMoveHandler(e)}
      onMouseOut={() => {
        this.movablePart = null;
        this.canvasIsMoving = false;
        // @ts-ignore
        this.canvas.current.cursor = 'default';
      }}
    />;
  }

}

const mapStateToProps = (store: any) => {
  return {
    gameData: store.game.gameData,
    update: store.game.update
  }
}

export default connect(mapStateToProps)(Game);