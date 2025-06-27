import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from "@mui/material";

export function CircularProgressWithLabel({
  progress,
  thickness,
  size,
  ...props
}: CircularProgressProps & {
  progress: number;
  thickness?: number;
  size?: number;
}) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        size={size || 70}
        thickness={thickness || 3}
        variant="determinate"
        value={100}
        sx={{ color: "#15181A" }}
      />
      <CircularProgress
        {...props}
        size={size || 70}
        thickness={thickness || 3}
        variant="determinate"
        value={progress}
        sx={{
          scale: "-1 1",
          position: "absolute",
          inset: 0,
          ...props.sx,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(progress)}%`}</Typography>
      </Box>
    </Box>
  );
}
