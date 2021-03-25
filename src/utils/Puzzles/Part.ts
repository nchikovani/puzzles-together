import {PartTypes} from './Puzzles.types';

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
  topLinkType: string;
  leftLinkType: string;
  rightLinkType: string;
  bottomLinkType: string;

  constructor(part: PartTypes, ctx: any, img: HTMLImageElement, height: number, width: number) {

    this.id = part.id;
    this.x = part.x;
    this.y = part.y;
    this.xIndex = part.xIndex;
    this.yIndex = part.yIndex;
    this.topLinkType = part.topLinkType;
    this.leftLinkType = part.leftLinkType;
    this.rightLinkType = part.rightLinkType;
    this.bottomLinkType = part.bottomLinkType;

    this.ctx = ctx;
    this.img = img;
    this.height = height;
    this.width = width;
    this.fullHeight = height + ctx.lineWidth/2;
    this.fullWidth = width + ctx.lineWidth/2;

    this.protrusionWidth = 0.4;
    this.protrusionLength = 0.3;
    this.diffControlPointTop = 0.3;
    this.diffControlPointBottom = 0.35;
  }

  setCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  coordsIsInPart(xCoords: number, yCoords: number) {
    const {x, y, width, height} = this;
    return xCoords <= x + width
      && xCoords >= x
      && yCoords <= y + height
      && yCoords >= y;
  }

  drawPart() {
    const {ctx, height, width, x, y, img, xIndex, yIndex, protrusionWidth, protrusionLength, diffControlPointTop, diffControlPointBottom, bottomLinkType, topLinkType, rightLinkType, leftLinkType} = this;
    const lineWidth = ctx.lineWidth;
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
    ctx.drawImage(img, imgXDiff, imgYDiff, 450, 730);
    ctx.restore();

    function drawProtrusion(side: string) {
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