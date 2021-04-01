import Puzzle from "./utils/Puzzle";

export interface RoomTypes {
  id: string;
  name?: string;
  puzzle: Puzzle | null;
}