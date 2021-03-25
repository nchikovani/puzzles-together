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
  type: string,
  connected: boolean,
  id: string,
}
