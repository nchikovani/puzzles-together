import {GameDataTypes, UpdateTypes, OptionTypes} from '../components/Game/Puzzles/Puzzles.types'

export interface GameStateTypes {
  gameData: GameDataTypes | null;
  update: UpdateTypes | null;
  options: OptionTypes[] | null;
  isSolved: boolean;
}

export interface StoreTypes {
  game: GameStateTypes;
}
