import { rotatePatternRandomly, selectRandomPattern } from './patterns.ts';

export type Cell = [number, number];

export type CellSet = Map<number, Set<number>>;

export function makeCellSet(): CellSet {
	return new Map();
}

/**
 * Adds new cells to a CellSet.
 * @param cellSet - The CellSet to add the cells to.
 * @param cells - The cells to add. Each cell is represented as a tuple [x, y], where x is the row and y is the column.
 * @returns A new, updated CellSet
 */
export function addCells(cellSet: CellSet, cells: Cell[]) {
	for (const [x, y] of cells) {
		const row = cellSet.get(x);
		if (row) {
			row.add(y);
		} else {
			cellSet.set(x, new Set([y]));
		}
	}
}

/**
 * Checks if the given cell set has a cell at the specified coordinates.
 *
 * @param {Readonly<CellSet>} cellSet - The CellSet to check.
 * @param {number} x - The x-coordinate of the cell.
 * @param {number} y - The y-coordinate of the cell.
 *
 * @return {boolean} Returns true if the CellSet has a cell at the specified coordinates, otherwise false.
 */
export function hasCell(
	cellSet: Readonly<CellSet>,
	x: number,
	y: number,
): boolean {
	return cellSet.get(x)?.has(y) ?? false;
}

/**
 * Removes the specified cell(s) from the given cell set.
 *
 * @param set - The base cell set
 * @param cells - The cell(s) to remove (as an array of [x, y] pairs).
 */
export function removeCells(set: CellSet, cells: Cell[]) {
	for (const [x, y] of cells) {
		const row = set.get(x);

		if (row) {
			row.delete(y);

			if (row.size === 0) {
				set.delete(x);
			}
		}
	}
}

/**
 * Toggles the specified cell(s) in the given cell set.
 *
 * @param {CellSet} draft - The base cell set
 * @param {Cell[]} cells - The cell(s) to toggle (as an array of [x, y] pairs).
 */
export function toggleCells(draft: CellSet, cells: Cell[]) {
	for (const [x, y] of cells) {
		const row = draft.get(x);

		if (row) {
			if (row.has(y)) {
				row.delete(y);
			} else {
				row.add(y);
			}
		} else {
			draft.set(x, new Set([y]));
		}
	}
}

/**
 * Combines two CellSet objects into one by performing a union operation.
 * Any overlapping keys will merge their value sets into one.
 *
 * @param l - The first read-only CellSet object. It will be modified to include elements from the second set.
 * @param r - The second read-only CellSet object whose entries will be added to the first set.
 */
export function append(l: Readonly<CellSet>, r: Readonly<CellSet>) {
	for (const [k, v] of r.entries()) {
		const set = l.get(k);
		if (set) {
			for (const setValue of v) {
				set.add(setValue);
			}
		} else {
			l.set(k, new Set(v));
		}
	}
}

/**
 * A generator function that iterates over a Readonly<CellSet> and yields cell coordinates.
 *
 * @param l - The input data structure that contains rows and columns to iterate over.
 * @return A generator yielding cell coordinates as defined by the Cell type.
 */
export function* iterate(l: Readonly<CellSet>) {
	for (const [x, row] of l) {
		for (const y of row) {
			yield [x, y] satisfies Cell;
		}
	}
}

/**
 * Fills a specified rectangular region with random patterns, modifying the given set of cells.
 *
 * The method iterates over each coordinate in the rectangle defined by the start and end points
 * and randomly decides whether to place a specific pattern (e.g., a glider) at that location.
 * Patterns are placed only if they fit completely within the defined region.
 *
 * @param cells - A map-like structure where the key represents an x-coordinate
 * and the value is a set of y-coordinates, specifying the existing filled cells.
 * @param start - The top-left coordinate of the rectangular region as [x1, y1].
 * @param end - The bottom-right coordinate of the rectangular region as [x2, y2].
 */
export function fillRegionWithRandomPattern(
	cells: Readonly<CellSet>,
	start: [number, number],
	end: [number, number],
) {
	const [x1, y1] = start;
	const [x2, y2] = end;

	if (x1 > x2) throw new Error('x1 must be less than or equal to x2');
	if (y1 > y2) throw new Error('y1 must be less than or equal to y2');

	// For each coordinate on the map
	for (let x = x1; x < x2; x++) {
		for (let y = y1; y < y2; y++) {
			// Check if we should attempt to place a glider at this coordinate
			if (Math.random() > 0.0005) continue;
			// Select a random pattern and rotate it randomly

			const pattern = rotatePatternRandomly(selectRandomPattern());

			// Check if the pattern can fit within bounds
			const canPlaceGlider = pattern.every(
				([dx, dy]) => x + dx < x2 && y + dy < y2,
			);

			if (!canPlaceGlider) continue;

			// Place the pattern
			for (const [dx, dy] of pattern) {
				const newX = x + dx;
				const newY = y + dy;
				const rowSet = cells.get(newX) ?? new Set();
				rowSet.add(newY);
				cells.set(newX, rowSet);
			}
		}
	}
}
