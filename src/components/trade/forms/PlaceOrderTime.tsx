import { Box, Grid, Stack, TextField, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsPlus } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { InputAdornmentIcon } from "src/components/InputAdornmentIcon";
import CountdownContextV2 from "src/contexts/v2/CountdownContext";
import useApiData from "src/hooks/useApiData";
import { CandleBucket } from "src/types/candle";
import { NumericOnly } from "src/utils/numericOnly";
import { notifyError } from "src/utils/toast";
import { ProgressTimeframe } from "../utils/ProgressTimeframe";
import TimePickerRetraction from "../utils/TimePickerRetraction";

const useStyles = {
  "& .MuiInputBase-input": {
    textAlign: "center",
    color: "#CCC",
  },
  "& .MuiInputBase-root": {
    fontSize: "1rem",
    background: "transparent",
  },
  svg: {
    color: "#475760",
    cursor: "pointer",
  },
};

const ADJUSTMENT_MS = 90000;

interface PlaceOrderTimeProps {
  amount: string;
  activeMinute: CandleBucket;
  balance: number;
  candleBuckets: Array<CandleBucket>;
  onChangeAmount: (amount: string) => void;
  onChangeOrderValue: (orderValue: number) => void;
  onActiveMinute: (candle: CandleBucket) => void;
  payout: number;
  selectedSymbol: string;
}

export function PlaceOrderTime({
  activeMinute,
  amount,
  balance,
  candleBuckets,
  onActiveMinute,
  onChangeAmount,
  onChangeOrderValue,
  payout,
  selectedSymbol,
}: PlaceOrderTimeProps) {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { count1m, countValue, syncServerTimeWithNowDate, latencyServerTime } =
    useContext(CountdownContextV2);

  const { updateDatatime, operationMode } = useApiData();

  const [additionalMinutes, setAdditionalMinutes] = useState<number>(0);
  const [showInputTimeRetraction, setShowInputTimeRetraction] = useState(false);
  const [inputBaseTime, setInputBaseTime] = useState<Date | null>(null);

  const isNewOptionsTab = operationMode === "OPTION";

  const getTimestamp = (): number => {
    const timestamp = getAdjustedTime().getTime();
    return Math.floor(timestamp / 60000) * 60000;
  };

  const getAdjustedTime = (): Date => {
    if (!inputBaseTime) {
      return;
    }
    return new Date(inputBaseTime.getTime() + additionalMinutes * 60000);
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const incrementMinutes = () => {
    setAdditionalMinutes((prev) => Math.min(prev + 1, 59));
  };

  const decrementMinutes = () => {
    setAdditionalMinutes((prev) => Math.max(prev - 1, 0));
  };

  const increaseAmount = (orderValue?: number) => {
    if (orderValue) {
      onChangeAmount(orderValue.toString());
      localStorage.setItem("localStorageAmount", orderValue.toString());
      return;
    }

    const newAmount = parseFloat(amount) + 1;
    if (newAmount > balance) {
      notifyError("Você não tem saldo suficiente para aumentar o valor");
      return;
    }

    onChangeOrderValue(newAmount);
    onChangeAmount(newAmount.toString());
    localStorage.setItem("localStorageAmount", newAmount.toString());
  };

  const decreaseAmount = () => {
    if (parseFloat(amount) < 2) return;
    const newAmount = parseFloat(amount) - 1;
    onChangeOrderValue(newAmount);
    onChangeAmount(newAmount.toString());
    localStorage.setItem("localStorageAmount", newAmount.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (NumericOnly(e)) {
      const inputValue = e.target.value;
      const numericValue = parseFloat(inputValue);

      if (!isNaN(numericValue) && numericValue > balance) {
        notifyError("Valor acima do saldo disponível");
        return;
      }

      onChangeAmount(inputValue === "" ? "" : inputValue);
      onChangeOrderValue(numericValue);
      localStorage.setItem("localStorageAmount", inputValue);
    }
  };

  const handleBlur = () => {
    let parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      onChangeAmount("1");
      onChangeOrderValue(1);
    } else if (parsed > balance) {
      notifyError("Valor ajustado para o máximo disponível");
      const adjusted = Math.floor(balance);
      onChangeAmount(adjusted.toString());
      onChangeOrderValue(adjusted);
    }
  };

  const timeOrderRetraction = useMemo(() => {
    if (!inputBaseTime) return;
    return formatTime(getAdjustedTime());
  }, [inputBaseTime, additionalMinutes]);

  useEffect(() => {
    const now = syncServerTimeWithNowDate();

    if (additionalMinutes === 0) {
      setInputBaseTime(new Date(now + ADJUSTMENT_MS));
    } else {
      const adjustedTime = new Date(
        inputBaseTime.getTime() + additionalMinutes * 60000
      );
      if (adjustedTime.getTime() <= now + ADJUSTMENT_MS) {
        setAdditionalMinutes(0);
        setInputBaseTime(new Date(now + ADJUSTMENT_MS));
      }
    }
  }, [count1m]);

  useEffect(() => {
    if (!!inputBaseTime) {
      updateDatatime(getTimestamp());
    }
  }, [inputBaseTime, additionalMinutes]);

  return (
    <Grid
      container
      columns={{ xs: 12, sm: 12, md: 12 }}
      alignItems="baseline"
      sx={useStyles}
    >
      <Grid size={12}>
        <ProgressTimeframe
          activeMinute={activeMinute}
          countValue={countValue}
          isNewOptionsTab={isNewOptionsTab}
          selectedSymbol={selectedSymbol}
          payout={payout}
          timeOrderRetraction={timeOrderRetraction}
          handleShowInputTimeRetraction={setShowInputTimeRetraction}
          showInputTimeRetraction={showInputTimeRetraction}
          candleBuckets={candleBuckets}
          onActiveMinute={onActiveMinute}
        />
      </Grid>
      <Grid
        container
        size={12}
        component={Stack}
        gap={isMobile ? 2 : 4}
        direction={isMobile ? "row" : "column"}
        justifyContent={"space-between"}
        mt={{ xs: 1.5 }}
      >
        {!isNewOptionsTab && showInputTimeRetraction && (
          <Box flex={1}>
            <TimePickerRetraction
              decrementMinutes={decrementMinutes}
              incrementMinutes={incrementMinutes}
              valueRetraction={timeOrderRetraction}
            />
          </Box>
        )}
        <Box flex={1}>
          <TextField
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiFormLabel-root": {
                fontSize: isMobile ? ".75rem" : "1rem",
              },

              "& .MuiInputBase-root": {
                padding: isMobile ? "0 0.5rem" : "0 .75rem",
                outline: "none",
              },
              "& .MuiInputBase-root input": {
                fontSize: isMobile ? ".875rem" : "1.25rem",
                padding: isMobile ? "8.5px 0" : "0.850rem 0",
              },
              "& .MuiIconButton-root:hover": {
                background: "transparent",
              },
            }}
            value={amount}
            label={`${t("value")} (U$)`}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornmentIcon
                    onClick={() => decreaseAmount()}
                    icon={FiMinus}
                  />
                ),
                endAdornment: (
                  <InputAdornmentIcon
                    position="end"
                    onClick={() => increaseAmount()}
                    icon={BsPlus}
                  />
                ),
                style: { WebkitAppearance: "none" },
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
