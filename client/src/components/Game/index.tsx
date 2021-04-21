import React, {createRef, RefObject} from 'react';
import Puzzles from "./Puzzles/Puzzles";
import Part from './Puzzles/Part';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {IGameData, IUpdate} from "shared";
import {IStore} from "../../store/store.types";
import SocketService from '../../service/socketService';
import './style.scss';
import {connect} from "react-redux";
import {fps, canvasProportions} from './Puzzles/puzzleConstants';
import {clearGame} from "../../store/actions";
import store from "../../store";

interface IGameProps {
  gameData: IGameData | null;
  update: IUpdate | null;
  isSolved: boolean;
  socketService: SocketService;
}

interface IGameState {
  sizeIsFull: boolean;
  imageIsShown: boolean;
}

class Game extends React.Component<IGameProps, IGameState>{
  puzzles: Puzzles | null = null;
  canvasRef: RefObject<HTMLCanvasElement>;
  puzzleImageRef: RefObject<HTMLImageElement>
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
    this.puzzleImageRef = createRef();

    this.state = {
      sizeIsFull: false,
      imageIsShown: false,
    };

    this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.finishMoves = this.finishMoves.bind(this);
    this.fullScreen = this.fullScreen.bind(this);
    this.outFullScreen = this.outFullScreen.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current && this.canvasRef.current.getContext("2d");
    if (!this.ctx) return;

    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetWidth / canvasProportions;
    this.canvasRef.current && this.canvasRef.current.addEventListener('wheel', this.mouseWheelHandler);
    window.addEventListener(`resize`, this.resizeHandler);
    this.props.gameData && this.initGame(this.props.gameData);
  }

  componentDidUpdate(prevProps: Readonly<IGameProps>) {
    const {gameData} = this.props;
    if (gameData && gameData !== prevProps.gameData) {
      this.initGame(gameData);
    }
    if (gameData === null && this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    if (this.props.isSolved !== prevProps.isSolved && this.props.isSolved) {
      this.puzzles && this.puzzles.parts && alert(`Ураа, ты собрал пазл из ${this.puzzles.parts.length} кусков. Так держать!`);
    }
  }

  componentWillUnmount() {
    this.canvasRef.current && this.canvasRef.current.removeEventListener('wheel', this.mouseWheelHandler);
    window.removeEventListener(`resize`, this.resizeHandler);
    if (this.setIntervalId) window.clearInterval(this.setIntervalId);
    store.dispatch(clearGame());
  }

  initGame(gameData: IGameData) {
    let image = new Image();
    image.onload = () => {
      if (!this.ctx) return;
      this.puzzles = new Puzzles(gameData, this.ctx, image);
      if (this.puzzleImageRef.current) {
        this.puzzleImageRef.current.src = image.src;
      }
      this.puzzles.drawPuzzles();
      if (this.setIntervalId) window.clearInterval(this.setIntervalId);
      this.setIntervalId = window.setInterval(this.updateCanvas, 1000 / fps);
    };
    image.src = gameData.image;
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
    if (this.state.sizeIsFull) this.canvasResizeFullScreen();
    this.canvasResize();
  }

  canvasResize() {
    if (!this.ctx) return;
    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetWidth / canvasProportions;
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
    this.mouseX = e.pageX - canvasElement.getBoundingClientRect().left - window.pageXOffset;
    this.mouseY = e.pageY - canvasElement.getBoundingClientRect().top - window.pageYOffset;
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

  canvasResizeFullScreen() {
    if (!this.ctx) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (windowWidth > windowHeight * canvasProportions) {
      this.ctx.canvas.style.width = windowHeight * canvasProportions + 'px';
      this.ctx.canvas.style.height = windowHeight + 'px';
    } else {
      this.ctx.canvas.style.width = windowWidth + 'px';
      this.ctx.canvas.style.height = windowWidth / canvasProportions + 'px';
    }
  }

  fullScreen() {
    this.canvasResizeFullScreen();
    this.setState({
      sizeIsFull: true,
    }, () => {
      this.canvasResize();
    });
  }

  outFullScreen() {
    if (!this.ctx) return;
    this.ctx.canvas.style.width = '100%';
    this.ctx.canvas.style.height = 'auto';
    this.setState({
      sizeIsFull: false,
    }, () => {
      this.canvasResize();
    });
  }

  render() {
    return (
      <div className="canvas-container">
        <div className={`${this.state.sizeIsFull ? 'canvas-container__fixed-wrap' : ''}`}>
          <canvas
            ref={this.canvasRef}
            className="canvas"
            onMouseDown={this.mouseDownHandler}
            onMouseMove={this.mouseMoveHandler}
            onMouseUp={this.finishMoves}
            onMouseOut={this.finishMoves}
          />
          <div className="canvas-container__button-group">
            <IconButton
              disableRipple
              disableFocusRipple
              disabled={!this.props.gameData}
              onClick={() => this.state.imageIsShown ? this.setState({imageIsShown: false}) : this.setState({imageIsShown: true})}
              size="small"
            >
              {
                this.state.imageIsShown ? <VisibilityOffIcon/> : <VisibilityIcon/>
              }
            </IconButton>
            <IconButton
              disableRipple
              disableFocusRipple
              disabled={!this.props.gameData}
              onClick={() => this.state.sizeIsFull ? this.outFullScreen() : this.fullScreen()}
              size="small"
            >
              {
                this.state.sizeIsFull ? <FullscreenExitIcon/> : <FullscreenIcon/>
              }
            </IconButton>
          </div>
          <img ref={this.puzzleImageRef} alt="puzzle-preview" className={`canvas-container__puzzle-image ${this.state.imageIsShown ? 'canvas-container__puzzle-image_active' : ''}`}/>
        </div>
      </div>
    );
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