export interface PartTypes {
  id: string;
  xIndex: number;
  yIndex: number;
  x: number;
  y: number;
  top?: LinkTypes | null;
  left?: LinkTypes | null;
  right?: LinkTypes | null;
  bottom?: LinkTypes | null;
}

export interface LinkTypes {
  type: string;
  partId: string;
}