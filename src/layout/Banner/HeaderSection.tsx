import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export function HeaderSection({
  title,
  icon,
}: {
  title: string;
  icon: ReactNode;
}) {
  return (
    <Box display="flex" gap={1} alignItems="center">
      <Box
        sx={{
          svg: {
            color: "#10f8a0",
          },

          background: "#011e14",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography color="#EEE" fontSize={20} fontWeight={500}>
        {title}
      </Typography>

      <Box
        width="100%"
        flex={1}
        sx={{
          width: "100%",
          height: "1px",
          flex: 1,
          background: "#15181A",
        }}
      />
    </Box>
  );
}
