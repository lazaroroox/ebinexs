import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface CountdownMinutesProps {
  minutes: number;
}

const CountdownMinutes = ({ minutes }: CountdownMinutesProps) => {
  const initialTime = minutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const savedTime = localStorage.getItem("timeRemaining");
    return savedTime ? parseInt(savedTime, 10) : initialTime;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem("timeRemaining");
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem("timeRemaining", String(newTime));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return <Typography variant="body1">{formatTime(timeRemaining)}</Typography>;
};

export default CountdownMinutes;
