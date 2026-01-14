import { WORK_TERMINATE, WORK_CHECK_WINNER } from "./work-constants.js";

let doTerminateAll = false;
let activeRuns = [];
let currentRunId = null;


const checkWinner = async (payload, id) => {
  console.log(`call id ${id}`)
  doTerminateAll = false;
  activeRuns.push(id);
  currentRunId = id;


  let startTime = performance.now();
  let result = null;
  // CPU bound here
  for (let i = 0; i < 300_000_000; i++) {
    if (i % 100_000_000 === 0) {
      await new Promise(r => setTimeout(r, 500));
      if (doTerminateAll) {
        console.log("terminate all")
        result = [2, 4];
        break;
      }
      if (currentRunId !== id) {
        console.log(`terminate ${id} with ${payload} from ${currentRunId}`)
        result = [2, 4];
        const index = activeRuns.indexOf(id);
        if (index !== -1) activeRuns.splice(index, 1);
        break;
      }
    }
  }

  if (result === null) {
    result = [4, 2];
    const index = activeRuns.indexOf(id);
    if (index !== -1) activeRuns.splice(index, 1);
  }

  let endTime = performance.now()
  const elapsed = endTime - startTime;
  console.log(`${result} after 1s? elapsed time is ${elapsed / 1_000}??`)
  self.postMessage(result);
};

onmessage = async (e) => {
  switch (e.data.kind) {
    case (WORK_CHECK_WINNER):
      await checkWinner(e.data.payload, e.data.id);
      break;

    case (WORK_TERMINATE):
      doTerminateAll = true;
      console.log(`doTerminateAll ${doTerminateAll}`)
      break;
  }
}
