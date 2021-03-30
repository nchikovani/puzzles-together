const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size');

const canvasWidth = 900;
const canvasHeight = 700;
const maxWidth = canvasWidth / 2;
const maxHeight = canvasHeight / 2;
const maxPartCount = 1500;

class Puzzle {
  constructor(image) {
    // this.columnCount = columnCount;
    // this.rowCount = rowCount;
    this.image = image;
    // this.partWidth = partWidth;
    // this.partHeight = partHeight;

    try {
      const buffer = Buffer.from(image.substring(image.indexOf(',') + 1), 'base64');
      const dimensions = sizeOf(buffer);

      if (dimensions.width > dimensions.height) {
        this.width = maxWidth;
        this.height = maxWidth * dimensions.height / dimensions.width;
      } else {
        this.height = maxHeight;
        this.width = maxHeight * dimensions.width / dimensions.height;
      }
    } catch (e) {
      console.log(e);
    }
  }

  getPartsCountOptions () {
    if (!this.width || !this.height) return;
    const smallSide = this.width > this.height ? 'height' : 'width';
    const bigSide = smallSide === 'height' ? 'width' : 'height';

    const options = []
    let i = 2;
    while (true) {
      const smallSidePartCount = i;
      const smallSidePartSize = this[smallSide] / smallSidePartCount;
      const bigSidePartCount = Math.ceil(this[bigSide] / smallSidePartSize);
      const partCount = smallSidePartCount * bigSidePartCount;
      if (partCount > maxPartCount) break;
      options.push({
        columnCount: smallSide === 'width' ? smallSidePartCount : bigSidePartCount,
        rowCount: smallSide === 'height' ? smallSidePartCount : bigSidePartCount,
        partCount: partCount,
      });
      i+=2;
    }

    return options;
  }

  createPuzzle(option) {
    if (!option.columnCount || !option.rowCount) return;
    this.columnCount = option.columnCount;
    this.rowCount = option.rowCount;

    this.partWidth = this.width / this.columnCount;
    this.partHeight = this.height / this.rowCount;
    this.parts = this.createParts();

    this.connectionCount = this.getConnectionCount();
    this.solvedConnectionCount = 0;
    this.isSolved = false;
  }

  getConnectionCount () {
    let connectionCount = 0;
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        i !== 0 && connectionCount++;
        j !== 0 && connectionCount++;
        i !== this.rowCount - 1 && connectionCount++;
        j !== this.columnCount - 1 && connectionCount++;
      }
    }
    return connectionCount;
  }

  getGameData() {
    return {
      image: this.image,
      width: this.width,
      height: this.height,
      partWidth: this.partWidth,
      partHeight: this.partHeight,
      parts: this.parts,
    };
  }

  update(update) {
    const {moves, connections} = update;
    if (!Array.isArray(moves) || !Array.isArray(connections) || !this.parts) return;

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
      if (link && link.connected === false) {
        link.connected = true;
        this.solvedConnectionCount++
        if (this.solvedConnectionCount === this.connectionCount) {
          this.isSolved = true;
        }
      }
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
          x: Math.random() * (canvasWidth - this.partWidth),
          y: Math.random() * (canvasHeight - this.partHeight),
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