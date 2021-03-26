import React, {createRef, Ref} from 'react';
import Puzzles from "../../utils/Puzzles/Puzzles";
import Part from '../../utils/Puzzles/Part';
import {PartTypes, UpdateType} from "../../utils/Puzzles/Puzzles.types";
import './style.scss';

interface GamePropsTypes {

  puzzles: {
    image: string;
    partWidth: number;
    partHeight: number;
    parts: PartTypes[];
  }
  sendUpdate: (update: UpdateType) => void;
  handleGettingUpdate: (handler: (update: UpdateType) => void) => void
}
class Game extends React.Component<GamePropsTypes, any>{
  puzzles: Puzzles;
  canvas: Ref<HTMLCanvasElement>;
  mouseX: number;
  mouseY: number;
  movablePart?: Part | null;
  movablePartXDiff: number;
  movablePartYDiff: number;
  update: UpdateType;

  constructor(props: GamePropsTypes) {
    super(props);
    this.canvas = createRef();
  }

  componentDidUpdate() {
    if (this.props.puzzles) {
      let image = new Image();
      image.onload = () => {
        // if (!this.canvas || !this.canvas.current) return;
        // @ts-ignore
        let ctx = this.canvas.current.getContext("2d");
        ctx.canvas.width = 900;
        ctx.canvas.height = 700;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "brawn";

        this.puzzles = new Puzzles(this.props.puzzles.parts, ctx, image, this.props.puzzles.partHeight, this.props.puzzles.partWidth, 3, 3);
        this.props.handleGettingUpdate((update) => {
          this.puzzles.setUpdate(update);
          this.puzzles.drawPuzzles();
        });
        this.puzzles.drawPuzzles();
        let update: UpdateType;
        setInterval(() => {
          if (!this.update || this.update === update) return;
          update = this.update;
          this.puzzles.setUpdate(this.update);
          this.props.sendUpdate(this.update);
          this.puzzles.drawPuzzles();
        }, 33)
      };
      image.src = this.props.puzzles.image;
    }
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

  mouseUpHandler() {
    this.movablePart = null;
  }

  mouseMoveHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    // @ts-ignore
    const canvasElement = this.canvas.current;
    this.mouseX = e.pageX - canvasElement.offsetLeft - canvasElement.clientLeft;
    this.mouseY = e.pageY - canvasElement.offsetTop - canvasElement.clientTop;

    if (!this.puzzles) return;
    const isOverPart = !!this.puzzles.getPartInCoords(this.mouseX, this.mouseY);
    canvasElement.style.cursor = isOverPart ? 'pointer' : 'default';
    if (this.movablePart) {
      this.update = this.puzzles.getUpdate(this.movablePart, this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff);

    }
  }

  render() {
    return <canvas
      ref={this.canvas}
      className="game"
      onMouseDown={()=>this.mouseDownHandler()}
      onMouseUp={()=>this.mouseUpHandler()}
      onMouseMove={(e)=>this.mouseMoveHandler(e)}
      onMouseOut={() => this.movablePart = null}
    />;
  }


}

export default Game;