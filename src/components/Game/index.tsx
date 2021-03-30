import React, {createRef, Ref} from 'react';
import Puzzles from "./Puzzles/Puzzles";
import Part from './Puzzles/Part';
import {GameDataType, UpdateType} from "./Puzzles/Puzzles.types";
import SocketService from '../../service/socketService';
import './style.scss';
import {connect} from "react-redux";
import {fps} from './Puzzles/puzzleConstants';

interface GamePropsTypes {
  gameData: GameDataType | null;
  update: UpdateType | null;
  isSolved: boolean;
  socketService: SocketService;
}

const canvasProportions = 1.7;

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
  oldUpdateFromServer: UpdateType | null = null;
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
    if (this.props.isSolved !== prevProps.isSolved && this.props.isSolved) {
      this.puzzles.parts && alert(`Ураа, ты собрал пазл из ${this.puzzles.parts.length} кусков. Так держать!`);
    }
  }

  componentDidMount() {
    // @ts-ignore
    this.canvas && this.canvas.current.addEventListener('wheel', this.mouseWheelHandler);
    window.addEventListener(`resize`, () => {
      // @ts-ignore
      if (!this.canvas.current) return;
      // @ts-ignore
      this.ctx.canvas.width = this.canvas.current.offsetWidth;
      // @ts-ignore
      this.ctx.canvas.height = this.canvas.current.offsetWidth / canvasProportions;
      this.puzzles.updatePartsBuffers();
      this.puzzles.drawPuzzles();
    });
  }

  componentWillUnmount() {
    // @ts-ignore
    this.canvas && this.canvas.current.removeEventListener('wheel', this.mouseWheelHandler);
  }

  initGame(gameData: GameDataType, image: HTMLImageElement) {
    // if (!this.canvas || !this.canvas.current) return;
    // @ts-ignore
    this.ctx = this.canvas.current.getContext("2d");
    // @ts-ignore
    this.ctx.canvas.width = this.canvas.current.offsetWidth;
    // @ts-ignore
    this.ctx.canvas.height = this.canvas.current.offsetWidth / canvasProportions;
    // @ts-ignore
    this.puzzles = new Puzzles(gameData, this.ctx, image);
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
      }
      if (this.oldUpdateFromServer !== this.props.update) {
        this.props.update && fullUpdate.moves.push(...this.props.update.moves);
        this.props.update && fullUpdate.connections.push(...this.props.update.connections);
        this.oldUpdateFromServer = this.props.update;
      }

      this.zoomIsChanged = false;
      this.puzzles.setUpdate(fullUpdate);
      this.puzzles.drawPuzzles();
    }, 1000 / fps);
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
    if (e.deltaY < 0) {
      this.puzzles.zoomIncrement(this.mouseX, this.mouseY);
    } else {
      this.puzzles.zoomDecrement(this.mouseX, this.mouseY);
    }
    this.zoomIsChanged = true;
  }

  render() {
    return <canvas
      ref={this.canvas}
      className="canvas"
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
    update: store.game.update,
    isSolved: store.game.isSolved,
  }
}

export default connect(mapStateToProps)(Game);