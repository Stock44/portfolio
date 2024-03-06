import Command from "../../src/lib/command.ts";
import {
  doGameStep,
  drawLiveCells,
  makeGameOfLife,
  toggleCells,
  updateSize,
} from "../../src/lib/conwayGame.ts";

// global variables
let canvas: OffscreenCanvas | null = null;
let cellWidth = 0;
let cellHeight = 0;
let cellColor = "#FFFFFF";
let columns = 0;
let rows = 0;
let pause = false;
let updateRate = 1000;

// game instance
let game = makeGameOfLife();

function updateGrid() {
  if (canvas) {
    rows = Math.floor(canvas.width / cellHeight);
    columns = Math.floor(canvas.height / cellWidth);
    updateSize(game, rows, columns);
  }
}

// command handler
addEventListener("message", (event: MessageEvent<Command>) => {
  const command = event.data;
  switch (command.type) {
    case "changeCellColor":
      cellColor = command.color;
      break;
    case "changeResolution":
      if (canvas) {
        canvas.width = command.width;
        canvas.height = command.height;
      }
      updateGrid();
      break;
    case "changeCellSize":
      cellWidth = command.width;
      cellHeight = command.height;
      updateGrid();
      break;
    case "changeUpdateRate":
      updateRate = command.updateRate;
      break;
    case "toggleCell":
      game = toggleCells(game, [command.x, command.y]);
      break;
    case "setRenderTarget":
      canvas = command.target;
      break;
    case "setHoverPosition":
      // TODO
      break;
    case "togglePause":
      pause = !pause;
      break;
  }
});

let previousUpdate = 0;

function update() {
  // Skip if paused
  if (pause) {
    setTimeout(update, updateRate);
    return;
  }

  // Run at update rate
  const time = Date.now();
  const deltaTime = time - previousUpdate;

  if (updateRate > deltaTime) {
    setTimeout(update, updateRate - deltaTime);
    return;
  }
  previousUpdate = time;

  // Do game update
  game = doGameStep(game);
  update();
}

function render() {
  if (!canvas) {
    requestAnimationFrame(render);
    return;
  }

  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLiveCells(ctx, game, cellWidth, cellHeight, cellColor);

  requestAnimationFrame(render);
}

// start loop
requestAnimationFrame(render);
update();
