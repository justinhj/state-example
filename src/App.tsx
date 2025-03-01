import React from 'react';
import { useMinesweeperStore } from './store';

const App: React.FC = () => {
  const { grid, gameStatus, initializeGame, revealCell, toggleFlag, resetGame } =
    useMinesweeperStore();

  React.useEffect(() => {
    initializeGame(10, 10, 10); // 10x10 grid with 10 mines
  }, [initializeGame]);

  return (
    <div>
      <h1>Minesweeper - {gameStatus}</h1>
      <button onClick={resetGame}>Reset</button>
      <div style={{ display: 'grid', gap: '2px' }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '2px' }}>
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(rowIndex, colIndex);
                }}
                style={{
                  width: '30px',
                  height: '30px',
                  background: cell.isRevealed ? '#ddd' : '#aaa',
                }}
              >
                {cell.isRevealed
                  ? cell.hasMine
                    ? '💣'
                    : cell.neighborMines || ''
                  : cell.isFlagged
                  ? '🚩'
                  : ''}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
