import { WinnerIs, Board, History } from "./components";
import useGameState from "./state";
import "./App.css";

const Game = () => {
  const { state, current, setHistory, setPos, setWinnerIs } = useGameState();

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
