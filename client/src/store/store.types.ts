import {GameDataTypes, UpdateTypes, OptionTypes} from 'shared'

export interface GameStateTypes {
  gameData: GameDataTypes | null;
  update: UpdateTypes | null;
  options: OptionTypes[] | null;
  isSolved: boolean;
}

export interface RoomTypes {
  _id: string;
  owner: string;
  name?: string;
  puzzle?: string;
}

export interface UserStateTypes {
  id: string | null;
  registered: false;
}

export interface StoreTypes {
  game: GameStateTypes;
  user: UserStateTypes;
  rooms: RoomTypes[];
}
