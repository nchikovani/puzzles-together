import Part from './Part';
import {PartTypes} from './Puzzles.types';
const audio_knock = [new Audio('audio_knock1.mp3'), new Audio('audio_knock2.mp3'), new Audio('audio_knock3.mp3')];
let knockNumber = 0
const playKnock = () => {
  audio_knock[knockNumber % 3].play();
  knockNumber++;
}

class Puzzles {
  parts: Part[];
  ctx: any;
  columnsCount: number;
  rowsCount: number;
  partHeight: number;
  partWidth: number;

  constructor(parts: PartTypes[], ctx: any, img: HTMLImageElement, partHeight: number, partWidth: number, columnsCount: number, rowsCount: number) {
    this.parts = parts.map(part => new Part(part, ctx, img, partHeight, partWidth));
    this.ctx = ctx;
    this.columnsCount = columnsCount;
    this.rowsCount = rowsCount;
    this.partHeight = partHeight;
    this.partWidth = partWidth;
  }

  drawPuzzles() {
    const {ctx} = this;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.parts.forEach(part => {
      ctx.save();
      part.drawPart();
    })
    ctx.save();
  }

  getPartInCoords(x: number, y: number) {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      if (this.parts[i].coordsIsInPart(x, y)) {
        return this.parts[i];
      }
    }
  }

  solvePuzzles() {
    this.parts.forEach(part => {
      const xCoords = this.ctx.lineWidth + part.xIndex * part.fullWidth;
      const yCoords = this.ctx.lineWidth + part.yIndex * part.fullWidth;
      part.setCoords(xCoords, yCoords);
    });
    this.drawPuzzles();
  }

  movePart(partId: string, x: number, y: number) {
    const movablePart = this.parts.find(part => part.id === partId);
    if (!movablePart) return;


    const allMovablesParts: Part[] = [];
    this.moveNeighbours(movablePart, allMovablesParts, x, y);
    console.log(allMovablesParts);
    this.parts = this.parts.filter(part => !allMovablesParts.find(movablePart => movablePart.id === part.id));
    this.parts = this.parts.concat(allMovablesParts);
    this.drawPuzzles();
  }

  moveNeighbours(movablePart: Part, allMovablesParts: Part[], x: number, y: number) {
    movablePart.setCoords(x, y);
    allMovablesParts.push(movablePart);
    const topPartId = movablePart.topLink?.id;
    const bottomPartId = movablePart.bottomLink?.id;
    const rightPartId = movablePart.rightLink?.id;
    const leftPartId = movablePart.leftLink?.id;

    if (movablePart.topLink?.connected) {
      const topPart = topPartId && this.parts.find(part => part.id === topPartId);
      if (topPart && !allMovablesParts.includes(topPart)) {
        this.moveNeighbours(topPart, allMovablesParts, x, y - this.partHeight);
      }
    }

    if (movablePart.bottomLink?.connected) {
      const bottomPart = bottomPartId && this.parts.find(part => part.id === bottomPartId);
      if (bottomPart && !allMovablesParts.includes(bottomPart)) {
        this.moveNeighbours(bottomPart, allMovablesParts, x, y + this.partHeight);
      }
    }

    if (movablePart.rightLink?.connected) {
      const rightPart = rightPartId && this.parts.find(part => part.id === rightPartId);
      if (rightPart && !allMovablesParts.includes(rightPart)) {
        this.moveNeighbours(rightPart, allMovablesParts, x + this.partWidth, y);
      }
    }

    if (movablePart.leftLink?.connected) {
      const leftPart = leftPartId && this.parts.find(part => part.id === leftPartId);
      if (leftPart && !allMovablesParts.includes(leftPart)) {
        this.moveNeighbours(leftPart, allMovablesParts, x - this.partWidth, y);
      }
    }
  }

  //on server
  connectParts(movablePart: Part, x: number, y: number) {
    const connectionDistance = 4;
    const topPartId = movablePart.topLink?.id;
    const bottomPartId = movablePart.bottomLink?.id;
    const rightPartId = movablePart.rightLink?.id;
    const leftPartId = movablePart.leftLink?.id;

    const topPart = topPartId && this.parts.find(part => part.id === topPartId);
    const bottomPart = bottomPartId && this.parts.find(part => part.id === bottomPartId);
    const rightPart = rightPartId && this.parts.find(part => part.id === rightPartId);
    const leftPart = leftPartId && this.parts.find(part => part.id === leftPartId);

    if (movablePart.topLink?.connected === false && topPart && Math.abs(topPart.x - x) <= connectionDistance && Math.abs(topPart.y + this.partHeight - y) <= connectionDistance) {
      if (movablePart.topLink) movablePart.topLink.connected = true;
      if (topPart.bottomLink) topPart.bottomLink.connected = true;
      console.log('aaa');
      playKnock();
    }

    if (movablePart.bottomLink?.connected === false && bottomPart && Math.abs(bottomPart.x - x) <= connectionDistance && Math.abs(bottomPart.y - this.partHeight - y) <= connectionDistance) {
      if (movablePart.bottomLink) movablePart.bottomLink.connected = true;
      if (bottomPart.topLink) bottomPart.topLink.connected = true;
      console.log('aaa1');
      playKnock();
    }

    if (movablePart.rightLink?.connected === false && rightPart && Math.abs(rightPart.x - this.partWidth - x) <= connectionDistance && Math.abs(rightPart.y - y) <= connectionDistance) {
      if (movablePart.rightLink) movablePart.rightLink.connected = true;
      if (rightPart.leftLink) rightPart.leftLink.connected = true;
      console.log('ooo');
      playKnock();
    }

    if (movablePart.leftLink?.connected === false && leftPart && Math.abs(leftPart.x + this.partWidth - x) <= connectionDistance && Math.abs(leftPart.y - y) <= connectionDistance) {
      if (movablePart.leftLink) movablePart.leftLink.connected = true;
      if (leftPart.rightLink) leftPart.rightLink.connected = true;
      console.log('ooo1');
      playKnock();
    }
  }
}

export default Puzzles;