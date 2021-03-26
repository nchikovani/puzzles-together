import Part from './Part';
import {PartTypes, MoveTypes, ConnectionType, UpdateType} from './Puzzles.types';
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

  solvePuzzles() {
    this.parts.forEach(part => {
      const xCoords = this.ctx.lineWidth + part.xIndex * part.fullWidth;
      const yCoords = this.ctx.lineWidth + part.yIndex * part.fullWidth;
      part.setCoords(xCoords, yCoords);
    });
    this.drawPuzzles();
  }

  getPartById(id: string) {
    return this.parts.find(part => part.id === id);
  }

  setUpdate(update: UpdateType) {
    const {moves, connections} = update;
    const movedParts: Part[] = [];
    moves.forEach((move) => {
      const targetPart = this.getPartById(move.id);
      if (targetPart) {
        targetPart.setCoords(move.x, move.y);
        movedParts.push(targetPart);
      }
    });

    this.parts = this.parts.filter(part => {
      return !movedParts.includes(part);
    })
    this.parts = this.parts.concat(movedParts);

    const connect = (connection: ConnectionType) => {
      const part = this.getPartById(connection.id);
      // @ts-ignore
      const link = part && part[connection.link];
      if (link) link.connected = true;
    };
    // console.log(connections);
    connections.forEach((connection) => {
      connect(connection[0]);
      connect(connection[1]);
      playKnock();
    });
  }
  // getUpdate(movablePart: Part, x: number, y: number) {
  //   const connections = this.getConnections(movablePart, x, y);
  //   const moves = this.getMoves(movablePart, x, y);
  //   return {moves, connections};
  // }

  getUpdate(movablePart: Part, x: number, y: number) {
    const moves: MoveTypes[] = [];
    let connections: ConnectionType[][] = [];
    const loop =(movablePart: Part, x: number, y: number) => {
      moves.push({id: movablePart.id, x: x, y: y});
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

    return {moves, connections};
  }

  getConnections(movablePart: Part, x: number, y: number):ConnectionType[][] {
    const connectionDistance = 4;
    const connections = [];
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