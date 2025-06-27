import { Box, CircularProgress } from "@mui/material";

const style = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  "& .ProgressContent": {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .IconCircle": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    background: "#00271b",
    borderRadius: "50%",
    color: "#01db97",
  },
};

interface CircleIconProgressProps {
  icon: React.ReactNode;
  progress: number;
  size?: number;
  thickness?: number;
}

export function CircleIconProgress({
  icon,
  progress,
  size,
  thickness,
}: CircleIconProgressProps) {
  return (
    <Box sx={style}>
      <CircleProgress progress={progress} size={size} thickness={thickness} />

      <Box className="ProgressContent">
        <Box className="IconCircle">{icon}</Box>
      </Box>
    </Box>
  );
}

export function CircleProgress({
  progress,
  size,
  thickness,
}: Omit<CircleIconProgressProps, "icon">) {
  const width = size ? `${size}px` : "70px";
  const height = size ? `${size}px` : "70px";
  return (
    <Box display="flex" sx={{ position: "relative", width, height }}>
      <CircularProgress
        size={size || 70}
        thickness={thickness || 3}
        variant="determinate"
        value={100}
        sx={{ color: "#14231f" }}
      />
      <CircularProgress
        size={size || 70}
        thickness={thickness || 3}
        variant="determinate"
        value={progress}
        sx={{
          scale: "-1 1",
          position: "absolute",
          inset: 0,
          color: "#01db97",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}
