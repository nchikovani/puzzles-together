const { v4: uuidv4 } = require('uuid');

class Puzzle {
  constructor(columnCount, rowCount, image, partWidth, partHeight) {
    this.columnCount = columnCount;
    this.rowCount = rowCount;
    this.image = image;
    this.partWidth = partWidth;
    this.partHeight = partHeight;
    this.parts = this.createParts();
  }

  getGameData() {
    return {
      image: this.image,
      partWidth: this.partWidth,
      partHeight: this.partHeight,
      parts: this.parts,
    };
  }

  update(update) {
    const {moves, connections} = update;
    if (!Array.isArray(moves) || !Array.isArray(connections)) return;

    this.parts.forEach((part) => {
      const targetMove = moves.find((move) => move && move.id === part.id);
      if (targetMove) {
        part.x = targetMove.x;
        part.y = targetMove.y;
      }
    });

    const connect = (connection) => {
      if (!connection) return;
      const targetPart = this.parts.find((part) => part && part.id === connection.id);
      const link = targetPart && targetPart[connection.link];
      if (link) link.connected = true;
    };
    connections.forEach((connection) => {
      connection && connect(connection[0]);
      connection && connect(connection[1]);
    });
  }


  createParts() {
    const parts = [];
    const getRandomLinkType = () => {
      return Math.random() > 0.5 ? 'concave': 'convex';
    }

    for (let i = 0; i < this.columnCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        let topLink, rightLink, leftLink, bottomLink;
        const id = uuidv4();
        if (j === 0) {
          topLink = null;
        } else {
          const connectingPart = parts.find((part) => part.xIndex === i && part.yIndex === j - 1);
          connectingPart.bottomLink.id = id;
          topLink = {
            connected: false,
            type: connectingPart.bottomLink.type === 'concave' ? 'convex' : 'concave',
            id: connectingPart.id,
          }
        }
        if (i === 0) {
          leftLink = null;
        } else {
          const connectingPart = parts.find((part) => part.xIndex === i-1 && part.yIndex === j);
          connectingPart.rightLink.id = id;
          leftLink = {
            connected: false,
            type: connectingPart.rightLink.type === 'concave' ? 'convex' : 'concave',
            id: connectingPart.id,
          }
        }
        if (i === this.columnCount - 1) {
          rightLink = null;
        } else {
          rightLink = {
            type: getRandomLinkType(),
            connected: false,
          }
        }
        if (j === this.rowCount - 1) {
          bottomLink = null;
        } else {
          bottomLink = {
            type: getRandomLinkType(),
            connected: false,
          }
        }
        parts.push({
          id,
          xIndex: i,
          yIndex: j,
          x: Math.random() * 800,
          y: Math.random() * 600,
          topLink,
          leftLink,
          rightLink,
          bottomLink
        })
      }
    }
    return parts;
  }
}




module.exports = Puzzle;