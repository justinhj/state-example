import React from 'react';
import { useCounterStore } from './store';

const App: React.FC = () => {
  // Access the store's state and actions using Zustand's hook
  const { count, increment, decrement } = useCounterStore();

  // Log initial state when the component mounts (similar to your example)
  React.useEffect(() => {
    console.log('Initial count:', count);

    // Subscribe to state changes (similar to your subscribe example)
    const unsubscribe = useCounterStore.subscribe((state) => {
      console.log('State changed:', state.count);
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default App;
