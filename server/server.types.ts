import Puzzle from "./utils/Puzzle";

export interface RoomsTypes {
  [key: string]: {
    puzzle: Puzzle | null;
  }
}