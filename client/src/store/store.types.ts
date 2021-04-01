import {GameDataTypes, UpdateTypes, OptionTypes} from '../../../shared/Game.types'

export interface GameStateTypes {
  gameData: GameDataTypes | null;
  update: UpdateTypes | null;
  options: OptionTypes[] | null;
  isSolved: boolean;
}

export interface PersonalAreaTypes {
  rooms: any[];
  isOwner: false;
}

export interface UserStateTypes {
  id: string | null;
  registered: false;
}

export interface StoreTypes {
  game: GameStateTypes;
  user: UserStateTypes;
  personalArea: PersonalAreaTypes;
}
