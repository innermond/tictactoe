import {useState, useCallback} from "react";

const ZERO = 0;
const PENDING = 1;
const ERROR = 2;
const READY = 3;

const hook = (fn, initialResult) => {
  const [status, setStatus] = useState(ZERO);
  const [result, setResult] = useState(initialResult);

  const doFn = useCallback(async (...params) => {
    setStatus(PENDING);
    setResult(null);
    try {
      const out = await fn(...params);
      setResult(out);
      setStatus(READY);
      return out;
    } catch (e) {
      setResult(e);
      setStatus(ERROR);
      throw e;
    } 
  }, [fn]);

  return [status, doFn, result];
};

export default hook;
export { ZERO,  PENDING, ERROR, READY };
