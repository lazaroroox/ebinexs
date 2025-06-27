import dayjs from "dayjs";
import { FC, ReactNode, useEffect, useState } from "react";
import Countdown from "react-countdown";
import useQuery from "src/hooks/useQuery";
import CountdownScreen from "./CountdownScreen";

interface CountdownGuardProps {
  children?: ReactNode;
}

const CountdownGuard: FC<CountdownGuardProps> = ({ children }) => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [countdownData, setCountdownData] = useState(0);

  const query = useQuery();
  const isTesting = query.get("_testing");

  useEffect(() => {
    const isTestingSaved = localStorage.getItem("isTestingSaved");

    if (isTesting) {
      localStorage.setItem("isTestingSaved", isTesting);

      if (isTesting === "true") {
        return;
      } else {
        renderCountdown();
      }
    } else if (isTestingSaved === "true") {
      return;
    } else {
      renderCountdown();
    }
  }, []);

  const renderCountdown = () => {
    const utc = new Date().toUTCString();
    const activeDate = new Date(new Date().toUTCString());
    const dateUTC = new Date(Date.UTC(2023, 4, 13, 15, 0, 0, 0));
    const time = dayjs(dateUTC).valueOf();
    setCountdownData(time);
    if (dateUTC >= activeDate) {
      setIsMaintenance(true);
    }
  };

  if (isMaintenance) {
    return (
      <Countdown
        date={countdownData}
        renderer={CountdownScreen}
        onComplete={(timeDelta, completedOnStart) => setIsMaintenance(false)}
      />
    );
  }

  return <>{children}</>;
};

export default CountdownGuard;
