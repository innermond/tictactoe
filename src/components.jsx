const Message = ({ winnerIs, xo }) => (winnerIs ?
  <p className="winner">winner is {winnerIs}</p> :
  <p>{`next move is ${xo}`}</p>
);
const History = ({ history, onjump }) => {
  return (<div className="row">{history.length > 0 && history.map((_, i) => <button key={i} onClick={() => onjump(i)}>{i > 0 ? `step ${i}` : "reset"}</button>)}</div>)
};

export { Message, History };
export { default as Board } from "./board-component";
export { default as Timer } from "./timer-component";

