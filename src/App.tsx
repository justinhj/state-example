import React from 'react';
import { useMinesweeperStore } from './store';

const App: React.FC = () => {
  const { grid, gameStatus, initializeGame, revealCell, toggleFlag, resetGame } =
    useMinesweeperStore();

  React.useEffect(() => {
    initializeGame(10, 10, 10); // 10x10 grid with 10 mines
  }, [initializeGame]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Minesweeper - {gameStatus}</h1>
      <button style={styles.resetButton} onClick={resetGame}>
        Reset Game
      </button>
      <div style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(rowIndex, colIndex);
                }}
                style={{
                  ...styles.cell,
                  ...(cell.isRevealed
                    ? cell.hasMine
                      ? styles.mineCell
                      : styles.revealedCell
                    : styles.hiddenCell),
                }}
                disabled={cell.isRevealed || gameStatus !== 'playing'}
              >
                {cell.isRevealed ? (
                  cell.hasMine ? (
                    '💣'
                  ) : cell.neighborMines > 0 ? (
                    <span style={styles.number(cell.neighborMines)}>
                      {cell.neighborMines}
                    </span>
                  ) : (
                    ''
                  )
                ) : cell.isFlagged ? (
                  '🚩'
                ) : (
                  ''
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// CSS styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1rem',
    textTransform: 'capitalize',
  },
  resetButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    transition: 'background-color 0.2s',
  },
  grid: {
    display: 'inline-grid',
    gap: '2px',
    backgroundColor: '#999',
    padding: '2px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  row: {
    display: 'flex',
    gap: '2px',
  },
  cell: {
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
    transition: 'background-color 0.2s',
  },
  hiddenCell: {
    backgroundColor: '#c0c0c0',
    borderTop: '3px solid #fff',
    borderLeft: '3px solid #fff',
    borderBottom: '3px solid #7b7b7b',
    borderRight: '3px solid #7b7b7b',
  },
  revealedCell: {
    backgroundColor: '#d9d9d9',
    border: '1px solid #999',
  },
  mineCell: {
    backgroundColor: '#ff4d4d',
    border: '1px solid #999',
  },
  number: (mines: number): React.CSSProperties => ({
    color: [
      '#0000ff', // 1
      '#008000', // 2
      '#ff0000', // 3
      '#000080', // 4
      '#800000', // 5
      '#008080', // 6
      '#000000', // 7
      '#808080', // 8
    ][mines - 1] || '#000',
    fontWeight: 'bold',
  }),
};

export default App;
