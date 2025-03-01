import { create } from 'zustand';

// Define types for the game state
interface Cell {
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

interface MinesweeperState {
  grid: Cell[][];
  rows: number;
  cols: number;
  mineCount: number;
  gameStatus: 'playing' | 'won' | 'lost';
  initializeGame: (rows: number, cols: number, mineCount: number) => void;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
}

// Create an empty grid
const createEmptyGrid = (rows: number, cols: number): Cell[][] =>
  Array(rows)
    .fill(null)
    .map(() =>
      Array(cols).fill(null).map(() => ({
        hasMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

// Place mines randomly, ensuring the first clicked cell is safe
const placeMines = (grid: Cell[][], mineCount: number, safeRow: number, safeCol: number) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let minesPlaced = 0;
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!newGrid[row][col].hasMine && !(row === safeRow && col === safeCol)) {
      newGrid[row][col].hasMine = true;
      minesPlaced++;
    }
  }
  return newGrid;
};

// Calculate neighbor mine counts for all cells
const calculateNeighborMines = (grid: Cell[][]) => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].hasMine) continue;

      let mineCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            grid[newRow][newCol].hasMine
          ) {
            mineCount++;
          }
        }
      }
      grid[row][col].neighborMines = mineCount;
    }
  }
};

// Check if the game is won
const checkWin = (grid: Cell[][]): boolean => {
  return grid.every((row) =>
    row.every((cell) => (cell.hasMine ? !cell.isRevealed : cell.isRevealed))
  );
};

// Reveal adjacent cells recursively for flood-fill
const revealAdjacentCells = (
  grid: Cell[][],
  row: number,
  col: number,
  rows: number,
  cols: number,
  visited: Set<string> = new Set()
) => {
  // Prevent infinite recursion by tracking visited cells
  const key = `${row},${col}`;
  if (visited.has(key)) return;
  visited.add(key);

  const cell = grid[row][col];
  if (cell.isRevealed || cell.isFlagged || cell.hasMine) return;

  cell.isRevealed = true;

  // Only recurse if this cell has no neighbor mines
  if (cell.neighborMines === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols
        ) {
          revealAdjacentCells(grid, newRow, newCol, rows, cols, visited);
        }
      }
    }
  }
};

export const useMinesweeperStore = create<MinesweeperState>((set, get) => ({
  grid: [],
  rows: 0,
  cols: 0,
  mineCount: 0,
  gameStatus: 'playing',

  initializeGame: (rows: number, cols: number, mineCount: number) => {
    const grid = createEmptyGrid(rows, cols);
    set({
      grid,
      rows,
      cols,
      mineCount,
      gameStatus: 'playing',
    });
  },

  revealCell: (row: number, col: number) => {
    const { grid, rows, cols, mineCount, gameStatus } = get();
    if (gameStatus !== 'playing' || row < 0 || row >= rows || col < 0 || col >= cols) return;

    let newGrid = grid.map((r) => r.map((c) => ({ ...c })));

    // If this is the first reveal, place mines and calculate neighbors
    if (!newGrid.some((r) => r.some((c) => c.isRevealed))) {
      newGrid = placeMines(newGrid, mineCount, row, col);
      calculateNeighborMines(newGrid);
    }

    const cell = newGrid[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    // Handle mine hit
    if (cell.hasMine) {
      cell.isRevealed = true;
      set({ grid: newGrid, gameStatus: 'lost' });
      return;
    }

    // Reveal the clicked cell and its neighbors if applicable
    revealAdjacentCells(newGrid, row, col, rows, cols);

    // Check for win condition
    const hasWon = checkWin(newGrid);
    set({
      grid: newGrid,
      gameStatus: hasWon ? 'won' : 'playing',
    });
  },

  toggleFlag: (row: number, col: number) => {
    const { grid, rows, cols, gameStatus } = get();
    if (gameStatus !== 'playing' || row < 0 || row >= rows || col < 0 || col >= cols) return;

    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
    const cell = newGrid[row][col];
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      set({ grid: newGrid });
    }
  },

  resetGame: () => {
    const { rows, cols, mineCount } = get();
    const grid = createEmptyGrid(rows, cols);
    set({
      grid,
      gameStatus: 'playing',
    });
  },
}));
