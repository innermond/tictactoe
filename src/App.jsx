import { useState } from "react";
import "./App.css";

const Game = () => {
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

  const onclick = (i) => {
    console.log("square clicked");
    const modeAdd = state.pos === state.history.length - 1;

    if (current[i] !== null) return;
    if (state.winnerIs !== null) return;
    const xo = state.pos % 2 === 0 ? "X" : "O";
    console.log(state.pos);
    const fresh = [...current];
    fresh[i] = xo;
    if (modeAdd) {
      state.history.push(fresh);
    } else {
      state.history.splice(state.pos + 1);
      state.history.push(fresh);
    }
    const winner = checkWinner(fresh);
    if (winner) setWinnerIs(winner);
    setPos(state.pos + 1);
    setHistory([...state.history]);
  }

  const onjump = (i) => {
    console.log(`jumped to ${i}`);
    setPos(i);
    const winner = checkWinner(state.history[i]);
    setWinnerIs(winner);
  }

  return <div className="container">
    <WinnerIs winnerIs={state.winnerIs} />
    <Board current={current} onclick={onclick} />
    <History history={state.history} onjump={onjump} />
  </div>
}

const Square = ({ value, onclick }) => {
  return <button className="square" onClick={() => onclick()}> {value}</button>;
};

const WinnerIs = ({ winnerIs }) => (winnerIs && <p className="winner">winner is {winnerIs}</p>);

const Board = ({ current, onclick }) => (<div className="row">{current.map((val, i) => <Square key={i} value={val} onclick={() => onclick(i)} />)}</div>);

const History = ({ history, onjump }) => {
  return (<div className="row">{history.length > 0 && history.map((_, i) => <button key={i} onClick={() => onjump(i)}>{i > 0 ? `step ${i}` : "reset"}</button>)}</div>)
};

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
      return squares[x];
    };
  }
  return null;
};

function App() {
  return <>
    <Game />
  </>
}

export default App;
