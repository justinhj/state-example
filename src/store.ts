import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: (step: number) => void;
  decrement: (step: number) => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: (step: number) => set((state) => ({ count: state.count + step })),
  decrement: (step: number) => set((state) => ({ count: state.count - step })),
  reset: () => set((state) => ({ count: state.count = 0 })),
}));
