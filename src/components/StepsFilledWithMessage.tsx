import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Steps {
  index: number;
  label: string;
  description: string;
}

interface StepsFilledWithMessageProps {
  activeStep: { index: number; type: string };
  steps: Steps[];
}

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  "& .step": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "1rem",

    "& .green_step_bullet": {
      borderRadius: "50%",
      minWidth: "16px",
      height: "16px",
      transition: "background 1s ease",
      position: "relative",
    },
  },

  "& .divider": {
    width: "1px",
    background: "#0f1920",
    height: "40px",
    position: "absolute",
    top: "83%",
    left: "39px",
    transform: "translateY(-50%)",
    transition: "background 1s ease",
  },
};

const StepsFilledWithMessage = ({
  activeStep,
  steps,
}: StepsFilledWithMessageProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation("steps_filled_with_message");

  const stepIsFilled = (stepIndex: number) => {
    if (activeStep.index >= stepIndex) {
      return {
        background: "#1ce99d",
        boxShadow: "0 0 10px 3px #1e463a",
      };
    }

    return {
      background: "#0d151a",
      boxShadow: "none",
    };
  };

  return (
    <Box sx={style} overflow="auto">
      <Typography
        fontSize={16}
        fontWeight={400}
        color="#EEE"
        sx={{
          paddingLeft: isMobile ? "0" : "2rem",
          paddingBottom: isMobile ? "1rem" : "2rem",
        }}
      >
        {t("current_step", {
          current: activeStep.index + 1,
          total: steps.length,
        })}
      </Typography>
      {steps &&
        steps.map((step, index) => (
          <Box
            key={step.index}
            className="step"
            sx={{
              paddingLeft: isMobile ? "0" : "2rem",
              paddingBottom: isMobile ? "1rem" : "2rem",
            }}
          >
            <Box
              sx={stepIsFilled(step.index)}
              className="green_step_bullet"
            ></Box>
            <Stack>
              <Typography fontSize={16} fontWeight={400} color="#EEE">
                {step.label}
              </Typography>
              <Typography fontSize={14} fontWeight={400} color="#80909a">
                {step.description}
              </Typography>
            </Stack>
            {index < steps.length - 1 && <Box className="divider"></Box>}
          </Box>
        ))}
    </Box>
  );
};

export default StepsFilledWithMessage;
