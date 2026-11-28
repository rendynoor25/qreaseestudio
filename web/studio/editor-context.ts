export type LayoutDrag =
  | {kind: 'grid'; id: string; viewId: string; start: number[]; dx: number; dy: number}
  | {kind: 'view' | 'text'; id: string; start: number[]; x: number; y: number};

export interface LayoutRuntime {
  tool: 'select' | 'grid' | 'dimension' | 'text';
  selected: {kind: 'view' | 'grid' | 'dimension' | 'text'; id: string} | null;
  drag: LayoutDrag | null;
  dimensionStart: {viewId: string; gridId: string} | null;
  activeViewId: string | null;
  gridPending: {viewId: string; a: number[]} | null;
  gridHover: number[] | null;
  selectedGridId: string | null;
  hoverGridId: string | null;
  zoom: number;
}

export interface EditorContext {
  readonly state: QreaseeState;
  readonly camera: QreaseeCamera;
  readonly layout: LayoutRuntime;
}
