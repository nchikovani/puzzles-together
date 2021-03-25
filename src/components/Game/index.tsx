import React, {createRef, Ref} from 'react';
import Puzzles from "../../utils/Puzzles/Puzzles";
import Part from '../../utils/Puzzles/Part';
import './style.scss';

const partsTest = [{
  id: '1',
  xIndex: 0,
  yIndex: 0,
  x: 0,
  y: 0,
  topLinkType: 'flat',
  leftLinkType: 'flat',
  rightLinkType: 'concave',
  bottomLinkType: 'concave',
}, {
  id: '2',
  xIndex: 0,
  yIndex: 1,
  x: 200,
  y: 200,
  topLinkType: 'convex',
  leftLinkType: 'flat',
  rightLinkType: 'convex',
  bottomLinkType: 'convex',
}, {
  id: '3',
  xIndex: 0,
  yIndex: 2,
  x: 300,
  y: 300,
  topLinkType: 'concave',
  leftLinkType: 'flat',
  rightLinkType: 'convex',
  bottomLinkType: 'flat',
}, {
  id: '4',
  xIndex: 1,
  yIndex: 0,
  x: 100,
  y: 170,
  topLinkType: 'flat',
  leftLinkType: 'convex',
  rightLinkType: 'convex',
  bottomLinkType: 'concave',
}, {
  id: '5',
  xIndex: 1,
  yIndex: 1,
  x: 100,
  y: 400,
  topLinkType: 'convex',
  leftLinkType: 'concave',
  rightLinkType: 'convex',
  bottomLinkType: 'concave',
}, {
  id: '6',
  xIndex: 1,
  yIndex: 2,
  x: 500,
  y: 300,
  topLinkType: 'convex',
  leftLinkType: 'concave',
  rightLinkType: 'convex',
  bottomLinkType: 'flat',
}, {
  id: '7',
  xIndex: 2,
  yIndex: 0,
  x: 700,
  y: 400,
  topLinkType: 'flat',
  leftLinkType: 'concave',
  rightLinkType: 'flat',
  bottomLinkType: 'concave',
}, {
  id: '8',
  xIndex: 2,
  yIndex: 1,
  x: 200,
  y: 200,
  topLinkType: 'convex',
  leftLinkType: 'concave',
  rightLinkType: 'flat',
  bottomLinkType: 'concave',
}, {
  id: '9',
  xIndex: 2,
  yIndex: 2,
  x: 220,
  y: 420,
  topLinkType: 'convex',
  leftLinkType: 'concave',
  rightLinkType: 'flat',
  bottomLinkType: 'flat',
}];

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
      ctx.lineWidth = 2;
      ctx.strokeStyle = "brawn";
      this.puzzles = new Puzzles(partsTest, ctx, image, 150, 150, 3, 3);
      this.puzzles.drawPuzzles();
    };
    image.src = this.props.img;
  }

  mouseDownHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!this.puzzles) return;
    const movablePart = this.puzzles.getPartInCoords(this.mouseX, this.mouseY);

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
    const isOverPart = !!this.puzzles.getPartInCoords(this.mouseX, this.mouseY);
    canvasElement.style.cursor = isOverPart ? 'pointer' : 'default';
    if (this.movablePart) {
      this.puzzles.movePart(this.movablePart.id, this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff)
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