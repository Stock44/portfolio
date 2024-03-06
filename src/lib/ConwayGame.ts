type Cell = [number, number];

export default class GameOfLife {
  private rows: number;
  private columns: number;

  private cellColor: string;

  private activeCells: Map<number, Set<number>> = new Map();
  private liveCells: Map<number, Set<number>> = new Map();

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
    } else {
      this.liveCells.set(x, new Set([y]));
    }
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

  addActiveCell(x: number, y: number) {
    if (this.activeCells.has(x)) {
      this.activeCells.get(x)!.add(y);
    } else {
      this.activeCells.set(x, new Set([y]));
    }
  }

  processCellNeighborCount(
    x: number,
    y: number,
    isActive: boolean = true,
  ): number {
    let liveNeighbors = 0;
    const top = x === 0 ? this.rows - 1 : x - 1;
    const bottom = x === this.rows - 1 ? 0 : x + 1;
    const left = y === 0 ? this.columns - 1 : y - 1;
    const right = y === this.columns - 1 ? 0 : y + 1;

    if (this.liveCells.has(top)) {
      const topCells = this.liveCells.get(top)!;
      if (topCells.has(y)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(top, y);
      }
      if (topCells.has(left)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(top, left);
      }

      if (topCells.has(right)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(top, right);
      }
    } else if (isActive) {
      this.addActiveCell(top, left);
      this.addActiveCell(top, y);
      this.addActiveCell(top, right);
    }
    if (this.liveCells.has(bottom)) {
      const bottomCells = this.liveCells.get(bottom)!;
      if (bottomCells.has(y)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(bottom, y);
      }
      if (bottomCells.has(left)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(bottom, left);
      }

      if (bottomCells.has(right)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(bottom, right);
      }
    } else if (isActive) {
      this.addActiveCell(bottom, left);
      this.addActiveCell(bottom, y);
      this.addActiveCell(bottom, right);
    }

    if (this.liveCells.has(x)) {
      const row = this.liveCells.get(x)!;
      if (row.has(left)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(x, left);
      }
      if (row.has(right)) {
        liveNeighbors++;
      } else if (isActive) {
        this.addActiveCell(x, right);
      }
    } else if (isActive) {
      this.addActiveCell(x, left);
      this.addActiveCell(x, right);
    }

    return liveNeighbors;
  }

  step() {
    const cellsToKill: Array<Cell> = [];

    const cellsToAdd: Array<Cell> = [];

    const emptyRows: Set<number> = new Set();

    for (const [x, row] of this.liveCells) {
      for (const y of row) {
        const liveNeighbors = this.processCellNeighborCount(x, y);

        if (liveNeighbors < 2 || liveNeighbors > 3) {
          cellsToKill.push([x, y]);
        }
      }
    }

    for (const [x, row] of this.activeCells) {
      for (const y of row) {
        const liveNeighbors = this.processCellNeighborCount(x, y, false);

        if (liveNeighbors === 3) {
          cellsToAdd.push([x, y]);
        }
      }
    }

    this.activeCells.clear();

    for (const [x, y] of cellsToAdd) {
      if (this.liveCells.has(x)) {
        this.liveCells.get(x)!.add(y);
      } else {
        this.liveCells.set(x, new Set());
        this.liveCells.get(x)!.add(y);
      }
    }

    for (const [x, y] of cellsToKill) {
      const cells = this.liveCells.get(x)!;
      cells.delete(y);
      if (cells.size === 0) {
        emptyRows.add(x);
      }
    }

    for (const row of emptyRows) {
      this.liveCells.delete(row);
    }
  }
}
