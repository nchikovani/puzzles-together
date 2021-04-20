import {Puzzle} from "../../utils/Puzzle";

class ActivePuzzlesService {
  private _activePuzzles: {[roomId: string]: Puzzle | null} = {};

  get activePuzzles() {
    return this._activePuzzles;
  }

  findPuzzle(roomId: string): Puzzle | null | undefined {
    return this._activePuzzles[roomId];
  }

  addPuzzle(roomId: string, puzzle: Puzzle | null) {
    this._activePuzzles[roomId] = puzzle;
  }

  changePuzzle(roomId: string, puzzle: Puzzle) {
    this._activePuzzles[roomId] = puzzle;
  }

  removePuzzle(roomId: string) {
    delete this._activePuzzles[roomId];
  }
}

export default ActivePuzzlesService;