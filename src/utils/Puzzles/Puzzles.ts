import Part from './Part';
import {PartTypes} from './Puzzles.types';

class Puzzles {
  parts: Part[];
  ctx: any;
  columnsCount: number;
  rowsCount: number;

  constructor(parts: PartTypes[], ctx: any, img: HTMLImageElement, partHeight: number, partWidth: number, columnsCount: number, rowsCount: number) {
    this.parts = parts.map(part => new Part(part, ctx, img, partHeight, partWidth));
    this.ctx = ctx;
    this.columnsCount = columnsCount;
    this.rowsCount = rowsCount;
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
      const xCoords = this.ctx.lineWidth + part.xIndex * part.fullWidth
      const yCoords = this.ctx.lineWidth + part.yIndex * part.fullWidth
      part.setCoords(xCoords, yCoords);
    });
    this.drawPuzzles();
  }

  movePart(partId: string, x: number, y: number) {
    const movablePart = this.parts.find(part => part.id === partId);
    if (!movablePart) return;
    movablePart.setCoords(x, y);

    this.parts = this.parts.filter(part => part.id !== partId);
    this.parts.push(movablePart);
    this.drawPuzzles();
  }
}

export default Puzzles;