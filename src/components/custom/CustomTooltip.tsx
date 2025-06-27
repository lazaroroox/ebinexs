import Close from "@mui/icons-material/Close";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { AiOutlineHistory } from "react-icons/ai";
import { BiSolidPen, BiSolidUser } from "react-icons/bi";
import { MdCandlestickChart } from "react-icons/md";
import { RiCoinFill } from "react-icons/ri";
import { TbArrowsExchange } from "react-icons/tb";
import type { TooltipRenderProps } from "react-joyride";

export const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
  size,
}: TooltipRenderProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: "400px",
        borderRadius: "8px",
        backgroundColor: "#09121C",
        padding: "24px",
        color: "white",
        boxShadow: 3,
      }}
      {...tooltipProps}
    >
      {/* Close button */}
      <IconButton
        {...closeProps}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          color: "#A5AAAD",
          "&:hover": { color: "white" },
        }}
      >
        <Close sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Header with icon */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "27px",
            height: "27px",
            borderRadius: "50%",
            backgroundColor: "#00000000",
            border: "1px solid #00593D",
          }}
        >
          {step.target === ".my-account-section" && (
            <BiSolidUser size={14} color="#4ade80" />
          )}
          {step.target === ".account-selection-section" && (
            <TbArrowsExchange size={14} color="#4ade80" />
          )}
          {step.target === ".symbol-section" && (
            <RiCoinFill size={14} color="#4ade80" />
          )}
          {step.target === ".tradingview-section" && (
            <BiSolidPen size={14} color="#4ade80" />
          )}
          {step.target === ".ordens-section" && (
            <MdCandlestickChart size={14} color="#4ade80" />
          )}
          {step.target === ".order-book-section" && (
            <AiOutlineHistory size={14} color="#4ade80" />
          )}
        </Box>
        <Typography
          sx={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}
        >
          {step.title}
        </Typography>
      </Box>

      {/* Content */}
      <Typography
        sx={{
          marginBottom: 4,
          fontWeight: 400,
          fontSize: 13,
          color: "#DEE3E6",
        }}
      >
        {step.content &&
        typeof step.content === "object" &&
        "text" in (step.content as { text?: React.ReactNode })
          ? (step.content as { text?: React.ReactNode }).text
          : (step.content as React.ReactNode)}
      </Typography>

      {/* Footer with progress and buttons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#01DB97",
            fontSize: 13,
          }}
        >
          <Typography sx={{ color: "#4ade80" }}>{index + 1}</Typography>
          <Typography>de</Typography>
          <Typography>{size}</Typography>
          <Box
            sx={{
              marginLeft: 2,
              width: "160px",
              height: "8px",
              backgroundColor: "#515151",
              borderRadius: "4px",
            }}
          >
            <Box
              sx={{
                height: "100%",
                backgroundColor: "#01DB97",
                borderRadius: "4px",
                width: `${((index + 1) / size) * 100}%`,
              }}
            />
          </Box>
        </Box>

        <Button
          {...primaryProps}
          variant="text"
          disableRipple
          sx={{
            gap: 1,
            color: "#3cc76e",
            fontWeight: "500",
            backgroundColor: "#00000000",
            p: 0,
          }}
        >
          {isLastStep ? "Finalizar" : "Continuar"}{" "}
          {!isLastStep && <span>›</span>}
        </Button>
      </Box>
    </Box>
  );
};
