import { useReducer } from "react";

const SET_HISTORY = 0;
const SET_POS = 1;
const SET_WINNER_IS = 2;

const useGameState = () => {
  const reducer = (s, op) => {
    switch (op.type) {
      case SET_HISTORY:
        return { ...s, history: op.data };
      case SET_POS:
        return { ...s, pos: op.data };
      case SET_WINNER_IS:
        return { ...s, winnerIs: op.data };
      default:
        throw new Error("unknown operation");
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    history: [Array(9).fill(null)],
    pos: 0,
    winnerIs: null,
  });
  const current = state.history[state.pos];
  console.log(current)

  const setHistory = (h) => dispatch({ type: SET_HISTORY, data: h });
  const setPos = (p) => dispatch({ type: SET_POS, data: p });
  const setWinnerIs = (w) => dispatch({ type: SET_WINNER_IS, data: w });

  return { state, current, setHistory, setPos, setWinnerIs };
};

export default useGameState;
