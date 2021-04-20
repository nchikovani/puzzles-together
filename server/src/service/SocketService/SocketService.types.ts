import {PuzzleOptions} from "../../utils/Puzzle";
import {Socket, } from "socket.io";
import {IncomingMessage} from "http";

export interface SocketObject extends Socket{
  userId?: string;
  roomId?: string;
  puzzleOptions?: PuzzleOptions;
  request: IncomingMessage & {
    cookies?: {[key: string]: string};
  }
}