import { enableMapSet, produce } from "immer";

enableMapSet();

export type Cell = [number, number];

export type CellSet = Map<number, Set<number>>;

export function makeCellSet(): CellSet {
  return new Map();
}

/**
 * Adds new cells to a CellSet.
 *
 * @param {...Cell[]} cells - The cells to add. Each cell is represented as a tuple [x, y], where x is the row and y is the column.
 * @returns {CellSet} A new, updated CellSet
 */
export const addCells = produce((draft: CellSet, ...cells: Cell[]) => {
  cells.forEach(([x, y]) => {
    const row = draft.get(x);
    if (row) {
      row.add(y);
    } else {
      draft.set(x, new Set([y]));
    }
  });
});

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
 * @param {CellSet} set - The base cell set
 * @param {...Cell[]} cells - The cell(s) to remove (as an array of [x, y] pairs).
 * @returns {CellSet} A new, updated set
 */
export const removeCells = produce((draft: CellSet, ...cells: Cell[]) => {
  cells.forEach(([x, y]) => {
    const row = draft.get(x);

    if (row) {
      row.delete(y);

      if (row.size === 0) {
        draft.delete(x);
      }
    }
  });
});

/**
 * Toggles the presence of a cell in a CellSet at the specified coordinates.
 *
 * @param {CellSet} draft - The CellSet object to use.
 * @param {number} x - The x-coordinate of the cell.
 * @param {number} y - The y-coordinate of the cell.
 * @returns {CellSet} A new, updated set
 */
export const toggleCells = produce((draft: CellSet, ...cells: Cell[]) => {
  cells.forEach(([x, y]) => {
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
  });
});

export function union(l: Readonly<CellSet>, r: Readonly<CellSet>): CellSet {
  const newSet: CellSet = new Map(l);
  r.forEach((v, k) => {
    const set = newSet.get(k);
    if (set) {
      v.forEach((setValue) => {
        set.add(setValue);
      });
    } else {
      newSet.set(k, new Set(v));
    }
  });
  return newSet;
}

export function* iterate(l: Readonly<CellSet>) {
  for (const [x, row] of l) {
    for (const y of row) {
      yield [x, y] satisfies Cell;
    }
  }
}
