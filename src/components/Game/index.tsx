import React, {createRef, Ref} from 'react';
import Puzzles from "../../utils/Puzzles/Puzzles";
import Part from '../../utils/Puzzles/Part';
import {PartTypes, UpdateType} from "../../utils/Puzzles/Puzzles.types";
import './style.scss';

interface GamePropsTypes {

  puzzles: {
    image: string;
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

        this.puzzles = new Puzzles(this.props.puzzles.parts, ctx, image, 150, 150, 3, 3);
        this.props.handleGettingUpdate((update) => {
          this.puzzles.setUpdate(update);
          this.puzzles.drawPuzzles();
        });
        this.puzzles.drawPuzzles();
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
      const update = this.puzzles.getUpdate(this.movablePart, this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff);
      this.puzzles.setUpdate(update);
      this.props.sendUpdate(update);
      this.puzzles.drawPuzzles();
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