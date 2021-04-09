import Puzzle from "../../utils/Puzzle";
import {Socket} from "socket.io";

export interface ActiveRoomTypes {
  _id: string;
  owner: string;
  puzzle: Puzzle | null;
}

export interface SocketObject extends Socket{
  roomId?: string;
}