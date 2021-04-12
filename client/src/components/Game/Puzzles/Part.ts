import {IPart, ILink} from 'shared';
import Puzzles from "./Puzzles";
import {lineWidthProportion, diffControlPointBottom, diffControlPointTop, protrusionLength, protrusionWidth} from './puzzleConstants';


class Part {
  readonly id: string;
  private _x: number;
  private _y: number;
  readonly xIndex: number;
  readonly yIndex: number;
  readonly topLink: ILink | null;
  readonly leftLink: ILink | null;
  readonly rightLink: ILink | null;
  readonly bottomLink: ILink | null;
  readonly puzzles: Puzzles;
  private buffer: HTMLCanvasElement;

  constructor(part: IPart, puzzles: Puzzles) {
    this.id = part.id;
    this._x = part.x;
    this._y = part.y;

    this.xIndex = part.xIndex;
    this.yIndex = part.yIndex;
    this.topLink = part.topLink;
    this.leftLink = part.leftLink;
    this.rightLink = part.rightLink;
    this.bottomLink = part.bottomLink;

    this.puzzles = puzzles;

    this.updateBuffer();
  }

  get x() {
    return this._x * this.puzzles.ctx.canvas.width * this.puzzles.zoom + this.puzzles.xIndent;
  }

  get y() {
    return this._y * this.puzzles.ctx.canvas.width * this.puzzles.zoom + this.puzzles.yIndent;
  }

  set x(value) {
    this._x = (value - this.puzzles.xIndent) / (this.puzzles.zoom * this.puzzles.ctx.canvas.width);
  }

  set y(value) {
    this._y = (value - this.puzzles.yIndent) / (this.puzzles.zoom * this.puzzles.ctx.canvas.width);
  }

  get lineWidth() {
    return lineWidthProportion * this.puzzles.partWidth;
  }

  get fullHeight() {
    return this.puzzles.partHeight + this.lineWidth / 2;
  }

  get fullWidth() {
    return   this.puzzles.partWidth + this.lineWidth / 2;
  }

  get bufferIdentY() {
    return protrusionLength * this.puzzles.partHeight + this.lineWidth;
  }

  get bufferIdentX() {
    return protrusionLength * this.puzzles.partWidth + this.lineWidth;
  }

  setCoords(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  coordsIsInPart(xCoords: number, yCoords: number) {
    const {x, y, fullWidth, fullHeight} = this;
    return xCoords <= x + fullWidth
      && xCoords >= x
      && yCoords <= y + fullHeight
      && yCoords >= y;
  }

  drawPart() {
    const {x, y} = this;
    const imageWidth = this.puzzles.partWidth + 2 * this.bufferIdentX;
    const imageHeight = this.puzzles.partHeight + 2 * this.bufferIdentY;
    this.puzzles.ctx.drawImage(this.buffer, x - this.bufferIdentX, y - this.bufferIdentY, imageWidth, imageHeight);
  }

  updateBuffer() {
    const {xIndex, yIndex, bufferIdentX, bufferIdentY, lineWidth} = this;
    const height = this.puzzles.partHeight;
    const width = this.puzzles.partWidth;
    const bottomLinkType = this.bottomLink?.type;
    const topLinkType = this.topLink?.type;
    const rightLinkType = this.rightLink?.type;
    const leftLinkType = this.leftLink?.type;
    const x = bufferIdentX, y = bufferIdentY;

    this.buffer = document.createElement('canvas');
    this.buffer.width = width + 2 * bufferIdentX;
    this.buffer.height = height + 2 * bufferIdentY;

    const ctx = this.buffer.getContext('2d');
    if(!ctx) return;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "brawn";

    ctx.beginPath();
    ctx.moveTo(x, y);
    drawProtrusion('left');
    ctx.lineTo(x, y + height);
    drawProtrusion('bottom');
    ctx.lineTo(x+width, y+height);
    drawProtrusion('right');
    ctx.lineTo(x+width, y);
    drawProtrusion('top');
    ctx.closePath();

    ctx.stroke();
    ctx.clip();
    const imgXDiff = x - xIndex * width;
    const imgYDiff = y - yIndex * height;
    const rowCount = this.puzzles.height / this.puzzles.partHeight;
    const columnCount = this.puzzles.width / this.puzzles.partWidth;
    ctx.drawImage(
      this.puzzles.image,
      imgXDiff - lineWidth / 2,
      imgYDiff - lineWidth / 2,
      this.puzzles.width + (columnCount - xIndex) * lineWidth,
      this.puzzles.height + (rowCount - yIndex) * lineWidth
    );

    function drawProtrusion(side: string) {
      if (!ctx) return;
      switch (side) {
        case 'left': {
          const protrusionStartY: number =  (1 - protrusionWidth) / 2;
          switch (leftLinkType) {
            case 'convex':
              ctx.lineTo(x , y + height * protrusionStartY);
              ctx.bezierCurveTo(x,
                y + height * (protrusionStartY + diffControlPointBottom),
                x - width * protrusionLength,
                y + height * (0.5 - diffControlPointTop),
                x - width * protrusionLength,
                y + height * 0.5);
              ctx.bezierCurveTo(x - width * protrusionLength,
                y + height * (0.5 + diffControlPointTop),
                x,
                y + height * (protrusionStartY + protrusionWidth - diffControlPointBottom),
                x,
                y + height * (1 - protrusionStartY));
              break;
            case 'concave':
              ctx.lineTo(x , y + height * protrusionStartY - lineWidth);
              ctx.bezierCurveTo(x,
                y + height * (protrusionStartY + diffControlPointBottom),
                x + width * protrusionLength,
                y + height * (0.5 - diffControlPointTop) - lineWidth,
                x + width * protrusionLength,
                y + height * 0.5);
              ctx.bezierCurveTo(x + width * protrusionLength,
                y + height * (0.5 + diffControlPointTop) + lineWidth,
                x,
                y + height * (protrusionStartY + protrusionWidth - diffControlPointBottom),
                x,
                y + height * (1 - protrusionStartY) + lineWidth);
              break;
          }
          break;
        }
        case 'right': {
          const protrusionStartY: number =  (1 + protrusionWidth) / 2;
          switch (rightLinkType) {
            case 'convex':
              ctx.lineTo(x + width , y + height * protrusionStartY);
              ctx.bezierCurveTo(x + width,
                y + height * (protrusionStartY - diffControlPointBottom),
                x + width * (1 + protrusionLength),
                y + height * (0.5 + diffControlPointTop),
                x + width * (1 + protrusionLength),
                y + height * 0.5);
              ctx.bezierCurveTo(x + width * (1 + protrusionLength),
                y + height * (0.5 - diffControlPointTop),
                x + width,
                y + height * (protrusionStartY - protrusionWidth + diffControlPointBottom),
                x + width,
                y + height * (1 - protrusionStartY));
              break;
            case 'concave':
              ctx.lineTo(x + width , y + height * protrusionStartY + lineWidth);
              ctx.bezierCurveTo(x + width,
                y + height * (protrusionStartY - diffControlPointBottom),
                x + width * (1 - protrusionLength),
                y + height * (0.5 + diffControlPointTop) + lineWidth,
                x + width * (1 - protrusionLength),
                y + height * 0.5);
              ctx.bezierCurveTo(x + width * (1 - protrusionLength),
                y + height * (0.5 - diffControlPointTop) - lineWidth,
                x + width,
                y + height * (protrusionStartY - protrusionWidth + diffControlPointBottom),
                x + width,
                y + height * (1 - protrusionStartY) - lineWidth);
              break;
          }
          break;
        }
        case 'bottom': {
          const protrusionStartX: number =  (1 - protrusionWidth) / 2;
          switch (bottomLinkType) {
            case 'convex':
              ctx.lineTo(x + width * protrusionStartX, y + height);
              ctx.bezierCurveTo(x + width * (protrusionStartX + diffControlPointBottom),
                y + height,
                x + width * (0.5 - diffControlPointTop),
                y + height * (1 + protrusionLength),
                x + width * 0.5,
                y + height * (1 + protrusionLength));
              ctx.bezierCurveTo(x + width * (0.5 + diffControlPointTop),
                y + height * (1 + protrusionLength),
                x + width * (protrusionStartX + protrusionWidth - diffControlPointBottom),
                y + height,
                x + width * (protrusionStartX + protrusionWidth),
                y + height);
              break;
            case 'concave':
              ctx.lineTo(x + width * protrusionStartX - lineWidth, y + height);
              ctx.bezierCurveTo(x + width * (protrusionStartX + diffControlPointBottom),
                y + height,
                x + width * (0.5 - diffControlPointTop) - lineWidth,
                y +  height * (1 - protrusionLength),
                x + width * 0.5,
                y + height * (1 - protrusionLength));
              ctx.bezierCurveTo(x + width * (0.5 + diffControlPointTop) + lineWidth,
                y + height * (1 - protrusionLength),
                x + width * (protrusionStartX + protrusionWidth - diffControlPointBottom),
                y + height,
                x + width * (protrusionStartX + protrusionWidth) + lineWidth,
                y + height);
              break;
          }
          break;
        }
        case 'top': {
          const protrusionStartX: number =  (1 + protrusionWidth) / 2;
          switch (topLinkType) {
            case 'convex':
              ctx.lineTo(x + width * protrusionStartX, y);
              ctx.bezierCurveTo(x + width * (protrusionStartX - diffControlPointBottom),
                y,
                x + width * (0.5 + diffControlPointTop),
                y - height * protrusionLength,
                x + width * 0.5,
                y - height * protrusionLength);
              ctx.bezierCurveTo(x + width * (0.5 - diffControlPointTop),
                y - height * protrusionLength,
                x + width * (protrusionStartX - protrusionWidth + diffControlPointBottom),
                y,
                x + width * (protrusionStartX - protrusionWidth),
                y);
              break;
            case 'concave':
              ctx.lineTo(x + width * protrusionStartX + lineWidth, y);
              ctx.bezierCurveTo(x + width * (protrusionStartX - diffControlPointBottom),
                y,
                x + width * (0.5 + diffControlPointTop) + lineWidth,
                y + height * protrusionLength,
                x + width * 0.5,
                y + height * protrusionLength);
              ctx.bezierCurveTo(x + width * (0.5 - diffControlPointTop) - lineWidth,
                y + height * protrusionLength,
                x + width * (protrusionStartX - protrusionWidth + diffControlPointBottom),
                y,
                x + width * (protrusionStartX - protrusionWidth) - lineWidth,
                y);
              break;
          }
          break;
        }
      }
    }
  }
}

export default Part;