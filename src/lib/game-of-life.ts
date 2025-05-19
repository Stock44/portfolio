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

export class GameOfLife {
	private _rowCount: number;
	private _columnCount: number;

	get rowCount() {
		return this._rowCount;
	}

	get columnCount() {
		return this._columnCount;
	}

	private _liveCells: CellSet;

	get liveCells() {
		return this._liveCells;
	}

	constructor(rowCount: number = 0, columnCount: number = 0) {
		this._rowCount = rowCount;
		this._columnCount = columnCount;
		this._liveCells = makeCellSet();
	}

	/**
	 * Updates the size of the game board in the GameOfLife state.
	 *
	 * @param rows - The number of rows in the new size.
	 * @param columns - The number of columns in the new size.
	 * @returns The new game of life instance with an updated state
	 */
	updateSize(rows: number, columns: number) {
		const previousRows = this.rowCount;
		const previousCols = this.columnCount;

		this._rowCount = rows;
		this._columnCount = columns;

		if (previousRows < rows) {
			fillRegionWithRandomPattern(
				this._liveCells,
				[previousRows, 0],
				[rows - 1, columns],
			);
		}

		if (previousCols < columns) {
			fillRegionWithRandomPattern(
				this._liveCells,
				[0, previousCols],
				[rows, columns - 1],
			);
		}
	}

	/**
	 * Toggles the state of specific cells in the Game of Life.
	 *
	 * This method modifies the state of the provided cells in the game's live cells set.
	 *
	 * @param cells - The cells whose state will be toggled in the live cells set.
	 */
	toggleCells(cells: Cell[]) {
		toggleCellSetCell(this._liveCells, cells);
	}

	/**
	 * Analyzes the neighbors of a specific cell in the Game of Life, counting its live neighbors
	 * and obtaining the surrounding empty cells.
	 *
	 * @param  cell - The cell to analyze
	 * @return - An array containing the number of live neighbors and the empty neighbors.
	 */
	private analyzeNeighbors(cell: Cell): [number, CellSet] {
		let liveNeighbors = 0;
		const emptyNeighbors = makeCellSet();

		const [x, y] = cell;

		const top = x === 0 ? this.rowCount - 1 : x - 1;
		const bottom = x === this.rowCount - 1 ? 0 : x + 1;
		const left = y === 0 ? this.columnCount - 1 : y - 1;
		const right = y === this.columnCount - 1 ? 0 : y + 1;

		const cellsToCheck: Array<[number, number[]]> = [
			[top, [left, y, right]],
			[x, [left, right]],
			[bottom, [left, y, right]],
		];

		for (const [cellX, cellYs] of cellsToCheck) {
			const row = this._liveCells.get(cellX);

			if (!row) {
				addCells(
					emptyNeighbors,
					cellYs.map(cellY => [cellX, cellY] satisfies Cell),
				);
				continue;
			}

			for (const cellY of cellYs) {
				if (hasCell(this._liveCells, cellX, cellY)) {
					liveNeighbors++;
				} else {
					addCells(emptyNeighbors, [[cellX, cellY]]);
				}
			}
		}

		return [liveNeighbors, emptyNeighbors];
	}

	doGameStep() {
		// We create a list of cells that we should kill and a list of cells that should be added.
		const cellsToKill: Array<Cell> = [];
		const cellsToAdd: Array<Cell> = [];

		// An active dead cell is defined as a dead cell that has at least one live neighbor.
		// We will keep track of them here
		const activeDeadCells = makeCellSet();

		// Analyze each live cell
		for (const cell of iterate(this._liveCells)) {
			const [liveNeighborCount, deadNeighbors] =
				this.analyzeNeighbors(cell);

			// We gather all of the cell's deed neighbors and add them to the active dead cells set
			append(activeDeadCells, deadNeighbors);

			// If the cell meets the conditions for death, we add it to the list of cells to kill
			if (liveNeighborCount < 2 || liveNeighborCount > 3) {
				cellsToKill.push(cell);
			}
		}

		// For each active dead cell, we check if it should be added to the list of cells to add
		for (const cell of iterate(activeDeadCells)) {
			const [liveNeighborCount] = this.analyzeNeighbors(cell);

			if (liveNeighborCount === 3) {
				cellsToAdd.push(cell);
			}
		}

		// Perform all pending modifications to the game
		addCells(this._liveCells, cellsToAdd);
		removeCells(this._liveCells, cellsToKill);
	}
}
