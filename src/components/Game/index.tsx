import React, {createRef, Ref} from 'react';
import Puzzles from "../../utils/Puzzles/Puzzles";
import Part from '../../utils/Puzzles/Part';
import './style.scss';

const partsTest = [{
  id: '1',
  xIndex: 0,
  yIndex: 0,
  x: 155,
  y: 256,
  top: null,
  left: null,
  right: {
    type: 'convex',
    partId: ''
  },
  bottom: {
    type: 'concave',
    partId: ''
  }
}, {id: '2', xIndex: 1, yIndex: 2, x: 200, y: 100}];

interface GamePropsTypes {
  img: string;
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
    let image = new Image();
    image.onload = () => {
      // if (!this.canvas || !this.canvas.current) return;
      // @ts-ignore
      let ctx = this.canvas.current.getContext("2d");
      ctx.canvas.width = 900;
      ctx.canvas.height = 700;
      ctx.lineWidth=2;
      ctx.strokeStyle = "brawn";
      this.puzzles = new Puzzles(partsTest, ctx, image, 70, 70);
      this.puzzles.drawPuzzles();
    };
    image.src = this.props.img;
  }

  mouseDownHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!this.puzzles) return;
    const movablePart = this.puzzles.parts.find(part => {
      return part.coordsInPart(this.mouseX, this.mouseY);
    });

    if (movablePart) {
      this.movablePart = movablePart;
      this.movablePartXDiff = this.mouseX - movablePart.x;
      this.movablePartYDiff = this.mouseY - movablePart.y;
    }
  }

  mouseUpHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    this.movablePart = null;
  }

  mouseMoveHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    // @ts-ignore
    const canvasElement = this.canvas.current;
    this.mouseX = e.pageX - canvasElement.offsetLeft - canvasElement.clientLeft;
    this.mouseY = e.pageY - canvasElement.offsetTop - canvasElement.clientTop;

    if (!this.puzzles) return;
    const activePart = this.puzzles.parts.find(part => {
      return part.coordsInPart(this.mouseX, this.mouseY);
    });
    canvasElement.style.cursor = activePart ? 'pointer' : 'default';
    if (this.movablePart) {
      console.log();
      this.movablePart.setCoords(this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff);
      this.puzzles.drawPuzzles();
    }
  }

  render() {
    return <canvas
      ref={this.canvas}
      className="game"
      onMouseDown={(e)=>this.mouseDownHandler(e)}
      onMouseUp={(e)=>this.mouseUpHandler(e)}
      onMouseMove={(e)=>this.mouseMoveHandler(e)}
      onMouseOut={() => this.movablePart = null}
    />;
  }


}

export default Game;