import { useRef, useState, useEffect } from "react";

const STEP = 10;
const STOP = -1;
const format = (t) => {
  const sec = String(Math.trunc(t / 1000)).padStart(2, "0");
  const milli = String(Math.abs(t % 1000)).padStart(3, "0");
  return `${sec}.${milli}`;
}

const Timer = ({ countdown, start, onExpired }) => {
  let time = useRef(countdown * 1000);
  const timmerId = useRef(null);
  const [display, setDisplay] = useState(time.current);

  useEffect(() => {
    const cleanup = () => {
      clearInterval(timmerId.current);
      timmerId.current = null;
    };

    time.current = countdown * 1000;
    setDisplay(time.current);

    if (start === STOP) {
      cleanup();
      return;
    }

    timmerId.current = setInterval(() => {
      time.current -= STEP;
      if (time.current <= 0) {
        onExpired(true);
        cleanup();
        setDisplay(0);
        return;
      }
      setDisplay(time.current);
      if (start === STOP) {
        cleanup();
      }
    }, STEP);

    return cleanup;
  }, [start, onExpired]);

  return <p>{format(display)}</p>
}

export default Timer;
export { STOP };
