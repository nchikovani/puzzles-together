import React, {createRef, RefObject} from 'react';
import Puzzles from "./Puzzles/Puzzles";
import Part from './Puzzles/Part';
import {IGameData, IUpdate} from "shared";
import {IStore} from "../../store/store.types";
import SocketService from '../../service/socketService';
import './style.scss';
import {connect} from "react-redux";
import {fps, canvasProportions} from './Puzzles/puzzleConstants';

interface IGameProps {
  gameData: IGameData | null;
  update: IUpdate | null;
  isSolved: boolean;
  socketService: SocketService;
}

class Game extends React.Component<IGameProps, {}>{
  puzzles: Puzzles | null = null;
  canvasRef: RefObject<HTMLCanvasElement>;
  mouseX: number = 0;
  mouseY: number = 0;
  movablePart: Part | null = null;
  canvasIsMoving: boolean = false;
  movablePartXDiff: number = 0;
  movablePartYDiff: number = 0;
  startXMovingCanvas: number = 0;
  startYMovingCanvas: number = 0;
  oldUpdateFromServer: IUpdate | null = null;
  zoomIsChanged: boolean = false;
  ctx: CanvasRenderingContext2D | null = null;
  setIntervalId: number | null = null;

  constructor(props: IGameProps) {
    super(props);
    this.canvasRef = createRef();

    this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.finishMoves = this.finishMoves.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<IGameProps>) {
    const {gameData} = this.props;
    if (gameData && gameData !== prevProps.gameData) {
      let image = new Image();
      image.onload = () => {
        this.initGame(gameData, image);
      };
      image.src = gameData.image;
    }
    if (gameData === null && this.ctx) {
      console.log(gameData);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    if (this.props.isSolved !== prevProps.isSolved && this.props.isSolved) {
      this.puzzles && this.puzzles.parts && alert(`Ураа, ты собрал пазл из ${this.puzzles.parts.length} кусков. Так держать!`);
    }
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current && this.canvasRef.current.getContext("2d");
    if (!this.ctx) return;

    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetWidth / canvasProportions;
    this.canvasRef.current && this.canvasRef.current.addEventListener('wheel', this.mouseWheelHandler);
    window.addEventListener(`resize`, this.resizeHandler);
  }

  componentWillUnmount() {
    this.canvasRef.current && this.canvasRef.current.removeEventListener('wheel', this.mouseWheelHandler);
    window.removeEventListener(`resize`, this.resizeHandler);
  }

  initGame(gameData: IGameData, image: HTMLImageElement) {
    if (!this.ctx) return;
    this.puzzles = new Puzzles(gameData, this.ctx, image);

    this.puzzles.drawPuzzles();
    this.setIntervalId = window.setInterval(this.updateCanvas, 1000 / fps);
  }

  updateCanvas() {
    if (!this.puzzles) return;
    if (!this.canvasIsMoving && !this.movablePart && this.oldUpdateFromServer === this.props.update && !this.zoomIsChanged) return;
    const fullUpdate: IUpdate = {
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
  }

  resizeHandler() {
    if (!this.ctx) return;

    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetWidth / canvasProportions;
    this.puzzles && this.puzzles.updatePartsBuffers();
    this.puzzles && this.puzzles.drawPuzzles();
  }

  mouseDownHandler() {
    if (!this.puzzles || !this.canvasRef.current) return;
    const movablePart = this.puzzles.getPartInCoords(this.mouseX, this.mouseY);

    if (movablePart) {
      this.movablePart = movablePart;
      this.movablePartXDiff = this.mouseX - movablePart.x;
      this.movablePartYDiff = this.mouseY - movablePart.y;
    } else {
      this.canvasIsMoving = true;
      this.startXMovingCanvas = this.mouseX;
      this.startYMovingCanvas = this.mouseY;
      this.canvasRef.current.style.cursor = 'grab';
    }
  }

  mouseMoveHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvasElement = this.canvasRef.current;
    if (!canvasElement) return;
    this.mouseX = e.pageX - canvasElement.offsetLeft - canvasElement.clientLeft;
    this.mouseY = e.pageY - canvasElement.offsetTop - canvasElement.clientTop;

    if (!this.puzzles || this.canvasIsMoving) return;
    const isOverPart = !!this.puzzles.getPartInCoords(this.mouseX, this.mouseY);
    canvasElement.style.cursor = isOverPart ? 'pointer' : 'default';
  }

  mouseWheelHandler(e: WheelEvent) {
    if (!this.puzzles) return;
    e.preventDefault();

    if (e.deltaY < 0) {
      this.puzzles.zoomIncrement(this.mouseX, this.mouseY);
    } else {
      this.puzzles.zoomDecrement(this.mouseX, this.mouseY);
    }
    this.zoomIsChanged = true;
  }

  finishMoves() {
    this.movablePart = null;
    this.canvasIsMoving = false;
    if (this.canvasRef.current) this.canvasRef.current.style.cursor = 'default';
  }

  render() {
    return <canvas
      ref={this.canvasRef}
      className="canvas"
      onMouseDown={this.mouseDownHandler}
      onMouseMove={this.mouseMoveHandler}
      onMouseUp={this.finishMoves}
      onMouseOut={this.finishMoves}
    />;
  }

}

const mapStateToProps = (store: IStore) => {
  return {
    gameData: store.game.gameData,
    update: store.game.update,
    isSolved: store.game.isSolved,
  }
}

export default connect(mapStateToProps)(Game);