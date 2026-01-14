import { WORK_TERMINATE, WORK_CHECK_WINNER } from "./work-constants.js";

let doTerminateAll = false;
let activeRuns = [];

const giveControlToEventLoop = () => new Promise(r => setTimeout(r, 500));

const checkWinner = async (payload, id) => {
  console.log(`call id ${id}`)
  doTerminateAll = false;
  activeRuns.push(id);

  let startTime = performance.now();
  const val = await new Promise((resolve) => setTimeout(async () => {
    // CPU bound here
    for (let i = 0; i < 300_000_000; i++) {
      if (i % 100_000_000 === 0) {
        await giveControlToEventLoop();
        if (doTerminateAll) {
          console.log("terminate all")
          resolve([2, 4]);
          return;
        }
        const index = activeRuns.indexOf(id);
        if ((activeRuns.length > 1 && index < activeRuns.length - 1)) {
          console.log(`terminate ${id} with ${payload} from ${activeRuns[activeRuns.length - 1]}`)
          resolve([2, 4]);
          activeRuns.splice(index, 1);
          return;
        }
      }
    }
    resolve([4, 2]);
  }, 1000));
  let endTime = performance.now()
  const elapsed = endTime - startTime;
  console.log(`${val} after 1s? elapsed time is ${elapsed / 1_000}??`)
  self.postMessage(val);
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
