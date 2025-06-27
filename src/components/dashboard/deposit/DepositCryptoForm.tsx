import { InfoRounded } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import QRCode from "qrcode.react";
import { useTranslation } from "react-i18next";
import CountdownMinutes from "./CountdownMinutes";
import { RxOpenInNewWindow } from "react-icons/rx";

type DepositCryptoFormProps = {
  depositDetail?: any;
};

export default function DepositCryptoForm({
  depositDetail,
}: DepositCryptoFormProps) {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const paymentUrl = depositDetail?.gatewayCustomData?.internalData?.paymentUrl;

  const BoxStyle = {
    color: "#EEE",
    "& .deposit_detail_haeder": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "0.5rem",
      "& .time_ramaining_box": {
        color: "#FFF",
        background: "#0f1a21",
        padding: "0.5rem 1rem",
        display: "flex",
        gap: "0.5rem",
        borderRadius: "4px",
      },
    },

    "& .qrcode_content_footer": {
      marginTop: 3,
      textAlign: "center",
      display: "flex",
      gap: "2rem",
      justifyContent: "center",

      "& .text": {
        color: "#798e9b",
        maxWidth: "400px",
        textAlign: "left",
      },
    },
  };

  return (
    <Box sx={BoxStyle}>
      {depositDetail ? (
        <Stack direction={"column"}>
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                sx={{ mt: 3, textAlign: "center" }}
                alignItems="center"
                alignContent="center"
                justifyContent="center"
              >
                <QRCode
                  value={paymentUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin
                  renderAs="svg"
                  style={{
                    borderRadius: "16px",
                    border: "2px solid #222d38",
                    padding: "0.5rem",
                  }}
                />
                {!paymentUrl && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={180}
                    height={180}
                    sx={{
                      backgroundColor: "#d4b3b0",
                      margin: "0 auto",
                    }}
                  >
                    <InfoRounded fontSize="large" color="error" />
                  </Box>
                )}
              </Box>

              <Box>
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography
                    sx={{ color: "#EEE" }}
                    fontWeight={400}
                    fontSize={isMobile ? 8 : 14}
                  >
                    {t("click_or_read_qrcode_to_pay")}
                  </Typography>
                </Box>
                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  sx={{
                    mt: 2,
                    backgroundColor: "#0f1a21",
                    padding: "1rem 1rem",
                    borderRadius: "4px",
                  }}
                >
                  <Link
                    href={paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    color="primary"
                    underline="hover"
                  >
                    <Typography
                      sx={{ color: "#697582" }}
                      fontWeight={400}
                      fontSize={isMobile ? 8 : 14}
                      color="textPrimary"
                      variant="body2"
                    >
                      {paymentUrl}
                    </Typography>
                  </Link>
                  <RxOpenInNewWindow
                    size={20}
                    color="#01db97"
                    style={{ marginLeft: "0.5rem" }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}
