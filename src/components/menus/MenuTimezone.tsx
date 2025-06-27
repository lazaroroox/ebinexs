import {
  Box,
  Button,
  FormControl,
  Menu,
  MenuItem,
  MenuProps,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiTimeZoneLine } from "react-icons/ri";
import { changeTimeZone } from "src/lib/api/users";
import useParameters from "src/swr/use-parameters";
import SelectLanguage from "../dashboard/SelectLanguage";


const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))(() => ({
  "& .MuiList-root": {
    padding: 0,
  },
  "& .MuiPaper-root": {
    background: "rgb(1 8 12)",
    border: "2px solid #04141d",
    marginTop: 16,
    borderRadius: 12,
  },
  "& .left_RealDemo": {
    display: "flex",
    gap: "1rem",
    alignItems: "center",

    "& .info_RealDemo": {
      display: "flex",
      flexDirection: "column",
    },
  },
  "& .action_button_RealDemo": {
    height: "48px",
    padding: "0 1.25rem",
    borderRadius: "8px",
    marginLeft: "auto",
  },
}));

interface Props {
  selectedOptionLanguage?: {
    icon: string;
    label: string;
  };
}

export default function MenuTimezone({ selectedOptionLanguage }: Props) {
  const { t } = useTranslation(["dashboard", "home"]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { parameters } = useParameters();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [timeZoneState, setTimeZoneState] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (parameters) {
      setTimeZoneState(parameters.USER_TIMEZONE.value);
    }
  }, [parameters]);

  const handleTimeZoneChange = (event: SelectChangeEvent) => {
    setTimeZoneState(event.target.value);

    try {
      changeTimeZone(Number(event.target.value));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        sx={{
          backgroundColor: "transparent",
          color: "#EEE",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          "&:hover": {
            backgroundColor: "rgba(1, 8, 12, 0.8)",
            background: "linear-gradient(9deg, #09141a6b, transparent)",
            cursor: "pointer",
          },
          "&:first-of-type": {
            border: "1px solid #030e14",
          },
        }}
      >
        <RiTimeZoneLine
          size={isMobile ? 24 : 28}
          style={{ cursor: "pointer" }}
          color="#808080"
        />

        {selectedOptionLanguage && (
          <Typography>{selectedOptionLanguage.label}</Typography>
        )}
      </Button>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            right: isMobile ? "0" : "null",
            left: isMobile ? "0" : "117px",
          },
        }}
      >
        <Box
          className="container_RealDemo"
          sx={{
            justifyContent: isMobile && "space-between",
            padding: isMobile ? "0.5rem 1rem 1rem" : "1rem 2rem",
            gap: isMobile ? "0.5rem" : "2rem",
          }}
        >
          <Typography variant="subtitle1" pb={2}>
            {t("language-and-timezone")}
          </Typography>
          <FormControl fullWidth>
            <Typography variant="body1" color={"#AAA"} pb={1}>
              {t("language")}
            </Typography>
            <SelectLanguage />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <Typography variant="body1" color={"#AAA"} pb={1}>
              {t("timezone")}
            </Typography>
            <Select value={timeZoneState} onChange={handleTimeZoneChange}>
              <MenuItem value={-12}>UTC-12:00</MenuItem>
              <MenuItem value={-11}>UTC-11:00</MenuItem>
              <MenuItem value={-10}>UTC-10:00</MenuItem>
              <MenuItem value={-9}>UTC-09:00</MenuItem>
              <MenuItem value={-8}>UTC-08:00</MenuItem>
              <MenuItem value={-7}>UTC-07:00</MenuItem>
              <MenuItem value={-6}>UTC-06:00</MenuItem>
              <MenuItem value={-5}>UTC-05:00</MenuItem>
              <MenuItem value={-4}>UTC-04:00</MenuItem>
              <MenuItem value={-3}>UTC-03:00</MenuItem>
              <MenuItem value={-2}>UTC-02:00</MenuItem>
              <MenuItem value={-1}>UTC-01:00</MenuItem>
              <MenuItem value={0}>UTC+00:00</MenuItem>
              <MenuItem value={1}>UTC+01:00</MenuItem>
              <MenuItem value={2}>UTC+02:00</MenuItem>
              <MenuItem value={3}>UTC+03:00</MenuItem>
              <MenuItem value={4}>UTC+04:00</MenuItem>
              <MenuItem value={5}>UTC+05:00</MenuItem>
              <MenuItem value={6}>UTC+06:00</MenuItem>
              <MenuItem value={7}>UTC+07:00</MenuItem>
              <MenuItem value={8}>UTC+08:00</MenuItem>
              <MenuItem value={9}>UTC+09:00</MenuItem>
              <MenuItem value={10}>UTC+10:00</MenuItem>
              <MenuItem value={11}>UTC+11:00</MenuItem>
              <MenuItem value={12}>UTC+12:00</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </StyledMenu>
    </Box>
  );
}
