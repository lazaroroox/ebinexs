import { Box, Grid, Stack, Typography } from "@mui/material";

import { ReactNode, useMemo } from "react";
import { CircularProgressWithLabel } from "src/components/CircularProgress";
import TinyLineChart from "src/components/dashboard/TinyLineChart";
import EyeShowSensitiveInfo from "src/components/EyeShowSensitiveInfo";
import SensitiveInfo from "src/components/SensitiveInfo";

const colorsTitleAndChart = {
  green: {
    title: "#00A268",
    chart: "#00B474",
  },
  red: {
    title: "#E60253",
    chart: "#FF025C",
  },
  purple: {
    title: "#5F57B5",
    chart: "#8979FF",
  },
  orange: {
    title: "rgba(150, 80, 42, 0.28)",
    chart: "#FF5912",
  },
};

interface OperationsRevenueProps {
  loadingRevenue: boolean;
  dataChart?: Array<{
    accumulated: number;
  }>;
  icon?: ReactNode;
  title: string;
  assertivityOperations?: number;
  totalAmountOperations?: number;
  type: "revenue" | "assertivity" | "total-operations";
}

export function RevenueCard({
  assertivityOperations,
  loadingRevenue,
  dataChart,
  icon,
  title,
  totalAmountOperations,
  type,
}: OperationsRevenueProps) {
  const handleTypeColor = () => {
    switch (type) {
      case "revenue":
        if (dataChart?.[dataChart.length - 1]?.accumulated < 0) {
          return "red";
        }
        return "green";
      case "assertivity":
        return "purple";
      case "total-operations":
        return "orange";
    }
  };

  const typeColor = handleTypeColor();

  const value = useMemo(() => {
    if (type === "total-operations") {
      return totalAmountOperations;
    }

    if (type === "assertivity") {
      return assertivityOperations || 0;
    }
    if (type === "revenue") {
      return dataChart?.[dataChart.length - 1]?.accumulated || 0;
    }
  }, [totalAmountOperations, type, dataChart]);

  return (
    <Grid
      pt={!!dataChart?.length || type === "total-operations" ? 2 : 0}
      pb={type === "total-operations" ? 2.5 : 0}
      sx={{
        background: "#0C1317",
        border: "1px solid #181818",
        borderRadius: "16px",
        minWidth: 200,
      }}
      size={{ xs: 12, md: 5.75, lg: 3.8 }}
    >
      <Stack
        direction={!dataChart?.length ? "row" : "column"}
        alignItems={!dataChart?.length ? "center" : "stretch"}
        justifyContent="space-between"
        height="100%"
        gap={2}
      >
        <TitleRevenueCard
          type={type}
          typeColor={typeColor}
          title={title}
          value={value}
          icon={icon}
        />
        {type === "total-operations" ? (
          <Typography
            fontSize={20}
            fontWeight={600}
            color="#CCCCCC"
            pt={0.25}
            pl={3.25}
            pr={2}
          >
            {totalAmountOperations}
          </Typography>
        ) : (
          !!dataChart?.length && (
            <TinyLineChart
              data={dataChart || []}
              color={colorsTitleAndChart[typeColor].chart}
              id={type}
            />
          )
        )}
      </Stack>
    </Grid>
  );
}

function BoxIcon({
  icon,
  bgColor = "#00A268",
}: {
  bgColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        background: bgColor,
        borderRadius: "50%",
        width: 50,
        height: 50,
      }}
    >
      {icon}
    </Stack>
  );
}

interface TitleRevenueCardProps {
  title: string;
  value?: number;
  typeColor: "green" | "red" | "orange" | "purple";
  icon: React.ReactNode;
  type: "revenue" | "assertivity" | "total-operations";
}

function TitleRevenueCard({
  typeColor,
  icon,
  title,
  type,
  value,
}: TitleRevenueCardProps) {
  if (type === "assertivity") {
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        pt={0.25}
        pl={3.25}
        pr={2}
      >
        <CircularProgressWithLabel
          sx={{
            color: colorsTitleAndChart[typeColor].title,
          }}
          size={50}
          variant="determinate"
          thickness={4}
          progress={value}
        />
        <Typography color="white" fontSize={16} fontWeight={600}>
          {title}
        </Typography>
      </Stack>
    );
  }

  const bgColor =
    typeColor === "red"
      ? colorsTitleAndChart["green"].title
      : colorsTitleAndChart[typeColor].title;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      spacing={1}
      pl={3.25}
      pr={2}
    >
      <Stack direction="row" alignItems="center" spacing={1} pt={0.25}>
        <BoxIcon icon={icon} bgColor={bgColor} />
        <Box>
          <Typography color="white" fontSize={16} fontWeight={600}>
            {title}
          </Typography>
          {type === "revenue" &&
            (!!value && value !== 0 ? (
              <Typography
                color={colorsTitleAndChart[typeColor].title}
                fontSize={20}
                fontWeight={600}
              >
                <SensitiveInfo text={value.toString().replace("-", "-$")} />
              </Typography>
            ) : (
              <Typography color="#808080" fontSize={14} fontWeight={500}>
                Nenhuma informação disponível
              </Typography>
            ))}
        </Box>
      </Stack>

      {type === "revenue" && (
        <Box alignSelf="flex-start">
          <EyeShowSensitiveInfo size={22} color="#FFFFFF" />
        </Box>
      )}
    </Stack>
  );
}
