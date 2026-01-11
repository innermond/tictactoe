import { useState } from "react";
import "./App.css";

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [pos, setPos] = useState(0);
  const [winnerIs, setWinnerIs] = useState(null);
  const current = history[pos];

  const onclick = (i) => {
    console.log("square clicked");
    const modeAdd = pos === history.length - 1;
    console.log(modeAdd);

    if (current[i] !== null) return;
    if (winnerIs !== null) return;
    const xo = pos % 2 === 0 ? "X" : "O";
    console.log(pos);
    const fresh = [...current];
    fresh[i] = xo;
    if (modeAdd) {
      history.push(fresh);
    } else {
      history.splice(pos + 1);
      history.push(fresh);
    }
    const winner = checkWinner(fresh);
    if (winner) setWinnerIs(winner);
    setPos((p) => { return p + 1; });
    setHistory([...history]);
  }

  const onjump = (i) => {
    console.log(`jumped to ${i}`);
    setPos(i);
    const winner = checkWinner(history[i]);
    setWinnerIs(winner);
  }

  return <div className="container">
    <WinnerIs winnerIs={winnerIs} />
    <Board current={current} onclick={onclick} />
    <History history={history} onjump={onjump} />
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
    console.log(x, y, z, squares[x], squares[y], squares[z]);
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
