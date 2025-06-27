import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HiReceiptPercent } from "react-icons/hi2";
import { MdSecurity } from "react-icons/md";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";

const style = {
  borderTop: "1px solid #070f14",
  borderBottom: "1px solid #070f14",
  "& .box_points": {
    background: "#070f14",
    borderRadius: "16px",
    padding: "2rem",
  },
};

interface ICard {
  id: number;
  label: string;
  description: string;
  icon: ReactNode;
}

const GoodPointsSection = ({
  cardsMock,
  title,
}: {
  cardsMock: ICard[];
  title: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        ...style,
        margin: isMobile ? "1rem 0" : " 16px 0",
        padding: isMobile ? "1rem 0" : "2rem 0",
      }}
    >
      <Stack direction={"column"} spacing={2}>
        <Typography variant="h6" fontWeight={400} color={"#EEE"}>
          {title}
        </Typography>
        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
          {cardsMock.map((card) => (
            <Box
              className="box_points"
              sx={{ maxWidth: isMobile ? "100%" : "33%" }}
              key={card?.id}
            >
              <TitleWithCircleIcon
                label={card?.label}
                description={card?.description}
                descriptionColor="#7f8b92"
                icon={card?.icon}
                circleSize={50}
                flexDirection="column"
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default GoodPointsSection;
