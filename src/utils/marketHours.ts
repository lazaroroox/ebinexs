// marketHours.ts
import moment from "moment-timezone";

export interface TimeRange {
  start: { hh: number; mm: number };
  end: { hh: number; mm: number };
}

export interface SessionRule {
  days: number[]; // [0 = dom, 1 = seg, … 6 = sáb]
  ranges: TimeRange[];
}

export function parseSession(session: string): SessionRule[] {
  return session.split("|").map((rule) => {
    const [timesPart, daysPart] = rule.split(":");
    const days = daysPart.split("").map((d) => parseInt(d, 10));
    const ranges = timesPart.split(",").map((r) => {
      const [s, e] = r.split("-");
      const hhS = Number(s.slice(0, 2));
      const mmS = Number(s.slice(2));
      const hhE = Number(e.slice(0, 2));
      const mmE = Number(e.slice(2));
      return {
        start: { hh: hhS, mm: mmS },
        end: { hh: hhE, mm: mmE },
      };
    });
    return { days, ranges };
  });
}

export function getNextOpenMoment(
  rules: SessionRule[],
  timezone: string
): moment.Moment {
  const now = moment.tz(timezone);
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const day = now.clone().add(dayOffset, "days");
    const weekday = day.day();
    const rule = rules.find((r) => r.days.includes(weekday));
    if (!rule) continue;

    for (const rng of rule.ranges) {
      const start = day
        .clone()
        .hour(rng.start.hh)
        .minute(rng.start.mm)
        .second(0);

      if (dayOffset === 0 && now.isBefore(start)) {
        return start;
      }
      if (dayOffset > 0) {
        return start;
      }
    }
  }
  return now;
}

export function getLastCloseMoment(
  rules: SessionRule[],
  timezone: string
): moment.Moment {
  const now = moment.tz(timezone);

  // Primeiro, verifica se hoje existe uma janela ativa
  const todayRule = rules.find((r) => r.days.includes(now.day()));
  if (todayRule) {
    for (const rng of todayRule.ranges) {
      const start = now
        .clone()
        .hour(rng.start.hh)
        .minute(rng.start.mm)
        .second(0);
      const end = now.clone().hour(rng.end.hh).minute(rng.end.mm).second(0);

      if (now.isBetween(start, end, undefined, "[)")) {
        return end;
      }
      if (now.isAfter(end)) {
      
        return end;
      }
    }
  }

  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const day = now.clone().subtract(dayOffset, "days");
    const rule = rules.find((r) => r.days.includes(day.day()));
    if (!rule) continue;

    const ends = rule.ranges.map((rng) =>
      day.clone().hour(rng.end.hh).minute(rng.end.mm).second(0)
    );

    if (ends.length) {
      return moment.max(ends);
    }
  }

  return now;
}
