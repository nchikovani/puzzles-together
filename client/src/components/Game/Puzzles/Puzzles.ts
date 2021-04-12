import Part from './Part';
import {IMove, IConnection, IUpdate, IGameData} from 'shared';
import {playKnock} from '../utils';
import {maxZoom, connectionDistance, zoomDifferenceBuffersUpdating} from './puzzleConstants';

class Puzzles {
  readonly parts: Part[];
  readonly ctx: CanvasRenderingContext2D;
  readonly _partHeight: number;
  readonly _partWidth: number;
  readonly _height: number;
  readonly _width: number;
  readonly image: HTMLImageElement;
  private _xIndent: number = 0;
  private _yIndent: number = 0;
  private _zoom: number = 1;
  private latestUpdateBuffersZoom: number = 1;

  constructor(gameData: IGameData, ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    this.ctx = ctx;
    this.image = img;
    this._partHeight = gameData.partHeight;
    this._partWidth = gameData.partWidth;
    this._width = gameData.width;
    this._height = gameData.height;
    this.parts = gameData.parts.map(part => new Part(part, this));
  }

  get partWidth() {
    return this._partWidth * this._zoom * this.ctx.canvas.width;
  }

  get partHeight() {
    return this._partHeight * this._zoom * this.ctx.canvas.width;
  }

  get width() {
    return this._width * this._zoom * this.ctx.canvas.width;
  }

  get height() {
    return this._height * this._zoom * this.ctx.canvas.width;
  }

  get xIndent() {
    return this._xIndent;
  }

  get yIndent() {
    return this._yIndent;
  }

  get zoom() {
    return this._zoom;
  }

  zoomIncrement(mouseX: number, mouseY: number) {
    if (this._zoom >= maxZoom) return;
    const newZoom = this._zoom * 1.1 > maxZoom ? maxZoom : this._zoom * 1.1;
    this._xIndent -= (mouseX - this._xIndent) * (newZoom - this._zoom) / this._zoom;
    this._yIndent -= (mouseY - this._yIndent) * (newZoom - this._zoom) / this._zoom;
    this._zoom = newZoom;
  }

  zoomDecrement(mouseX: number, mouseY: number) {
    if (this._zoom <= 1) return;
    const newZoom = this._zoom / 1.1 < 1 ? 1 : this._zoom / 1.1;
    this._xIndent += (mouseX - this._xIndent) * (this._zoom - newZoom) / this._zoom;
    this._yIndent += (mouseY - this._yIndent) * (this._zoom - newZoom) / this._zoom;
    if (this._xIndent > 0) this._xIndent = 0;
    if (this._yIndent > 0) this._yIndent = 0;

    this._zoom = newZoom < 1 ? 1 : newZoom;
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    if ((canvasWidth - this._xIndent) / this._zoom > canvasWidth) {
      this._xIndent = canvasWidth - canvasWidth * this._zoom;
    }
    if ((canvasHeight - this._yIndent) / this._zoom > canvasHeight) {
      this._yIndent = canvasHeight - canvasHeight * this._zoom;
    }
  }

  incrementIndent (xIncrement: number, yIncrement: number) {
    const newXIndent = this._xIndent + xIncrement;
    const newYIndent = this._yIndent + yIncrement;

    const xMin = -this.ctx.canvas.width * (this._zoom - 1);
    const yMin = -this.ctx.canvas.height * (this._zoom - 1);
    const xMax = 0;
    const yMax = 0;

    if (newXIndent > xMax) {
      this._xIndent = xMax;
    } else if (newXIndent < xMin){
      this._xIndent = xMin
    } else {
      this._xIndent = newXIndent;
    }

    if (newYIndent > yMax) {
      this._yIndent = yMax;
    } else if (newYIndent < yMin){
      this._yIndent = yMin
    } else {
      this._yIndent = newYIndent;
    }
  }

  updatePartsBuffers() {
    this.parts.forEach(part => part.updateBuffer());
  }

  drawPuzzles() {
    const {ctx} = this;
    if (this.latestUpdateBuffersZoom / this._zoom  > zoomDifferenceBuffersUpdating || (this._zoom === 1 && this.latestUpdateBuffersZoom !== 1) ||
      this._zoom / this.latestUpdateBuffersZoom > zoomDifferenceBuffersUpdating || (this._zoom === maxZoom && this.latestUpdateBuffersZoom !== maxZoom)) {
      this.updatePartsBuffers();
      this.latestUpdateBuffersZoom = this._zoom;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.parts.forEach(part => {
      part.drawPart();
    })
  }

  getPartInCoords(x: number, y: number) {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      if (this.parts[i].coordsIsInPart(x, y)) {
        return this.parts[i];
      }
    }
  }

  getPartById(id: string) {
    return this.parts.find(part => part.id === id);
  }

  setUpdate(update: IUpdate) {
    const {moves, connections} = update;
    const movedParts: Part[] = [];

    moves.forEach((move) => {
      const targetPart = this.getPartById(move.id);
      if (targetPart) {
        targetPart.setCoords(move.x, move.y);
        movedParts.push(targetPart);
      }
    });
    this.parts.sort((part1, part2) => {
      if (!movedParts.includes(part1) && movedParts.includes(part2)) {
        return -1;
      }
      if (movedParts.includes(part1) && !movedParts.includes(part2)) {
        return 1;
      }
      return 0;
    });
    // this.parts = this.parts.filter(part => {
    //   return !movedParts.includes(part);
    // })
    // this.parts = this.parts.concat(movedParts);

    const connect = (connection: IConnection) => {
      const part = this.getPartById(connection.id);

      const link = part && part[connection.link];
      if (link) link.connected = true;
    };

    connections.forEach((connection) => {
      connect(connection[0]);
      connect(connection[1]);
    });
    if (connections.length > 0) playKnock();
  }

  getUpdate(movablePart: Part, x: number, y: number) {
    const moves: IMove[] = [];
    let connections: IConnection[][] = [];
    let diffX = 0;
    let diffY = 0;
    let inCanvas = true;

    const getDiff = (newCoord: number, maxCoord: number, diff: number) => {
      let newDiff = 0;
      if (newCoord < 0) newDiff = newCoord;
      if (newCoord > maxCoord) newDiff = newCoord  - maxCoord;
      return (Math.abs(diff) < Math.abs(newDiff)) ? newDiff: diff;
    }

    const loop =(movablePart: Part, x: number, y: number) => {
      if (!inCanvas) return;
      const newX = (x - this._xIndent) / (this._zoom * this.ctx.canvas.width);
      const newY = (y - this._yIndent) / (this._zoom * this.ctx.canvas.width);

      diffX = getDiff(newX, this.ctx.canvas.width / this.ctx.canvas.width - this._partWidth, diffX);
      diffY = getDiff(newY, this.ctx.canvas.height / this.ctx.canvas.width - this._partHeight, diffY);

      moves.push({id: movablePart.id, x: newX, y: newY});
      const connection = this.getConnections(movablePart, x, y);
      connections = connections.concat(connection);
      const topPartId = movablePart.topLink?.id;
      const bottomPartId = movablePart.bottomLink?.id;
      const rightPartId = movablePart.rightLink?.id;
      const leftPartId = movablePart.leftLink?.id;

      if (movablePart.topLink?.connected) {
        const topPart = topPartId && this.getPartById(topPartId);
        if (topPart && !moves.find(move => move.id === topPart.id)) {
          loop(topPart, x, y - topPart.fullHeight);
        }
      }

      if (movablePart.bottomLink?.connected) {
        const bottomPart = bottomPartId && this.getPartById(bottomPartId);
        if (bottomPart && !moves.find(move => move.id === bottomPart.id)) {
          loop(bottomPart, x, y + bottomPart.fullHeight);
        }
      }

      if (movablePart.rightLink?.connected) {
        const rightPart = rightPartId && this.getPartById(rightPartId);
        if (rightPart && !moves.find(move => move.id === rightPart.id)) {
          loop(rightPart, x + rightPart.fullWidth, y);
        }
      }

      if (movablePart.leftLink?.connected) {
        const leftPart = leftPartId && this.getPartById(leftPartId);
        if (leftPart && !moves.find(move => move.id === leftPart.id)) {
          loop(leftPart, x - leftPart.fullWidth, y);
        }
      }
    }
    loop(movablePart, x, y);

    moves.forEach(move => {
      move.x -=diffX;
      move.y -=diffY;
    });

    return inCanvas ? {moves, connections} : {moves: [], connections: []};
  }

  private getConnections(movablePart: Part, x: number, y: number):IConnection[][] {
    const connections: IConnection[][] = [];
    const topPartId = movablePart.topLink?.id;
    const bottomPartId = movablePart.bottomLink?.id;
    const rightPartId = movablePart.rightLink?.id;
    const leftPartId = movablePart.leftLink?.id;

    const topPart = topPartId && this.getPartById(topPartId);
    const bottomPart = bottomPartId && this.getPartById(bottomPartId);
    const rightPart = rightPartId && this.getPartById(rightPartId);
    const leftPart = leftPartId && this.getPartById(leftPartId);

    if (movablePart.topLink?.connected === false && topPart && Math.abs(topPart.x - x) <= connectionDistance && Math.abs(topPart.y + this.partHeight - y) <= connectionDistance) {
      connections.push([{id: movablePart.id, link: 'topLink'}, {id: topPart.id, link: 'bottomLink'}]);
    }

    if (movablePart.bottomLink?.connected === false && bottomPart && Math.abs(bottomPart.x - x) <= connectionDistance && Math.abs(bottomPart.y - this.partHeight - y) <= connectionDistance) {
      connections.push([{id: movablePart.id, link: 'bottomLink'}, {id: bottomPart.id, link: 'topLink'}]);
    }

    if (movablePart.rightLink?.connected === false && rightPart && Math.abs(rightPart.x - this.partWidth - x) <= connectionDistance && Math.abs(rightPart.y - y) <= connectionDistance) {
      connections.push([{id: movablePart.id, link: 'rightLink'}, {id: rightPart.id, link: 'leftLink'}]);
    }

    if (movablePart.leftLink?.connected === false && leftPart && Math.abs(leftPart.x + this.partWidth - x) <= connectionDistance && Math.abs(leftPart.y - y) <= connectionDistance) {
      connections.push([{id: movablePart.id, link: 'leftLink'}, {id: leftPart.id, link: 'rightLink'}]);
    }

    return connections;
  }
}

export default Puzzles;