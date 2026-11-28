export interface LayoutRuntime {
  tool: 'select' | 'grid' | 'dimension' | 'text';
  selected: {kind: 'view' | 'grid' | 'dimension' | 'text'; id: string} | null;
  drag: any;
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
