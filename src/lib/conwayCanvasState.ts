import Command from "./Command.ts";
import Alpine from "alpinejs";

document.addEventListener("alpine:init", () => {
  Alpine.data("conwayCanvasState", () => ({
    mouseCoords: null as [number, number] | null,

    mouseDown: false,

    previousCell: null as [number, number] | null,

    renderWorker: new Worker(
      new URL("/scripts/renderWorker.ts", import.meta.url),
      {
        type: "module",
        name: "conwayRenderer",
      },
    ),

    onCanvasInit() {
      const canvas = this.$el as HTMLCanvasElement;
      const offscreen = canvas.transferControlToOffscreen();

      this.renderWorker.postMessage(
        {
          type: "setRenderTarget",
          target: offscreen,
        } satisfies Command,
        [offscreen],
      );

      this.renderWorker.postMessage({
        type: "changeResolution",
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      } satisfies Command);
    },

    globalCoordToCell(globalX: number, globalY: number): [number, number] {
      const canvas = this.$el as HTMLCanvasElement;

      const x = globalX - canvas.offsetLeft;
      const y = globalY - canvas.offsetTop;
      const xCell = Math.floor(x / 16);
      const yCell = Math.floor(y / 16);
      return [xCell, yCell];
    },

    drawCell(x: number, y: number) {
      this.previousCell = [x, y];
      this.renderWorker.postMessage({
        type: "toggleCell",
        x,
        y,
      } satisfies Command);
    },

    init() {
      this.renderWorker.postMessage({
        type: "changeCellSize",
        width: 16,
        height: 16,
      } satisfies Command);

      this.renderWorker.postMessage({
        type: "changeCellColor",
        color: "#ff0082",
      } satisfies Command);
    },

    onWindowResize() {
      const canvas = this.$el as HTMLCanvasElement;

      this.renderWorker.postMessage({
        type: "changeResolution",
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      } satisfies Command);
    },

    onMouseMove(event: MouseEvent) {
      const [xCell, yCell] = this.globalCoordToCell(
        event.clientX,
        event.clientY,
      );

      if (
        !(
          this.previousCell &&
          xCell === this.previousCell[0] &&
          yCell === this.previousCell[1]
        ) &&
        this.mouseDown
      ) {
        this.drawCell(xCell, yCell);
      }
    },

    onTouchEnd() {
      this.previousCell = null;
    },

    onTouchMove(event: TouchEvent) {
      const { clientX, clientY } = event.targetTouches[0]!;
      const [xCell, yCell] = this.globalCoordToCell(clientX, clientY);

      if (
        !(
          this.previousCell &&
          xCell === this.previousCell[0] &&
          yCell === this.previousCell[1]
        )
      ) {
        this.drawCell(xCell, yCell);
      }
    },

    onMouseUp() {
      this.mouseDown = false;
      this.previousCell = null;
    },

    onMouseDown(event: MouseEvent) {
      this.mouseDown = true;
      const [xCell, yCell] = this.globalCoordToCell(
        event.clientX,
        event.clientY,
      );
      this.drawCell(xCell, yCell);
    },

    onMouseLeave() {
      this.mouseCoords = null;
    },

    canvas() {
      return {
        ["x-init"]: this.onCanvasInit,
        ["@resize.window"]: this.onWindowResize,
        ["@mousemove"]: this.onMouseMove,
        ["@touchend"]: this.onTouchEnd,
        ["@touchmove"]: this.onTouchMove,
        ["@mouseup"]: this.onMouseUp,
        ["@mousedown"]: this.onMouseDown,
        ["@mouseleave"]: this.onMouseLeave,
      };
    },
  }));
});
