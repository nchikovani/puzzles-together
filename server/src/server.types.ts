import Puzzle from "./utils/Puzzle";
import {Socket} from "socket.io";

export interface RoomTypes {
  id: string;
  name?: string;
  puzzle: Puzzle | null;
}

export interface UserTypes {
  id: string;
  registered: boolean;
  roomsId: string[];
}

export interface SocketObject extends Socket{
  roomId?: string;
}