import { createContext, useContext } from "react";

const WonContext = createContext(null);

const useWon = () => {
  const ctx = useContext(WonContext);
  if (ctx === undefined) {
    throw new Error("no context WonContext");
  }
  return ctx;
}

export default WonContext;
export { useWon };
