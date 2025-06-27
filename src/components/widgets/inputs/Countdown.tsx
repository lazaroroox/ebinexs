import {
  Box,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useContext } from "react";
import { useTranslation } from "react-i18next";

import CountdownContextV2 from "src/contexts/v2/CountdownContext";
import useApiData from "src/hooks/useApiData";

function Countdown() {
  const { t } = useTranslation("dashboard");
  const { count, count1m, timeFormat, timeFormat1m } =
    useContext(CountdownContextV2);

  const { operationMode } = useApiData();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isNewOptionsTab = operationMode === "OPTION";

  const countValue = isNewOptionsTab ? count : count1m;

  if (
    (timeFormat === "" && isNewOptionsTab) ||
    (timeFormat1m === "" && !isNewOptionsTab)
  ) {
    return (
      <Box pl={0.4} pt={0.8} pb={0.4}>
        <Skeleton variant="text" width={80} height={16} />
        {isNewOptionsTab && isMobile && <Typography height={16} />}
      </Box>
    );
  }

  return (
    <Box pl={0.4} pt={0.8}>
      <Typography
        fontWeight={600}
        color={countValue < 6000 ? "#FF5382" : "#00DB97"}
        variant="body2"
      >
        {isNewOptionsTab ? timeFormat : timeFormat1m}{" "}
        {t("seconds").toLocaleLowerCase()}
      </Typography>
    </Box>
  );
}

export default Countdown;
