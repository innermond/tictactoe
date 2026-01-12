const WinnerIs = ({ winnerIs }) => (winnerIs && <p className="winner">winner is {winnerIs}</p>);
const History = ({ history, onjump }) => {
  return (<div className="row">{history.length > 0 && history.map((_, i) => <button key={i} onClick={() => onjump(i)}>{i > 0 ? `step ${i}` : "reset"}</button>)}</div>)
};

export { WinnerIs, History };
export { default as Board } from "./board-component";

