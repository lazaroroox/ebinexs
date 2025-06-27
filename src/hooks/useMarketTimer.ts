// useMarketTimer.ts
import moment from "moment-timezone";
import "moment/dist/locale/pt-br";

moment.locale("pt-br");

import { useEffect, useState } from "react";
import {
  getLastCloseMoment,
  getNextOpenMoment,
  parseSession,
} from "src/utils/marketHours";

export function useMarketTimer(session: string, timezone: string) {
  const [closedUntil, setClosedUntil] = useState<string>("");
  const [opensIn, setOpensIn] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (session === "24x7") {
      setClosedUntil("Sempre aberto");
      setOpensIn("00h00m00s");
      setProgress(100);
      return;
    }

    const rules = parseSession(session);
    const tz = timezone;

    function update() {
      const now = moment.tz(tz);
      const nextOpen = getNextOpenMoment(rules, tz);
      const lastClose = getLastCloseMoment(rules, tz);

      setClosedUntil(lastClose.format("D [de] MMMM, HH:mm"));

      const totalSec = nextOpen.diff(lastClose, "seconds");
      const leftSec = nextOpen.diff(now, "seconds");
      const pct =
        totalSec > 0 ? Math.min(100, 100 * (1 - leftSec / totalSec)) : 100;
      setProgress(Math.round(pct));

      const d = moment.duration(leftSec, "seconds");
      const hh = String(Math.floor(d.asHours())).padStart(2, "0");
      const mm = String(d.minutes()).padStart(2, "0");
      const ss = String(d.seconds()).padStart(2, "0");
      setOpensIn(`${hh}h${mm}m${ss}s`);
    }

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [session, timezone]);

  return { closedUntil, opensIn, progress };
}
