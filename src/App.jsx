import { Message, Board, History } from "./components";
import useGameState from "./state";
import { useState } from "react";
import "./App.css";

const Game = () => {
  const [won, setWon] = useState(null);
  const { state, current, setHistory, setPos, setWinnerIs } = useGameState();
  const xo = state.pos % 2 === 0 ? "X" : "O";

  const onclick = (i) => {
    console.log("square clicked");
    const modeAdd = state.pos === state.history.length - 1;

    if (current[i] !== null) return;
    if (state.winnerIs !== null) return;
    console.log(state.pos);
    const fresh = [...current];
    fresh[i] = xo;
    let history;
    if (modeAdd) {
      history = [...state.history, fresh];
    } else {
      history = [...state.history.slice(0, state.pos + 1), fresh];
    }
    const [winner, wonIndices] = checkWinner(fresh);
    if (winner) {
      setWon(wonIndices);
      setWinnerIs(winner);
    }
    setPos(state.pos + 1);
    setHistory(history);
  }

  const onjump = (i) => {
    console.log(`jumped to ${i}`);
    setPos(i);
    setWon(null);
    const [winner, wonIndices] = checkWinner(state.history[i]);
    setWinnerIs(winner);
    if (winner) {
      setWon(wonIndices);
    }
  }

  return <div className="container">
    <Message winnerIs={state.winnerIs} xo={xo} />
    <Board current={current} onclick={onclick} won={won} />
    <History history={state.history} onjump={onjump} />
  </div>
}
const checkWinner = (squares) => {
  const winning = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [x, y, z] of winning) {
    if (!(squares[x] && squares[y] && squares[z])) continue;
    if (squares[x] === squares[y] && squares[y] === squares[z]) {
      return [squares[x], [x, y, z]];
    };
  }
  return [null, null];
};

function App() {
  return <>
    <Game />
  </>
}

export default App;
