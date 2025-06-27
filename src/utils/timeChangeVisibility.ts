let hiddenTimeRef = 0;

export const setupVisibilityChangeHandler = (callback) => {
  const handleVisibilityChange = async () => {
    if (document.visibilityState === "hidden") {
      hiddenTimeRef = Date.now();
    } else {
      const currentTime = Date.now();
      const timeDiff = currentTime - hiddenTimeRef;
      const minutesDiff = timeDiff / (1000 * 60);

      const afterTimeRefresh = 0.5; // 0.5 === 30 seconds | 1 === 1 minute

      if (minutesDiff > afterTimeRefresh) {
        if (callback && typeof callback === "function") {
          await callback();
        }
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};
