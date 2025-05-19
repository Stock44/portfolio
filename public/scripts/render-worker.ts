import Command from '../../src/lib/command.ts';
import {
	doGameStep,
	drawLiveCells,
	makeGameOfLife,
	toggleCells,
	updateSize,
} from '../../src/lib/conway-game.ts';
import { type Cell, hasCell } from '../../src/lib/cells.ts';

// global variables
let canvas: OffscreenCanvas | undefined;
let cellWidth = 0;
let cellHeight = 0;
const cellColor = '#2a1219';
const hoverColor = '#1d0c11';
let columns = 0;
let rows = 0;
let pause = false;
let updateInterval = 1000;
let hoverPosition: Cell | undefined;

// game instance
let game = makeGameOfLife();

function updateGrid() {
	if (canvas) {
		rows = Math.floor(canvas.width / cellHeight);
		columns = Math.floor(canvas.height / cellWidth);
		game = updateSize(game, rows, columns);
	}
}

// command handler
addEventListener('message', (event: MessageEvent<Command>) => {
	const command = event.data;
	switch (command.type) {
		case 'clear': {
			game = makeGameOfLife(game.rows, game.columns);
			break;
		}
		case 'changeResolution': {
			if (canvas) {
				canvas.width = command.width;
				canvas.height = command.height;
			}
			updateGrid();
			break;
		}
		case 'changeCellSize': {
			cellWidth = command.width;
			cellHeight = command.height;
			updateGrid();
			break;
		}
		case 'changeUpdateRate': {
			updateInterval =
				command.updateRate > 0
					? 1000 / command.updateRate
					: updateInterval;
			break;
		}
		case 'toggleCell': {
			game = toggleCells(game, [command.x, command.y]);
			break;
		}
		case 'setRenderTarget': {
			canvas = command.target;
			break;
		}
		case 'setHoverPosition': {
			hoverPosition = command.position;
			break;
		}
		case 'setPaused': {
			pause = command.paused;
			break;
		}
	}
});

let previousUpdate = 0;

function update() {
	// Skip if paused
	if (pause) {
		setTimeout(update, updateInterval);
		return;
	}

	// Run at update rate
	const time = Date.now();
	const deltaTime = time - previousUpdate;

	if (updateInterval > deltaTime) {
		setTimeout(update, updateInterval - deltaTime);
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

	const context = canvas.getContext('2d')!;

	context.clearRect(0, 0, canvas.width, canvas.height);

	drawLiveCells(context, game, cellWidth, cellHeight, cellColor);

	if (hoverPosition && !hasCell(game.liveCells, ...hoverPosition)) {
		const [x, y] = hoverPosition;
		context.fillStyle = hoverColor;
		context.shadowColor = cellColor;
		context.shadowBlur = 20;
		context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
	}

	requestAnimationFrame(render);
}

// start loop
requestAnimationFrame(render);
update();
