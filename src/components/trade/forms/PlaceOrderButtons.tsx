import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useStompClient } from "react-stomp-hooks";
import { getLastBar } from "src/components/TVChartContainerV2/streaming";
import LayoutContext from "src/contexts/LayoutContext";
import { notifyError } from "src/utils/toast";

interface PlaceOrderButtonsProps {
  accountId: string;
  amount: string;
  asset: string;
  balance: number;
  selectedSymbol: string;
  candleTimeFrame: string;
  candleEndTime: number;
  selectedSymbolMarketStatus: "OPEN" | "CLOSED";
  countValue: number;
  operationMode: string;
  resolution: string;
  purchase: number;
  sale: number;
}

export function PlaceOrderButtons({
  accountId,
  asset,
  amount,
  balance,
  candleTimeFrame,
  candleEndTime,
  countValue,
  operationMode,
  purchase,
  resolution,
  sale,
  selectedSymbol,
  selectedSymbolMarketStatus,
}: PlaceOrderButtonsProps) {
  const { t } = useTranslation("dashboard");
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const {
    layout: { chartButtonsDisabled },
    setChartButtonsDisabled,
  } = useContext(LayoutContext);

  const stompClient = useStompClient();

  const isNewOptionsTab = operationMode === "OPTION";

  const placeOrder = async (type: string): Promise<void> => {
    if (parseFloat(amount) > balance) {
      notifyError("Quantidade não disponível em carteira.");
      return;
    }

    try {
      setChartButtonsDisabled(true);
      const direction = type.toUpperCase() as any;
      const invest = parseFloat(amount);

      const currentLastBar = getLastBar(selectedSymbol, resolution);

      if (Object.values(currentLastBar).every((v) => v === 0)) return;

      const publishOrder = () => {
        if (stompClient) {
          stompClient.publish({
            destination: "/user/topic/execute",
            body: JSON.stringify({
              binaryOrderType: operationMode,
              accountId,
              candleTimeFrame,
              candleEndTime,
              symbol: selectedSymbol,
              direction,
              invest,
              asset,
              price: currentLastBar.close,
            }),
          });
        } else {
          setTimeout(publishOrder, 2000);
        }
      };

      publishOrder();
      //   setCurrentTab("operations");
    } catch (err) {
      console.log(err);
      if (err === "Locked window") {
        notifyError("Aguarde alguns segundos para fazer o envio da ordem");
        return;
      } else if (err === "SimultaneousRequestsException") {
        notifyError(
          "Várias ordens detectadas em sequência. Aguarde e tente novamente."
        );
        return;
      }
      notifyError("Oops! Não foi possível enviar a ordem.");
    }
  };

  const disableButton =
    parseInt(amount) === 0 ||
    countValue < (isNewOptionsTab ? 6000 : 4000) ||
    chartButtonsDisabled ||
    selectedSymbolMarketStatus === "CLOSED";

  return (
    <Stack direction="column" gap={1}>
      {!!isMobile && (
        <Box
          className="box_container"
          style={{
            display: "flex",
            color: "#CCC",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "14px",
          }}
        >
          <span
            className="compra"
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {purchase === 0 ? 0 : purchase.toFixed(0)}%
          </span>
          <span
            className="ativo_linha"
            style={{
              display: "flex",
              width: "100%",
              height: "4px",
              position: "relative",
              gap: "4px",
            }}
          >
            <span
              className="compra_bar"
              style={{
                display: "inline-block",
                height: "100%",
                width: `${purchase}%`,
                backgroundColor: "rgb(27, 186, 135)",
                transition: "width 1s ease",
                borderRadius: "16px",
              }}
            ></span>
            <span
              className="venda_bar"
              style={{
                display: "inline-block",
                height: "100%",
                width: `${100 - purchase}%`,
                backgroundColor: "rgb(255, 2, 92)",
                transition: "width 1s ease",
                borderRadius: "16px",
              }}
            ></span>
          </span>
          <span
            className="venda"
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {sale === 0 ? 0 : sale.toFixed(0)}%
          </span>
        </Box>
      )}
      <Stack
        direction={isMobile ? "row" : "column"}
        spacing={isMobile ? 2 : 1}
        justifyContent="space-between"
        alignContent={"end"}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: "100%",
            minHeight: isMobile ? 40 : 70,
            borderRadius: "8px",
            display: "flex",
            gap: "0.5rem",
            "&:hover": {
              backgroundColor: "#08865a",
            },
          }}
          onClick={() => placeOrder("bull")}
          disabled={disableButton}
          id="button-bull"
        >
          <Typography
            fontSize="0.875rem"
            fontWeight="600"
            textTransform="uppercase"
          >
            {t("bull")}
          </Typography>
          <TrendingUpIcon fontSize="medium" />
        </Button>

        {!isMobile && (
          <Box
            className="box_container"
            style={{
              display: "flex",
              color: "#CCC",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "14px",
            }}
          >
            <span
              className="compra"
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: "600",
              }}
            >
              {purchase === 0 ? 0 : purchase.toFixed(0)}%
            </span>
            <span
              className="ativo_linha"
              style={{
                display: "flex",
                width: "100%",
                height: "4px",
                position: "relative",
                gap: "4px",
              }}
            >
              <span
                className="compra_bar"
                style={{
                  display: "inline-block",
                  height: "100%",
                  width: `${purchase}%`,
                  backgroundColor: "rgb(27, 186, 135)",
                  transition: "width 1s ease",
                  borderRadius: "16px",
                }}
              ></span>
              <span
                className="venda_bar"
                style={{
                  display: "inline-block",
                  height: "100%",
                  width: `${100 - purchase}%`,
                  backgroundColor: "rgb(255, 2, 92)",
                  transition: "width 1s ease",
                  borderRadius: "16px",
                }}
              ></span>
            </span>
            <span
              className="venda"
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: "600",
              }}
            >
              {sale === 0 ? 0 : sale.toFixed(0)}%
            </span>
          </Box>
        )}

        <Button
          sx={{
            width: "100%",
            minHeight: isMobile ? 40 : 70,
            borderRadius: "8px",
            backgroundColor: "#FF025C",
            gap: "0.5rem",
            padding: isMobile ? "0" : null,
            "&:hover": {
              backgroundColor: "#CC024D",
            },
          }}
          variant="contained"
          onClick={() => placeOrder("bear")}
          disabled={disableButton}
          id="button-bear"
        >
          <Typography
            fontSize="0.875rem"
            fontWeight="600"
            textTransform="uppercase"
          >
            {t("bear")}
          </Typography>
          <TrendingDownIcon fontSize="medium" />
        </Button>
      </Stack>
    </Stack>
  );
}
