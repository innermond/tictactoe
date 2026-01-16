import WonContext, { useWon } from "./board-context";

const Square = ({ value, onclick, index }) => {
  const wonIndices = useWon();
  const classes = wonIndices?.includes(index) ? "square won" : "square";
  return <button className={classes} onClick={() => {
    console.log("square click", value)
    onclick();
  }}> {value}</button>;
};

const Board = ({ current, onclick, won }) => (<WonContext.Provider value={won}>
  <div className="row">{current.map((val, i) => <Square key={i} index={i} value={val} onclick={() => onclick(i)} />)}</div>
</WonContext.Provider>);

export default Board;
