const shortid = require('shortid');
import {ServerError, serverErrorMessages} from 'shared';

import {IConnection, IGameData, IOption, IPart, ILink, IUpdate} from 'shared';
const sizeOf = require('image-size');

const canvasProportions = 1.7;

const canvasWidth = 1;
const puzzlePartOfSize = 0.6;
const maxPartCount = 1500;

const canvasHeight = canvasWidth / canvasProportions;
const maxWidth = canvasWidth * puzzlePartOfSize;
const maxHeight = canvasHeight * puzzlePartOfSize;

class Puzzle {
  private image: string = '';
  private width: number = 0;
  private height: number = 0;
  private columnCount: number = 0;
  private rowCount: number = 0;
  private partWidth: number = 0;
  private partHeight: number = 0;
  private connectionCount: number = 0;
  private solvedConnectionCount: number = 0;
  private parts: IPart[] = [];
  private _options: IOption[] = [];
  private _isInit: boolean = false;
  private _puzzleIsCreated: boolean = false;
  private _isSolved: boolean = false;

  get options() {
    return this._options;
  }

  get isInit() {
    return this._isInit;
  }

  get puzzleIsCreated() {
    return this._puzzleIsCreated;
  }

  get isSolved() {
    return this._isSolved;
  }

  init(image: string) {
    this.image = image;
    try {
      const buffer = Buffer.from(image.substring(image.indexOf(',') + 1), 'base64');
      const dimensions = sizeOf(buffer);

      // const imageProportions = dimensions.width / dimensions.height;
      //
      // const width = Math.pow(imageProportions * canvasVolume * puzzleVolumeOfCanvas, 1/2);
      // const height = width / imageProportions;
      // this.width = width;
      // this.height = height;

      if (dimensions.width / canvasWidth > dimensions.height / canvasHeight) {
        this.width = maxWidth;
        this.height = maxWidth * dimensions.height / dimensions.width;
      } else {
        this.height = maxHeight;
        this.width = maxHeight * dimensions.width / dimensions.height;
      }
      this.setPartsCountOptions();
      this._isInit = true;
    } catch (e) {
      throw new ServerError(400, serverErrorMessages.imageNotCorrect);
    }
  }

  createPuzzle(optionId: string) {
    if (!this.isInit) {
      throw new ServerError(400, serverErrorMessages.gameNotInit);
    }
    const option = this.options.find(option => option.id === optionId);
    if (!option) {
      throw new ServerError(404, serverErrorMessages.optionNotFound);
    }
    this.columnCount = option.columnCount;
    this.rowCount = option.rowCount;

    this.partWidth = this.width / this.columnCount;
    this.partHeight = this.height / this.rowCount;
    this.parts = this.createParts();

    this.connectionCount = this.getConnectionCount();
    this.solvedConnectionCount = 0;
    this._isSolved = false;
    this._puzzleIsCreated = true;
  }

  createPuzzleFromJson(jsonData: string) {
    try {
      const puzzle = JSON.parse(jsonData);
      //puzzle unknown, все проверять?
      this.image = puzzle.image;
      this.width = puzzle.width;
      this.height = puzzle.height;
      this.columnCount = puzzle.columnCount;
      this.rowCount = puzzle.rowCount;
      this.partWidth = puzzle.partWidth;
      this.partHeight = puzzle.partHeight;
      this.connectionCount = puzzle.connectionCount;
      this.solvedConnectionCount = puzzle.solvedConnectionCount;
      this._isSolved = puzzle._isSolved;
      this.parts = puzzle.parts;
      this._options = puzzle._options;
      this._isInit = puzzle._isInit;
      this._puzzleIsCreated = puzzle._puzzleIsCreated;
    } catch (e) {
      throw new ServerError(500, serverErrorMessages.incorrectSavedData);
    }
  }

  getJsonPuzzle() {
    if (!this._isInit) {
      throw new ServerError(400, serverErrorMessages.gameNotInit);
    }

    return JSON.stringify(this);
  }

  private setPartsCountOptions () {
    const options: IOption[] = []
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
        id: shortid.generate(),
        columnCount: smallSide === 'width' ? smallSidePartCount : bigSidePartCount,
        rowCount: smallSide === 'height' ? smallSidePartCount : bigSidePartCount,
      });
      i+=2;
    }
    this._options = options;
  }

  private getConnectionCount () {
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

  getGameData(): IGameData {
    if (!this.puzzleIsCreated) {
      throw  new ServerError(400, serverErrorMessages.puzzleNotCreated);
    }
    return {
      image: this.image,
      width: this.width,
      height: this.height,
      partWidth: this.partWidth,
      partHeight: this.partHeight,
      parts: this.parts,
    };
  }

  update(update: IUpdate) {
    if (!this.puzzleIsCreated) {
      throw new ServerError(400, serverErrorMessages.puzzleNotCreated);
    }
    const {moves, connections} = update;

    this.parts.forEach((part) => {
      const targetMove = moves.find((move) => move && move.id === part.id);
      if (targetMove) {
        part.x = targetMove.x;
        part.y = targetMove.y;
      }
    });

    const connect = (connection: IConnection) => {
      const targetPart = this.parts.find((part) => part && part.id === connection.id);
      const link = targetPart && targetPart[connection.link];
      if (link && !link.connected) {
        link.connected = true;
        this.solvedConnectionCount++
        if (this.solvedConnectionCount === this.connectionCount) {
          this._isSolved = true;
        }
      }
    };
    connections.forEach((connection) => {
      connection && connect(connection[0]);
      connection && connect(connection[1]);
    });
  }


  private createParts() {
    const parts: IPart[] = [];
    const getRandomLinkType = () => {
      return Math.random() > 0.5 ? 'concave': 'convex';
    }

    for (let i = 0; i < this.columnCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        type LinkTypesOrNull = ILink | null;
        let topLink: LinkTypesOrNull= null;
        let rightLink: LinkTypesOrNull = null;
        let leftLink: LinkTypesOrNull = null;
        let bottomLink: LinkTypesOrNull = null;
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