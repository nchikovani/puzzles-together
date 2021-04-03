const shortid = require('shortid');
import {ConnectionTypes, GameDataTypes, OptionTypes, PartTypes, UpdateTypes} from "../../../shared/Game.types";
const sizeOf = require('image-size');

const canvasProportions = 1.7;

const canvasWidth = 1;
const puzzlePartOfSize = 0.6;
const maxPartCount = 1500;

const canvasHeight = canvasWidth / canvasProportions;
const maxWidth = canvasWidth * puzzlePartOfSize;
const maxHeight = canvasHeight * puzzlePartOfSize;

class Puzzle {
  image: string;
  width: number = 0;
  height: number = 0;
  columnCount: number = 0;
  rowCount: number = 0;
  partWidth: number = 0;
  partHeight: number = 0;
  connectionCount: number = 0;
  solvedConnectionCount: number = 0;
  isSolved: boolean = false;
  parts: PartTypes[] = [];
  isInit: boolean = false;

  constructor(image: string) {
    this.image = image;
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

  init(puzzleData: any) {

  }

  getPartsCountOptions (): OptionTypes[] {
    const options: OptionTypes[] = []
    const smallSide = this.width > this.height ? 'height' : 'width';
    const bigSide = smallSide === 'height' ? 'width' : 'height';

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

  createPuzzle(option: OptionTypes) {
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

  getGameData(): GameDataTypes | null {
    return {
      image: this.image,
      width: this.width,
      height: this.height,
      partWidth: this.partWidth,
      partHeight: this.partHeight,
      parts: this.parts,
    };
  }

  update(update: UpdateTypes) {
    const {moves, connections} = update;

    this.parts.forEach((part) => {
      const targetMove = moves.find((move) => move && move.id === part.id);
      if (targetMove) {
        part.x = targetMove.x;
        part.y = targetMove.y;
      }
    });

    const connect = (connection: ConnectionTypes) => {
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
    const parts: PartTypes[] = [];
    const getRandomLinkType = () => {
      return Math.random() > 0.5 ? 'concave': 'convex';
    }

    for (let i = 0; i < this.columnCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        let topLink = null, rightLink = null, leftLink = null, bottomLink = null;
        const id = shortid.generate();
        if (j !== 0) {
          const connectingPart = parts.find((part) => part.xIndex === i && part.yIndex === j - 1);
          if (connectingPart && connectingPart.bottomLink) {
            connectingPart.bottomLink.id = id;
            topLink = {
              connected: false,
              type: connectingPart.bottomLink.type === 'concave' ? 'convex' : 'concave',
              id: connectingPart.id,
            }
          }

        }
        if (i !== 0) {
          const connectingPart = parts.find((part) => part.xIndex === i-1 && part.yIndex === j);
          if (connectingPart && connectingPart.rightLink) {
            connectingPart.rightLink.id = id;
            leftLink = {
              connected: false,
              type: connectingPart.rightLink.type === 'concave' ? 'convex' : 'concave',
              id: connectingPart.id,
            }
          }
        }
        if (i !== this.columnCount - 1) {
          rightLink = {
            type: getRandomLinkType(),
            connected: false,
            id: ''
          }
        }
        if (j !== this.rowCount - 1) {
          bottomLink = {
            type: getRandomLinkType(),
            connected: false,
            id: ''
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




export default Puzzle;