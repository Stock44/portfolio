import { enableMapSet, produce } from 'immer';
import {
	addCells,
	Cell,
	CellSet,
	fillRegionWithRandomPattern,
	hasCell,
	iterate,
	makeCellSet,
	removeCells,
	toggleCells as toggleCellSetCell,
	append,
} from './cells.ts';

enableMapSet();

/**
 * The GameOfLife interface represents a game of life simulation.
 */
export interface GameOfLife {
	rows: number;
	columns: number;
	liveCells: CellSet;
}

/**
 * Creates a new GameOfLife object.
 * @returns {GameOfLife} A new GameOfLife object with initial values.
 */
export function makeGameOfLife(
	rows: number = 0,
	columns: number = 0,
): GameOfLife {
	return {
		rows: rows,
		columns: columns,
		liveCells: makeCellSet(),
	};
}

/**
 * Updates the size of the game board in the GameOfLife state.
 *
 * @param {GameOfLife} base - The base value of the GameOfLife state.
 * @param {number} rows - The number of rows in the new size.
 * @param {number} columns - The number of columns in the new size.
 * @returns {GameOfLife} The new game of life instance with an updated state
 */
export const updateSize = produce(
	(draft: GameOfLife, rows: number, columns: number) => {
		const previousRows = draft.rows;
		const previousCols = draft.columns;

		draft.rows = rows;
		draft.columns = columns;

		if (previousRows < rows) {
			console.log('adding rows');
			fillRegionWithRandomPattern(
				draft.liveCells,
				[previousRows, 0],
				[rows - 1, columns],
			);
		}

		if (previousCols < columns) {
			console.log('adding cols');
			fillRegionWithRandomPattern(
				draft.liveCells,
				[0, previousCols],
				[rows, columns - 1],
			);
		}
	},
);

/**
 * Toggles cells in the GameOfLife instance.
 *
 * @param {GameOfLife} base - The base value of the GameOfLife instance.
 * @param {...Cell} cells - The cells to toggle.
 * @returns {GameOfLife} The new game of life instance with an updated state
 */
export const toggleCells = produce((draft: GameOfLife, ...cells: Cell[]) => {
	toggleCellSetCell(draft.liveCells, cells);
});

/**
 * Analyzes the neighbors of a specific cell in the Game of Life, counting its live neighbors
 * and obtaining the surrounding empty cells.
 *
 * @param {Readonly<GameOfLife>} game - The Game of Life instance.
 * @param {Cell} cell - The cell to analyze
 * @return {Array<number, CellSet>} - An array containing the number of live neighbors and the empty neighbors.
 */
export function analyzeNeighbors(
	game: Readonly<GameOfLife>,
	cell: Cell,
): [number, CellSet] {
	let liveNeighbors = 0;
	const emptyNeighbors = makeCellSet();

	const [x, y] = cell;

	const top = x === 0 ? game.rows - 1 : x - 1;
	const bottom = x === game.rows - 1 ? 0 : x + 1;
	const left = y === 0 ? game.columns - 1 : y - 1;
	const right = y === game.columns - 1 ? 0 : y + 1;

	const cellsToCheck: Array<[number, number[]]> = [
		[top, [left, y, right]],
		[x, [left, right]],
		[bottom, [left, y, right]],
	];

	for (const [cellX, cells] of cellsToCheck) {
		const row = game.liveCells.get(cellX);

		if (!row) {
			addCells(
				emptyNeighbors,
				cells.map(cellY => [cellX, cellY] satisfies Cell),
			);
			continue;
		}

		for (const cellY of cells) {
			if (hasCell(game.liveCells, cellX, cellY)) {
				liveNeighbors++;
			} else {
				addCells(emptyNeighbors, [[cellX, cellY]]);
			}
		}
	}

	return [liveNeighbors, emptyNeighbors];
}

export function drawLiveCells(
	context: OffscreenCanvasRenderingContext2D,
	game: Readonly<GameOfLife>,
	cellWidth: number,
	cellHeight: number,
	cellColor: string,
) {
	context.fillStyle = cellColor;
	context.shadowColor = cellColor;
	context.shadowBlur = 5;

	for (const [x, row] of game.liveCells.entries())
		for (const y of row)
			context.fillRect(
				x * cellWidth,
				y * cellHeight,
				cellWidth,
				cellHeight,
			);
}

export const doGameStep = produce((draft: GameOfLife) => {
	const cellsToKill: Array<Cell> = [];
	const cellsToAdd: Array<Cell> = [];
	const exploredCells = makeCellSet();

	const liveCells = draft.liveCells;

	for (const cell of iterate(liveCells)) {
		const [liveNeighborCount, deadNeighbors] = analyzeNeighbors(
			draft,
			cell,
		);

		for (const cell of iterate(deadNeighbors)) {
			if (hasCell(exploredCells, ...cell)) continue;

			const [liveNeighborCount] = analyzeNeighbors(draft, cell);

			if (liveNeighborCount === 3) {
				cellsToAdd.push(cell);
			}
		}

		append(exploredCells, deadNeighbors);

		if (liveNeighborCount < 2 || liveNeighborCount > 3) {
			cellsToKill.push(cell);
		}
	}

	addCells(draft.liveCells, cellsToAdd);

	removeCells(draft.liveCells, cellsToKill);
});
