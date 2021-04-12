export interface IGameData {
  image: string;
  partWidth: number;
  partHeight: number;
  parts: IPart[];
  width: number;
  height: number;
}

export interface IPart {
  id: string;
  xIndex: number;
  yIndex: number;
  x: number;
  y: number;
  topLink: ILink | null;
  leftLink: ILink | null;
  rightLink: ILink | null;
  bottomLink: ILink | null;
}

export interface ILink {
  type: 'concave' | 'convex';
  connected: boolean;
  id: string;
}
export interface IUpdate {
  moves: IMove[];
  connections: IConnection[][];
}

export interface IMove {
  id: string;
  x: number;
  y: number;
}

export interface IConnection {
  id: string;
  link: 'topLink' | 'bottomLink' | 'rightLink' | 'leftLink';
}

export interface IOption {
  columnCount: number;
  rowCount: number;
  id: string;
}