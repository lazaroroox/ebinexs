let intervalList = [];

function useSetInterval(fn, delay) {
  let interval = setInterval(fn, delay);
  intervalList.push(interval);
  return interval;
}

const clearDepositIntervalId = () => {
  for (let i = 0; i < intervalList.length; i++) {
    clearInterval(intervalList[i]);
  }
  intervalList = [];
};

export { useSetInterval, clearDepositIntervalId };
