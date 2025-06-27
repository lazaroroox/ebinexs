import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ButtonCustom from "src/components/custom/button/ButtonCustom";
import {
  DepositCryptoForm,
  DepositListTable,
} from "../../components/dashboard/deposit";
import useSettings from "../../hooks/useSettings";
import gtm from "../../lib/gtm";

const depositMethodButtonList = [
  // {
  //   id: "pix",
  //   title: "Pix (Apenas seu CPF)",
  //   subtitle: "1 - 2 dias úteis",
  //   imageSrc: "/static/icons/pix.png",
  // },
  // {
  //   id: "bitcoin",
  //   title: "Bitcoin",
  //   subtitle: "1 - 24 horas",
  //   imageSrc: "/static/icons/btc-usdt.png",
  // },
  {
    id: "usdt",
    title: "USDT",
    subtitle: "_1_48_hours",
    imageSrc: "/static/icons/coins/tether-usdt-logo.png",
  },
];

const DepositPayment: FC = () => {
  const { t } = useTranslation("dashboard");
  const { settings } = useSettings();
  const [depositMethodButtonSeleted, setDepositMethodButtonSelected] = useState(
    depositMethodButtonList[0]
  );

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("deposit_funds")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
          mt: 3,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid>
              <Typography
                color="textPrimary"
                variant="h5"
                fontSize={24}
                fontWeight={500}
                fontFamily="Inter"
              >
                {t("deposit_funds")}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, md: 2 }}>
              <Stack direction={"column"} justifyContent="start">
                {depositMethodButtonList.map((item) => (
                  <ButtonCustom
                    key={item.id}
                    title={item.title}
                    subtitle={t(item.subtitle)}
                    imageUrl={item.imageSrc}
                    activeButtonId={item.id === depositMethodButtonSeleted.id}
                    onClick={() => setDepositMethodButtonSelected(item)}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              {depositMethodButtonSeleted.id === "usdt" && (
                <DepositCryptoForm />
              )}
              <DepositListTable />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DepositPayment;
