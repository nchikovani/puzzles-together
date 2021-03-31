import {GameDataTypes, UpdateTypes, OptionTypes} from '../../../shared/Game.types'

export interface GameStateTypes {
  gameData: GameDataTypes | null;
  update: UpdateTypes | null;
  options: OptionTypes[] | null;
  isSolved: boolean;
}

export interface StoreTypes {
  game: GameStateTypes;
}
