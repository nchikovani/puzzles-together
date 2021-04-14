import {Puzzle, PuzzleOptions} from "../../utils/Puzzle";
import {Socket} from "socket.io";

export interface IActionRoom {
  _id: string;
  owner: string;
  puzzle: Puzzle | null;
}

export interface SocketObject extends Socket{
  roomId?: string;
  puzzleOptions?: PuzzleOptions;
}