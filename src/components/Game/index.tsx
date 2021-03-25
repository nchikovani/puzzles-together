import React, {createRef, Ref} from 'react';
import Puzzles from "../../utils/Puzzles/Puzzles";
import Part from '../../utils/Puzzles/Part';
import './style.scss';

const partsTest = [{
  id: '1',
  xIndex: 0,
  yIndex: 0,
  x: 621,
  y: 310,
  topLink: null,
  leftLink: null,
  rightLink: {
    type: 'concave',
    connected: false,
    id: '4',
  },
  bottomLink: {
    type: 'concave',
    connected: false,
    id: '2',
  }
}, {
  id: '2',
  xIndex: 0,
  yIndex: 1,
  x: 200,
  y: 200,
  topLink: {
    type: 'convex',
    connected: false,
    id: '1',
  },
  leftLink: null,
  rightLink: {
    type: 'convex',
    connected: false,
    id: '5',
  },
  bottomLink: {
    type: 'convex',
    connected: false,
    id: '3',
  }
}, {
  id: '3',
  xIndex: 0,
  yIndex: 2,
  x: 300,
  y: 300,
  topLink: {
    type: 'concave',
    connected: false,
    id: '2',
  },
  leftLink: null,
  rightLink: {
    type: 'convex',
    connected: false,
    id: '6',
  },
  bottomLink: null
}, {
  id: '4',
  xIndex: 1,
  yIndex: 0,
  x: 700,
  y: 500,
  topLink: null,
  leftLink: {
    type: 'convex',
    connected: false,
    id: '1',
  },
  rightLink: {
    type: 'convex',
    connected: false,
    id: '7',
  },
  bottomLink: {
    type: 'convex',
    connected: false,
    id: '5',
  }
}, {
  id: '5',
  xIndex: 1,
  yIndex: 1,
  x: 544,
  y: 287,
  topLink: {
    type: 'concave',
    connected: false,
    id: '4',
  },
  leftLink: {
    type: 'concave',
    connected: false,
    id: '2',
  },
  rightLink: {
    type: 'convex',
    connected: false,
    id: '8',
  },
  bottomLink: {
    type: 'concave',
    connected: false,
    id: '6',
  }
}, {
  id: '6',
  xIndex: 1,
  yIndex: 2,
  x: 10,
  y: 5,
  topLink: {
    type: 'convex',
    connected: false,
    id: '5',
  },
  leftLink: {
    type: 'concave',
    connected: false,
    id: '3',
  },
  rightLink: {
    type: 'concave',
    connected: false,
    id: '9',
  },
  bottomLink: null
},{
  id: '7',
  xIndex: 2,
  yIndex: 0,
  x: 50,
  y: 520,
  topLink: null,
  leftLink: {
    type: 'concave',
    connected: false,
    id: '4',
  },
  rightLink: null,
  bottomLink: {
    type: 'convex',
    connected: false,
    id: '8',
  },
}, {
  id: '8',
  xIndex: 2,
  yIndex: 1,
  x: 482,
  y: 10,
  topLink: {
    type: 'concave',
    connected: false,
    id: '7',
  },
  leftLink: {
    type: 'concave',
    connected: false,
    id: '5',
  },
  rightLink: null,
  bottomLink: {
    type: 'convex',
    connected: false,
    id: '9',
  },
}, {
  id: '9',
  xIndex: 2,
  yIndex: 2,
  x: 100,
  y: 398,
  topLink: {
    type: 'concave',
    connected: false,
    id: '8',
  },
  leftLink: {
    type: 'convex',
    connected: false,
    id: '6',
  },
  rightLink: null,
  bottomLink: null
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
      //на сервер отправляется Id пазла с новыми координатами
      this.puzzles.movePart(this.movablePart.id, this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff);
      this.puzzles.connectParts(this.movablePart, this.mouseX - this.movablePartXDiff, this.mouseY - this.movablePartYDiff);
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