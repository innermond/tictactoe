import { useState } from "react";

const useGameState = () => {
  const [state, setState] = useState({
    history: [Array(9).fill(null)],
    pos: 0,
    winnerIs: null,
  });
  const current = state.history[state.pos];
  console.log(current)

  const setHistory = (h) => setState(prev => {
    const s = { ...prev };
    s.history = h;
    return s;
  });
  const setPos = (p) => setState(prev => {
    const s = { ...prev };
    s.pos = p;
    return s;
  });
  const setWinnerIs = (w) => setState(prev => {
    const s = { ...prev };
    s.winnerIs = w;
    return s;
  });

  return { state, current, setHistory, setPos, setWinnerIs };
};

export default useGameState;
