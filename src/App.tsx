import React, { useState } from 'react';
import { useCounterStore } from './store';

const App: React.FC = () => {
  // Access the store's state and actions using Zustand's hook
  const { count, reset, increment, decrement } = useCounterStore();

  // Local state to manage the step size input
  const [stepSize, setStepSize] = useState<number>(1);

  // Log initial state when the component mounts
  React.useEffect(() => {
    console.log('Initial count:', count);

    // Subscribe to state changes
    const unsubscribe = useCounterStore.subscribe((state) => {
      console.log('State changed:', state.count);
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle input change
  const handleStepSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setStepSize(isNaN(value) ? 0 : value); // Default to 0 if input is invalid
  };

  // Modified increment and decrement to use stepSize
  const handleIncrement = () => {
    increment(stepSize); // Pass stepSize to the store's increment
  };

  const handleDecrement = () => {
    decrement(stepSize); // Pass stepSize to the store's decrement
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div>
      <h1>Counter: {count}</h1>
      <input
        type="number"
        value={stepSize}
        onChange={handleStepSizeChange}
        min="0" // Optional: Prevent negative step sizes
        style={{ margin: '10px', padding: '5px' }}
      />
      <div>
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleDecrement}>Decrement</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default App;
