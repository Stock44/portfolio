import { Cell } from "./cells.ts";

type Pattern = Cell[];

export const glider: Pattern = [
  [0, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
];

export const lightSpaceship: Pattern = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 0],
  [1, 4],
  [2, 4],
  [3, 0],
  [3, 3],
];

export const toad: Pattern = [
  [0, 2],
  [1, 0],
  [1, 3],
  [2, 0],
  [2, 3],
  [3, 1],
];

export const middleSpaceship: Pattern = [
  [0, 2],
  [1, 0],
  [1, 4],
  [2, 5],
  [3, 0],
  [3, 5],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [4, 5],
];

const rotationMatrices: [[number, number], [number, number]][] = [
  [
    [1, 0], // 0 deg
    [0, 1],
  ],
  [
    [0, -1], // 90 deg
    [1, 0],
  ],
  [
    [-1, 0], // 180 deg
    [0, -1],
  ],
  [
    [0, 1], // 270 deg
    [-1, 0],
  ],
];

function mulMatrix(lhs: number[][], rhs: number[][]) {
  if (!lhs[0]) return []; // If there is no first row, there is nothing to be done

  // the number of columns must be equal to rows
  if (lhs[0].length !== rhs.length) {
    throw new Error("Cannot multiply matrices with different dimensions");
  }

  const m = lhs.length;

  if (!rhs[0]) return Array.from({ length: m }, () => []); // If there is no first row of the end array, return an array full of empty arrays

  const p = rhs[0].length;

  const result: number[][] = [];

  for (let rowIndex = 0; rowIndex < m; rowIndex++) {
    const lhsRow = lhs[rowIndex]!;
    const resultRow = [];
    for (let colIndex = 0; colIndex < p; colIndex++) {
      resultRow.push(
        lhsRow.reduce(
          (acc, v, zipIndex) => acc + v * rhs[zipIndex]![colIndex]!, // for lhs, zipIndex is the column number, for rhs it is the rows
          0,
        ),
      );
    }
    result.push(resultRow);
  }
  return result;
}

export function selectRandom<T>(x: T[]): T {
  if (x.length === 0) throw new Error("Cannot select random from empty array");

  return x[Math.floor(Math.random() * x.length)]!;
}

export function rotatePatternRandomly(pattern: Pattern): Pattern {
  const rotationMatrix = selectRandom(rotationMatrices);

  return pattern.map((cell) => {
    const rotatedCell = mulMatrix(
      rotationMatrix,
      cell.map((x) => [x]),
    );

    const x = rotatedCell[0]![0]!;
    const y = rotatedCell[1]![0]!;

    return [x, y];
  });
}

export function selectRandomPattern() {
  return selectRandom([lightSpaceship, glider, toad, middleSpaceship]);
}
