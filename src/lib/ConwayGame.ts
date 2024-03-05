export default class GameOfLife {
  rows: number;
  columns: number;
  cellColor: string;

  liveCells: Map<number, Set<number>> = new Map();

  constructor(rows: number, columns: number, cellColor: string) {
    this.rows = rows;
    this.columns = columns;
    this.cellColor = cellColor;
  }

  setCellColor(cellColor: string) {
    this.cellColor = cellColor;
  }

  setGridSize(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
  }

  toggleCell(x: number, y: number) {
    const row = this.liveCells.get(x);

    if (row) {
      if (row.has(y)) {
        row.delete(y);

        if (row.size === 0) {
          this.liveCells.delete(x);
        }
      } else {
        row.add(y);
      }
      return;
    }

    this.liveCells.set(x, new Set());

    this.liveCells.get(x)!.add(y);
  }

  isCellAlive(x: number, y: number) {
    const row = this.liveCells.get(x);
    if (!row) {
      return false;
    }

    return row.has(y);
  }

  drawLiveCells(
    cellWidth: number,
    cellHeight: number,
    ctx: OffscreenCanvasRenderingContext2D,
  ) {
    ctx.fillStyle = this.cellColor;
    for (const [row, cells] of this.liveCells) {
      for (const cell of cells) {
        ctx.fillRect(row * cellWidth, cell * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  step() {
    const cellsToKill: Array<[number, number]> = [];

    const emptyCellsToCheck: Array<[number, number]> = [];

    const cellsToAdd: Array<[number, number]> = [];

    const emptyRows: Set<number> = new Set();

    for (const [row, cells] of this.liveCells) {
      for (const cell of cells) {
        let liveNeighbors = 0;
        const topRow = row === 0 ? this.rows - 1 : row - 1;
        const bottomRow = row === this.rows - 1 ? 0 : row + 1;
        const leftColumn = cell === 0 ? this.columns - 1 : cell - 1;
        const rightColumn = cell === this.columns - 1 ? 0 : cell + 1;

        if (this.liveCells.has(topRow)) {
          const topCells = this.liveCells.get(topRow)!;
          if (topCells.has(cell)) {
            liveNeighbors++;
          } else {
            emptyCellsToCheck.push([topRow, cell]);
          }
          if (topCells.has(leftColumn)) {
            liveNeighbors++;
          } else {
            emptyCellsToCheck.push([topRow, leftColumn]);
          }

          if (topCells.has(rightColumn)) {
            liveNeighbors++;
          } else {
            emptyCellsToCheck.push([topRow, rightColumn]);
          }
        } else {
          emptyCellsToCheck.push(
            [topRow, leftColumn],
            [topRow, rightColumn],
            [topRow, cell],
          );
        }
        if (this.liveCells.has(bottomRow)) {
          const bottomCells = this.liveCells.get(bottomRow)!;
          if (bottomCells.has(cell)) {
            liveNeighbors++;
          } else {
            emptyCellsToCheck.push([bottomRow, cell]);
          }
          if (bottomCells.has(leftColumn)) {
            liveNeighbors++;
          } else {
            emptyCellsToCheck.push([bottomRow, leftColumn]);
          }

          if (bottomCells.has(rightColumn)) {
            liveNeighbors++;
          } else {
            emptyCellsToCheck.push([bottomRow, rightColumn]);
          }
        } else {
          emptyCellsToCheck.push(
            [bottomRow, leftColumn],
            [bottomRow, rightColumn],
            [bottomRow, cell],
          );
        }

        if (cells.has(leftColumn)) {
          liveNeighbors++;
        } else {
          emptyCellsToCheck.push([row, leftColumn]);
        }
        if (cells.has(rightColumn)) {
          liveNeighbors++;
        } else {
          emptyCellsToCheck.push([row, rightColumn]);
        }

        if (liveNeighbors < 2 || liveNeighbors > 3) {
          cellsToKill.push([row, cell]);
        }
      }
    }

    for (const [row, column] of emptyCellsToCheck) {
      let liveNeighbors = 0;
      const topRow = row === 0 ? this.rows - 1 : row - 1;
      const bottomRow = row === this.rows - 1 ? 0 : row + 1;
      const leftColumn = column === 0 ? this.columns - 1 : column - 1;
      const rightColumn = column === this.columns - 1 ? 0 : column + 1;

      if (this.liveCells.has(topRow)) {
        const topCells = this.liveCells.get(topRow)!;
        liveNeighbors += topCells.has(column) ? 1 : 0;
        liveNeighbors += topCells.has(leftColumn) ? 1 : 0;
        liveNeighbors += topCells.has(rightColumn) ? 1 : 0;
      }
      if (this.liveCells.has(bottomRow)) {
        const bottomCells = this.liveCells.get(bottomRow)!;
        liveNeighbors += bottomCells.has(column) ? 1 : 0;
        liveNeighbors += bottomCells.has(leftColumn) ? 1 : 0;
        liveNeighbors += bottomCells.has(rightColumn) ? 1 : 0;
      }

      if (this.liveCells.has(row)) {
        const cells = this.liveCells.get(row)!;
        liveNeighbors += cells.has(leftColumn) ? 1 : 0;
        liveNeighbors += cells.has(rightColumn) ? 1 : 0;
      }

      if (liveNeighbors === 3) {
        cellsToAdd.push([row, column]);
      }
    }

    for (const [row, column] of cellsToAdd) {
      if (this.liveCells.has(row)) {
        this.liveCells.get(row)!.add(column);
      } else {
        this.liveCells.set(row, new Set());
        this.liveCells.get(row)!.add(column);
      }
    }

    for (const [row, column] of cellsToKill) {
      const cells = this.liveCells.get(row)!;
      cells.delete(column);
      if (cells.size === 0) {
        emptyRows.add(row);
      }
    }

    for (const row of emptyRows) {
      this.liveCells.delete(row);
    }
  }
}
