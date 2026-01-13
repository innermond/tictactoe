import { Message, Board, History, Timer } from "./components";
import { STOP } from "./timer-component";
import useGameState from "./state";
import { useState, useRef } from "react";
import "./App.css";

const Game = () => {
  const TIME_PER_MOVE = 5;
  const [won, setWon] = useState(null);
  const { state, current, setHistory, setPos, setWinnerIs } = useGameState();
  const xo = state.pos % 2 === 0 ? "X" : "O";
  const [counting, setCounting] = useState(-1);
  const lastClicked = useRef([]);
  const onExpired = (expired) => {
    if (expired) {
      setWon(null);
      setWinnerIs(xo == "X" ? "O" : "X");
      setCounting(STOP);
      lastClicked.current = Array(9).fill(null).map((_, i) => i);
    }
  };

  const onclick = (i) => {
    if (current[i] !== null) return;
    if (state.winnerIs !== null) return;

    if (lastClicked.current.length > 0 && lastClicked.current.includes(i)) return;
    lastClicked.current.push(i);
    setCounting(i);

    const modeAdd = state.pos === state.history.length - 1;

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
      setCounting(STOP);
    }
    setPos(state.pos + 1);
    setHistory(history);
    console.log("move", lastClicked.current.length === 9)
    if (lastClicked.current.length === 9) {
      setCounting(STOP);
      setWinnerIs("nobody");
    };
  }

  const onjump = (i) => {
    console.log(`jumped to ${i} counting ${counting}`);
    setPos(i);
    setWon(null);
    setCounting(STOP);
    lastClicked.current = state.history[i].reduce((acc, elem, idx) => {
      console.log(acc, elem, idx)
      if (elem === null) return acc;
      acc.push(idx);
      return acc;
    }, []);
    console.log("lastClicked", lastClicked.current)
    const [winner, wonIndices] = checkWinner(state.history[i]);
    setWinnerIs(winner);
    if (winner) {
      setWon(wonIndices);
    }
  }

  return <div className="container">
    <Message winnerIs={state.winnerIs} xo={xo} />
    <Timer countdown={TIME_PER_MOVE} start={counting} onExpired={onExpired} />
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
