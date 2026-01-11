const Square = ({ value, onclick }) => {
  return <button className="square" onClick={() => onclick()}> {value}</button>;
};
const WinnerIs = ({ winnerIs }) => (winnerIs && <p className="winner">winner is {winnerIs}</p>);
const Board = ({ current, onclick }) => (<div className="row">{current.map((val, i) => <Square key={i} value={val} onclick={() => onclick(i)} />)}</div>);
const History = ({ history, onjump }) => {
  return (<div className="row">{history.length > 0 && history.map((_, i) => <button key={i} onClick={() => onjump(i)}>{i > 0 ? `step ${i}` : "reset"}</button>)}</div>)
};

export { WinnerIs, Board, History };

