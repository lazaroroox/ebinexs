import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";

type ToastPaperProps = {
  result: "win" | "lose";
  value: string;
};

const ToastPaper: React.FC<ToastPaperProps> = ({ result, value }) => {
  const isProfit = result === "win";
  const icon = isProfit ? (
    <CheckCircleIcon style={{ color: "#00db97" }} />
  ) : (
    <ErrorIcon style={{ color: "#fe025c" }} />
  );
  const paperColor = isProfit ? "#00db9798" : "#fe025c98";
  const formattedValue = isProfit ? `+U${value}` : `-U${value}`;

  return (
    <Box
      style={{
        justifyContent: "center",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        backgroundColor: paperColor,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          color="white"
          fontWeight="bold"
          textAlign={"center"}
          style={{ lineHeight: 1.2 }} // Ajusta a altura da linha para reduzir a distância entre os textos
        >
          Resultado
        </Typography>
        <Typography
          variant="h6"
          color="white"
          fontWeight="bold"
          textAlign={"center"}
          style={{ lineHeight: 1.2 }} // Ajusta a altura da linha para reduzir a distância entre os textos
        >
          {formattedValue}
        </Typography>
      </Box>
    </Box>
  );
};

export default ToastPaper;
