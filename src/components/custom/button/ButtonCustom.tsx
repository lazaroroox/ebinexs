import { Stack, Typography } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

type ButtonCustomProps = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageWidth?: number;
  activeButtonId?: boolean;
} & ButtonProps;

const ButtonCustomCustom = styled(Button)<ButtonCustomProps>(({ theme }) => ({
  width: "100%",
  textTransform: "none",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  justifyContent: "flex-start",
}));

export default function ButtonCustom({ ...props }: ButtonCustomProps) {
  return (
    <ButtonCustomCustom
      {...props}
      sx={{ border: props.activeButtonId ? "1px solid #00DB97" : null }}
      variant="contained"
      disableRipple
    >
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
        spacing={2}
        py={1}
      >
        {props?.imageUrl && (
          <img
            src={props.imageUrl}
            style={{
              width: props.imageWidth ? props.imageWidth : 24,
              height: props.imageWidth ? props.imageWidth : 24,
            }}
            alt="BTC/USDT"
          />
        )}

        <Stack direction={"column"} alignItems={"start"}>
          <Typography color="white" fontWeight={700} fontSize={16}>
            {props.title}
          </Typography>
          {props.subtitle && (
            <Typography
              color="white"
              sx={{ color: "#9C9C9C" }}
              fontWeight={400}
              fontSize={12}
            >
              {props.subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
    </ButtonCustomCustom>
  );
}
