import { Cell } from "./cells.ts";

type Pattern = Cell[];

export const glider: Pattern = [
  [0, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
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

export function rotatePatternRandomly(pattern: Pattern): Pattern {
  const rotationMatrix =
    rotationMatrices[Math.floor(Math.random() * rotationMatrices.length)]!;

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
