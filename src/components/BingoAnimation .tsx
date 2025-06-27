import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import numeral from "numeral";
import { useEffect, useMemo, useRef, useState } from "react";
import useBalanceComplete from "src/swr/use-balance-complete";
import SensitiveInfo from "./SensitiveInfo";

const BingoAnimation = ({ activeAccount }) => {
  const { balanceComplete, isNewValue } = useBalanceComplete();

  const isRealAccount = activeAccount?.environment === "REAL";
  const [currentValue, setCurrentValue] = useState(
    activeAccount.defaultCoinBalance
  );

  const animationFrameId = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const newValue = useMemo(() => {
    if (
      activeAccount?.environment === "REAL" &&
      isNewValue &&
      balanceComplete.availableForTrading > activeAccount.defaultCoinBalance
    ) {
      return balanceComplete?.availableForTrading;
    }

    return activeAccount.defaultCoinBalance;
  }, [activeAccount, isNewValue, balanceComplete]);

  useEffect(() => {
    const oldValue = currentValue;

    if (oldValue !== newValue) {
      let animationDuration;

      const differenceValue = newValue - oldValue;

      if (differenceValue > 10000) {
        animationDuration = 1500; // 1.5s
      } else if (differenceValue > 100) {
        animationDuration = 1000; // 1s
      } else if (differenceValue < 10 && differenceValue > 5) {
        animationDuration = 500; // 0.5s
      } else if (differenceValue < 5) {
        animationDuration = 250; // 0.25s
      } else {
        animationDuration = 1000;
      }

      const animateValue = (start, end, duration) => {
        let startTime = null;

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const progressRatio = Math.min(progress / duration, 1);

          const value = Math.floor(start + (end - start) * progressRatio);
          setCurrentValue(value);

          if (progress < duration) {
            animationFrameId.current = requestAnimationFrame(step);
          } else {
            setCurrentValue(end);
          }
        };

        animationFrameId.current = requestAnimationFrame(step);
      };

      animateValue(oldValue, newValue, animationDuration);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [newValue, activeAccount, setCurrentValue]);

  return (
    <Typography
      whiteSpace="nowrap"
      fontSize={isMobile ? "0.85rem" : "1rem"}
      fontWeight={500}
    >
      {activeAccount.environment === "REAL" ? (
        <SensitiveInfo text={`$ ${numeral(currentValue).format("0,0.00")}`} />
      ) : (
        `$ ${numeral(currentValue).format("0,0.00")}`
      )}
    </Typography>
  );
};

export default BingoAnimation;
