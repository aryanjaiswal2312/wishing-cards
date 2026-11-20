import { useCallback, useReducer } from 'react';

interface NavState {
  index: number;
  direction: 1 | -1;
  /** Highest room the visitor may enter. Rooms unlock one at a time. */
  maxUnlocked: number;
}

type NavAction = { type: 'go'; target: number } | { type: 'complete'; from: number };

function makeReducer(total: number) {
  return (state: NavState, action: NavAction): NavState => {
    if (action.type === 'go') {
      const t = action.target;
      if (t < 0 || t >= total || t > state.maxUnlocked || t === state.index) return state;
      return { ...state, index: t, direction: t > state.index ? 1 : -1 };
    }
    // Ignore completions from a room the visitor has already left.
    if (action.from !== state.index) return state;
    const next = Math.min(action.from + 1, total - 1);
    return {
      index: next,
      direction: 1,
      maxUnlocked: Math.max(state.maxUnlocked, next),
    };
  };
}

export function useRoomNavigation(total: number) {
  const [state, dispatch] = useReducer(makeReducer(total), { index: 0, direction: 1, maxUnlocked: 0 });

  const next = useCallback(() => dispatch({ type: 'go', target: state.index + 1 }), [state.index]);
  const prev = useCallback(() => dispatch({ type: 'go', target: state.index - 1 }), [state.index]);
  const complete = useCallback((from: number) => dispatch({ type: 'complete', from }), []);

  return {
    index: state.index,
    direction: state.direction,
    maxUnlocked: state.maxUnlocked,
    canPrev: state.index > 0,
    canNext: state.index < state.maxUnlocked,
    next,
    prev,
    complete,
  };
}
