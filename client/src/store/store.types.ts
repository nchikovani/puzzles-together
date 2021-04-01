import {GameDataTypes, UpdateTypes, OptionTypes} from '../../../shared/Game.types'

export interface GameStateTypes {
  gameData: GameDataTypes | null;
  update: UpdateTypes | null;
  options: OptionTypes[] | null;
  isSolved: boolean;
}

export interface UserStateTypes {
  id: string | null;
  rooms: any[];
}

export interface StoreTypes {
  game: GameStateTypes;
  user: UserStateTypes;
}
