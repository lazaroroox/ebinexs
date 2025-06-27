import { Box, Stack, Typography } from "@mui/material";
import { CountdownRendererFn } from "react-countdown";
import Logo from "./Logo";

interface CountdownScreenProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownScreen: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}: CountdownScreenProps) => (
  <Box
    sx={{
      alignItems: "center",
      backgroundColor: "background.paper",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center",
      left: 0,
      p: 3,
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 2000,
    }}
  >
    <Logo />
    <Box
      sx={{
        mt: 5,
        borderRadius: "15px",
        borderWidth: 1,
        borderColor: "#CCC",
        backgroundColor: "#202020",
        padding: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        divider={
          <Typography fontSize="2.5rem" fontWeight="600" color="#00DB97">
            :
          </Typography>
        }
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            fontSize="3.5rem"
            lineHeight={1.2}
            fontWeight="600"
            color="#00DB97"
          >
            {days}
          </Typography>
          <Typography fontSize="0.8rem" fontWeight="300" color="#FE025C">
            dias
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            fontSize="3.5rem"
            lineHeight={1.2}
            fontWeight="600"
            color="#00DB97"
          >
            {hours}
          </Typography>
          <Typography fontSize="0.8rem" fontWeight="300" color="#FE025C">
            horas
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            fontSize="3.5rem"
            lineHeight={1.2}
            fontWeight="600"
            color="#00DB97"
          >
            {minutes}
          </Typography>
          <Typography fontSize="0.8rem" fontWeight="300" color="#FE025C">
            minutos
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            fontSize="3.5rem"
            lineHeight={1.2}
            fontWeight="600"
            color="#00DB97"
          >
            {seconds}
          </Typography>
          <Typography fontSize="0.8rem" fontWeight="300" color="#FE025C">
            segundos
          </Typography>
        </Box>
      </Stack>
    </Box>
  </Box>
);

export default CountdownScreen;
