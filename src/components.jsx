import { useWon } from "./board-context";

const Square = ({ value, onclick, index }) => {
  const wonIndices = useWon();
  const classes = wonIndices?.includes(index) ? "square won" : "square";
  return <button className={classes} onClick={() => onclick()}> {value}</button>;
};
const WinnerIs = ({ winnerIs }) => (winnerIs && <p className="winner">winner is {winnerIs}</p>);
const Board = ({ current, onclick }) => (<div className="row">{current.map((val, i) => <Square key={i} index={i} value={val} onclick={() => onclick(i)} />)}</div>);
const History = ({ history, onjump }) => {
  return (<div className="row">{history.length > 0 && history.map((_, i) => <button key={i} onClick={() => onjump(i)}>{i > 0 ? `step ${i}` : "reset"}</button>)}</div>)
};

export { WinnerIs, Board, History };

