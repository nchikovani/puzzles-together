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
  movablePartXDiff: number;
  movablePartYDiff: number;

  constructor(props: GamePropsTypes) {
    super(props);
    this.canvas = createRef();
  }

  componentDidUpdate(prevProps: Readonly<GamePropsTypes>, prevState: Readonly<any>, snapshot?: any) {
    const {gameData, update} = this.props;
    if (gameData && gameData !== prevProps.gameData) {
      let image = new Image();
      image.onload = () => {
        this.initGame(gameData, image);
      };
      image.src = gameData.image;
    } else if (update && update !== prevProps.update && this.puzzles) {
      this.puzzles.setUpdate(update);
      this.puzzles.drawPuzzles();
    }
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
      if (!this.movablePart) return;
      const update = this.puzzles.getUpdate(this.movablePart, this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff);
      this.puzzles.setUpdate(update);
      this.props.socketService.sendUpdate(update);
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
    }
  }

  mouseMoveHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    // @ts-ignore
    const canvasElement = this.canvas.current;
    this.mouseX = e.pageX - canvasElement.offsetLeft - canvasElement.clientLeft;
    this.mouseY = e.pageY - canvasElement.offsetTop - canvasElement.clientTop;

    if (!this.puzzles) return;
    const isOverPart = !!this.puzzles.getPartInCoords(this.mouseX, this.mouseY);
    canvasElement.style.cursor = isOverPart ? 'pointer' : 'default';
  }

  render() {
    return <canvas
      ref={this.canvas}
      className="game"
      onMouseDown={() => this.mouseDownHandler()}
      onMouseUp={() => this.movablePart = null}
      onMouseMove={(e)=>this.mouseMoveHandler(e)}
      onMouseOut={() => this.movablePart = null}
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