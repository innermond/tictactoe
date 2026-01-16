import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Message, Board, History, Timer } from "./components";
import { STOP } from "./timer-component";
import useGameState from "./state";
import { useState, useRef, useEffect, useEffectEvent, useLayoutEffect, useTransition } from "react";
import "./App.css";
//import { WORK_TERMINATE, WORK_CHECK_WINNER } from "./work-constants.js";

const Game = () => {
  const TIME_PER_MOVE = 5;
  const [won, setWon] = useState(null);
  const { state, current, setHistory, setPos, setWinnerIs } = useGameState();
  const xo = state.pos % 2 === 0 ? "X" : "O";
  const [counting, setCounting] = useState(-1);
  const lastClicked = useRef([]);

  const [isPending, setIsPending] = useState(false);
  const onWinnerChecked = useEffectEvent(evt => {
    const [winner, wonIndices] = evt.payload;
    console.log(evt.target)
    //TODO discriminate between onclick and onjump 
    // onclick
    if (winner && !isonjump.current) {
      setWon(wonIndices);
      setWinnerIs(winner);
      setCounting(STOP);
    }
    // onjump
    if (isonjump.current) {
      setWon(wonIndices);
      if (winner) {
        setWinnerIs(winner);
      }
    }

    setIsPending(false);
  });
  useEffect(() => {
    const unlisten = listen("winner-checked", onWinnerChecked);
    return () => unlisten.then(fn => fn());
  }, []);

  const onExpired = (expired) => {
    if (expired) {
      setWon(null);
      setWinnerIs(xo == "X" ? "O" : "X");
      setCounting(STOP);
      lastClicked.current = Array(9).fill(null).map((_, i) => i);
    }
  };

  const workerRef = useRef(null);
  useEffect(() => {
    const worker = new Worker(
      new URL("./worker.js", import.meta.url),
      { type: "module" }
    );
    worker.onmessage = e => console.log("message from worker", e.data)

    workerRef.current = worker;

    return () => {
      worker.terminate();
    }

  }, []);


  const isonjump = useRef(false);

  const onclick = async (i) => {
    // run CPU bound code in worker thread
    //workerRef.current.postMessage({ kind: WORK_CHECK_WINNER, payload: [], id: crypto.randomUUID() });
    // kill it later
    //setTimeout(() => {
    //workerRef.current.postMessage({ kind: WORK_TERMINATE });
    //}, 1000);
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
    setIsPending(true);
    isonjump.current = false;
    checkWinner(fresh);
    //startTransition(async () => {
    //  const [winner, wonIndices] = await checkWinner(fresh);
    //  if (winner) {
    //    setWon(wonIndices);
    //    setWinnerIs(winner);
    //    setCounting(STOP);
    //  }
    //});
    //startTransition(() => {
    //  checkWinner(fresh).then(([winner, wonIndices]) => {
    //    if (winner) {
    //      setWon(wonIndices);
    //      setWinnerIs(winner);
    //      setCounting(STOP);
    //    }
    //  });
    //});
    setPos(state.pos + 1);
    setHistory(history);
    if (lastClicked.current.length === 9) {
      setCounting(STOP);
      setWinnerIs("nobody");
    };
  }

  //const [isPending, startTransition] = useTransition();

  const onjump = async (i) => {
    setPos(i);
    setWon(null);
    setCounting(STOP);
    lastClicked.current = state.history[i].reduce((acc, elem, idx) => {
      if (elem === null) return acc;
      acc.push(idx);
      return acc;
    }, []);
    setIsPending(true);
    isonjump.current = true;
    checkWinner(state.history[i]);
    //startTransition(async () => {
    //  const [winner, wonIndices] = await checkWinner(state.history[i]);
    //  setWinnerIs(winner);
    //  if (winner) {
    //    setWon(wonIndices);
    //  }
    //});
  }

  useLayoutEffect(() => {
    console.log("body", isPending)
    if (isPending) {
      document.body.classList.add("is-pending");
    } else {
      document.body.classList.remove("is-pending");
    }
    return () => {
      document.body.classList.remove("is-pending");
    };
  }, [isPending]);

  return <div className="container">
    {isPending ? "WAIT..." : "DONE"}
    <Message winnerIs={state.winnerIs} xo={xo} />
    <Timer countdown={TIME_PER_MOVE} start={counting} onExpired={onExpired} />
    <Board current={current} onclick={onclick} won={won} />
    <History history={state.history} onjump={onjump} />
  </div>
}

//const checkWinner = (squares) => {
//return new Promise(resolve => {
//  const winning = [
//    [0, 1, 2],
//    [3, 4, 5],
//    [6, 7, 8],
//    [0, 3, 6],
//    [1, 4, 7],
//    [2, 5, 8],
//    [0, 4, 8],
//    [2, 4, 6],
//  ];
//  let result = [null, null];
//  for (const [x, y, z] of winning) {
//    if (!(squares[x] && squares[y] && squares[z])) continue;
//    if (squares[x] === squares[y] && squares[y] === squares[z]) {
//      result = [squares[x], [x, y, z]];
//    };
//  }
//  setTimeout(() => resolve(result), 1000);
//});
//};

//const checkWinner = async (squares) => {
//  try {
//    const result = await invoke('check_winner', { squares });
//    return result;
//  } catch (error) {
//    console.error('Error invoking check_winner:', error);
//  }
//};

const checkWinner = (squares) => {
  try {
    invoke('check_winner', { squares });
  } catch (error) {
    console.error('Error invoking check_winner:', error);
  }
};

const App = () => {
  return <>
    <Game />
  </>
}

export default App;
