import {GameDataType, UpdateType} from '../components/Game/Puzzles/Puzzles.types'

export interface GameStateTypes {
  gameData: GameDataType | null;
  update: UpdateType | null;
  options: any;
  isSolved: boolean;
}

export interface StoreTypes {
  game: GameStateTypes;
}
