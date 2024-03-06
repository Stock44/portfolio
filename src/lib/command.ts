import { type Cell } from "./cells.ts";

interface SetRenderTarget {
  type: "setRenderTarget";
  target: OffscreenCanvas;
}

interface SetHoverPosition {
  type: "setHoverPosition";
  position: Cell | null;
}

interface ChangeResolution {
  type: "changeResolution";
  height: number;
  width: number;
}

interface ChangeCellSize {
  type: "changeCellSize";
  height: number;
  width: number;
}

interface ChangeCellColor {
  type: "changeCellColor";
  color: string;
}

interface ChangeUpdateRate {
  type: "changeUpdateRate";
  updateRate: number;
}

interface SetPaused {
  type: "setPaused";
  paused: boolean;
}

interface ToggleCell {
  type: "toggleCell";
  x: number;
  y: number;
}

interface Clear {
  type: "clear";
}

type Command =
  | ChangeResolution
  | ChangeCellSize
  | ChangeCellColor
  | ChangeUpdateRate
  | Clear
  | ToggleCell
  | SetPaused
  | SetRenderTarget
  | SetHoverPosition;

export default Command;
