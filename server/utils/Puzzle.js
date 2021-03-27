const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size');

const maxWidth = 800;
const maxHeight = 600;
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

    this.parts = this.createParts();
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