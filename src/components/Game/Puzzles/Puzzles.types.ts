export interface GameDataTypes {
  image: string;
  partWidth: number;
  partHeight: number;
  parts: PartTypes[];
  width: number;
  height: number;
}

export interface PartTypes {
  id: string;
  xIndex: number;
  yIndex: number;
  x: number;
  y: number;
  topLink: LinkTypes | null;
  leftLink: LinkTypes | null;
  rightLink: LinkTypes | null;
  bottomLink: LinkTypes | null;
}

export interface LinkTypes {
  type: string;
  connected: boolean;
  id: string;
}
export interface UpdateTypes {
  moves: MoveTypes[];
  connections: ConnectionTypes[][];
}

export interface MoveTypes {
  id: string;
  x: number;
  y: number;
}

export interface ConnectionTypes {
  id: string;
  link: string;
}

export interface OptionTypes {
  columnCount: number;
  rowCount: number;
  partCount: number;
}