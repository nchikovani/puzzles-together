import {PartTypes} from './Puzzles.types';

class Part {
  part: PartTypes;
  ctx: any;
  img: HTMLImageElement;
  height: number;
  width: number;
  x: number;
  y: number;
  xIndex: number;
  yIndex: number;
  constructor(part: PartTypes, ctx: any, img: HTMLImageElement, height: number, width: number) {
    this.part = part;
    this.ctx = ctx;
    this.img = img;
    this.height = height;
    this.width = width;
    this.x = part.x;
    this.y = part.y;
    this.xIndex = part.xIndex;
    this.yIndex = part.yIndex;
  }

  setCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  drawPart() {
    const {ctx, height, width, x, y, img, xIndex, yIndex} = this;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+width);
    ctx.lineTo(x+width*0.3, y+height);
    ctx.bezierCurveTo(x+width*0.65,y+height,x+width*0.2,y+height*1.3,x+width*0.5,y+height*1.3);
    ctx.bezierCurveTo(x+width*0.8,y+height*1.3,x+width*0.35,y+height,x+width*0.7,y+height);
    ctx.lineTo(x+width, y+height);
    ctx.lineTo(x+width, y+height*0.7);
    ctx.bezierCurveTo(x+width,y+height*0.35,x+width*1.3,y+height*0.8,x+width*1.3,y+height*0.5);
    ctx.bezierCurveTo(x+width*1.3,y+height*0.2,x+width,y+height*0.65,x+width,y+height*0.3);
    ctx.lineTo(x+height, y);
    ctx.closePath();
    ctx.stroke();
    ctx.clip();
    const imgXDiff = x - xIndex * width;
    const imgYDiff = y - yIndex * height;
    ctx.drawImage(img, imgXDiff, imgYDiff);
    ctx.restore();
  }

  coordsInPart(xCoords: number, yCoords: number) {
    const {x, y, width, height} = this;
    return xCoords <= x + width
      && xCoords >= x
      && yCoords <= y + height
      && yCoords >= y;
  }
}

export default Part;