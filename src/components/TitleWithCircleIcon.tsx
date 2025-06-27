import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface TitleWithCircleIconProps {
  bgColor?: string;
  noBgColor?: boolean;
  color?: string;
  circleSize?: number;
  fontSize?: number | string;
  label?: string;
  icon: ReactNode;
  flexDirection?: "row" | "column";
  description?: string;
  descriptionColor?: string;
  fontWeight?: number | string;
  sx?: {};
}

const TitleWithCircleIcon = ({
  bgColor = "#00271b",
  noBgColor,
  color = "#01db97",
  fontSize = 14,
  fontWeight = 400,
  circleSize = 20,
  label,
  icon,
  flexDirection = "row",
  description,
  descriptionColor = "#CCC",
  sx,
}: TitleWithCircleIconProps) => {
  return (
    <Box
      mr={1}
      className="box_wrapper"
      sx={{
        display: "flex",
        alignItems: flexDirection === "column" ? "flex-start" : "center",
        flexDirection: flexDirection,
        ...sx,
      }}
    >
      <Box
        className="flex_center"
        sx={{
          width: circleSize,
          height: circleSize,
          background: !noBgColor ? bgColor : "transparent",
          color: color,
          borderRadius: "50%",
          marginRight: "8px",
          marginBottom: flexDirection === "column" ? "8px" : 0,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      {description ? (
        <Stack direction="column" spacing={0.5}>
          <Typography color="#EEE" fontSize={fontSize} fontWeight={fontWeight}>
            {label}
          </Typography>
          <Typography color={descriptionColor} variant="body1">
            {description}
          </Typography>
        </Stack>
      ) : (
        <Typography color="#EEE" fontSize={fontSize} fontWeight={fontWeight}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default TitleWithCircleIcon;
