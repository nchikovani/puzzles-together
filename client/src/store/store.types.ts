import {GameDataTypes, UpdateTypes, OptionTypes} from 'shared'

export interface GameStateTypes {
  gameData: GameDataTypes | null;
  update: UpdateTypes | null;
  options: OptionTypes[] | null;
  isSolved: boolean;
}

export interface RoomsTypes {
  list: RoomTypes[];
  isLoaded: boolean;
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
  isLoaded: boolean;
}

export interface StoreTypes {
  game: GameStateTypes;
  user: UserStateTypes;
  rooms: RoomsTypes;
}
