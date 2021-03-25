import Part from './Part';
import {PartTypes} from './Puzzles.types';

class Puzzles {
  parts: Part[];
  ctx: any;

  constructor(parts: PartTypes[], ctx: any, img: HTMLImageElement, partHeight: number, partWidth: number) {
    this.parts = parts.map(part => new Part(part, ctx, img, partHeight, partWidth));
    this.ctx = ctx;
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
}

export default Puzzles;