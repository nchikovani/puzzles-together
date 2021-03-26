export interface GameDataType {
  image: string;
  partWidth: number;
  partHeight: number;
  parts: PartTypes[];
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
export interface UpdateType {
  moves: MoveTypes[];
  connections: ConnectionType[][];
}

export interface MoveTypes {
  id: string;
  x: number;
  y: number;
}

export interface ConnectionType {
  id: string;
  link: string;
}