import {PartTypes, LinkTypes} from './Puzzles.types';

class Part {
  id: string;
  ctx: any;
  img: HTMLImageElement;
  height: number;
  width: number;
  fullHeight: number;
  fullWidth: number;
  x: number;
  y: number;
  xIndex: number;
  yIndex: number;
  protrusionWidth: number;
  protrusionLength: number;
  diffControlPointTop: number;
  diffControlPointBottom: number;
  lineWidth: number;
  bufferIdent: number;
  topLink: LinkTypes | null;
  leftLink: LinkTypes | null;
  rightLink: LinkTypes | null;
  bottomLink: LinkTypes | null;
  buffer: any;

  constructor(part: PartTypes, ctx: any, img: HTMLImageElement, height: number, width: number) {

    this.id = part.id;
    this.x = part.x;
    this.y = part.y;

    this.xIndex = part.xIndex;
    this.yIndex = part.yIndex;
    this.topLink = part.topLink;
    this.leftLink = part.leftLink;
    this.rightLink = part.rightLink;
    this.bottomLink = part.bottomLink;

    this.ctx = ctx;
    this.img = img;
    this.height = height;
    this.width = width;

    this.protrusionWidth = 0.4;
    this.protrusionLength = 0.3;
    this.diffControlPointTop = 0.3;
    this.diffControlPointBottom = 0.35;
    this.lineWidth = 2;

    this.fullHeight = height + this.lineWidth / 2;
    this.fullWidth = width + this.lineWidth / 2;

    this.bufferIdent = this.protrusionLength * height + this.lineWidth;

    this.updateBuffer();

  }

  setCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  coordsIsInPart(xCoords: number, yCoords: number) {
    const {x, y, fullWidth, fullHeight} = this;
    return xCoords <= x + fullWidth
      && xCoords >= x
      && yCoords <= y + fullHeight
      && yCoords >= y;
  }

  drawPart() {
    const {ctx, x, y} = this;
    ctx.drawImage(this.buffer, x - this.bufferIdent, y - this.bufferIdent);
  }

  updateBuffer() {
    const {height, width, xIndex, yIndex, protrusionWidth, protrusionLength, diffControlPointTop, diffControlPointBottom, lineWidth, bufferIdent} = this;
    const bottomLinkType = this.bottomLink?.type;
    const topLinkType = this.topLink?.type;
    const rightLinkType = this.rightLink?.type;
    const leftLinkType = this.leftLink?.type;
    const x = bufferIdent, y = bufferIdent;

    this.buffer = document.createElement('canvas');
    this.buffer.width = width + 2 * bufferIdent;
    this.buffer.height = height + 2 * bufferIdent;

    const ctx = this.buffer.getContext('2d');
    if(!ctx) return;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "brawn";

    ctx.beginPath();
    ctx.moveTo(x, y);
    drawProtrusion('left');
    ctx.lineTo(x, y + width);
    drawProtrusion('bottom');
    ctx.lineTo(x+width, y+height);
    drawProtrusion('right');
    ctx.lineTo(x+height, y);
    drawProtrusion('top');
    ctx.closePath();

    ctx.stroke();
    ctx.clip();
    const imgXDiff = x - xIndex * width;
    const imgYDiff = y - yIndex * height;
    ctx.drawImage(this.img, imgXDiff, imgYDiff);

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