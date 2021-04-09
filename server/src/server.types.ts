import Puzzle from "./utils/Puzzle";

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

