import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsightsIcon from "@mui/icons-material/Insights";
import {
  Accordion,
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import { orderBy } from "lodash";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsCopy } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";
import HistoryCandles from "src/components/HistoryCandles";
import OptionBull from "src/components/icons/OptionBull";
import OptionSell from "src/components/icons/OptionSell";
import RetractionBull from "src/components/icons/RetractionBull";
import RetractionSell from "src/components/icons/RetractionSell";
import HistoryCandlesModal from "src/components/modals/HistoryCandles";
import { symbolsInfo } from "src/constants"; // Importa symbolsInfo
import useApiData from "src/hooks/useApiData";
import useHistoryOrders from "src/swr/use-history-orders";
import useOperationFilters from "src/swr/use-operation-filters";
import useParameters from "src/swr/use-parameters";
import labelsColors from "src/theme/labelsColors";
import { currencyFormat } from "src/utils/currencyFormat";
import { useLocalStorage } from "usehooks-ts";
import { scrollStyle } from ".";

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#00000090" : "#00000090",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start !important",
  paddingLeft: 0,
  "& .info": {
    display: "flex",
    alignItems: "center",
  },
  "& .profit": {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "0.25rem",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#00000080" : "#00000080",
}));

const HistoryOrders = () => {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useLocalStorage<string>(
    "currentTab",
    "order_book"
  );
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    "panel1"
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { parameters } = useParameters();
  const { pairs } = useOperationFilters();

  const {
    data: apiOrders,
    loading,
    mutate,
  } = useHistoryOrders({
    parameters,
    pairs,
  });

  const { userOrders, updateUserOrders } = useApiData();

  useEffect(() => {
    if (apiOrders) {
      const combinedData = apiOrders.map((apiItem) => {
        const matchingSymbol = symbolsInfo.find(
          (symbolInfo) => symbolInfo.name === apiItem.symbol
        );

        return {
          ...apiItem,
          symbol: matchingSymbol?.symbol,
          image: matchingSymbol?.image,
        };
      });

      updateUserOrders(
        orderBy(combinedData, [(item) => new Date(item.createdAt)], ["desc"])
      );
    }
  }, [apiOrders]);

  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedAccordion(newExpanded ? panel : false);
    };

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedLink(text);
          setTimeout(() => {
            setCopiedLink(null);
          }, 1500);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const handleOpenModal = (item: any) => {
    setSelectedOrder(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const statusLabelMap: Record<string, string> = {
    REFUNDED: t("refunded"),
    WIN: t("win"),
    LOSE: t("lose"),
  };

  return (
    <>
      {loading || !userOrders || userOrders.length === 0 ? (
        <Stack
          flex={1}
          flexDirection={"column"}
          p={1}
          alignItems={"center"}
          justifyContent={"center"}
          spacing={1}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#00C38126",
              borderRadius: "50%",
              width: 52,
              height: 52,
            }}
          >
            <MdWorkHistory color="#00B474" size={27} />
          </Box>
          <Typography fontWeight={500} fontSize={14} color="#EFEFEF">
            {t("not_order_found")}
          </Typography>
          <Typography
            color="#919eab"
            variant="body1"
            px={1.4}
            textAlign={"center"}
          >
            {t("the_operations_you_perform_will_appear_here")}
          </Typography>
        </Stack>
      ) : (
        <>
          <Box sx={scrollStyle}>
            {userOrders.map((item) => (
              <Accordion
                key={item.id}
                expanded={expandedAccordion === item.id}
                onChange={handleChangeAccordion(item.id)}
                elevation={0}
                sx={{
                  paddingLeft: 0,
                  "& .MuiAccordionSummary-content": {
                    display: "flex",
                    justifyContent: "space-between",
                  },
                  "& .MuiAccordionSummary-root": {
                    bgcolor: "transparent",
                    background: "transparent",
                    height: "64px",
                    border: `0`,
                    borderBottom: `1px solid #0d1b24`,
                    "&:last-of-type": {
                      border: 0,
                    },
                  },
                  background: "transparent",
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      justifyContent: "space-around",
                    },
                  }}
                >
                  <div className="info">
                    <img width={40} src={item.image} />
                    <div>
                      <Typography color={"#EEE"}>{item.symbol}</Typography>
                      <Typography variant="body1" color={"#797979"}>
                        {format(new Date(item.candleStartTime), "HH:mm")} /{" "}
                        {item.binaryOrderType === "OPTION"
                          ? item.candleTimeFrame
                          : format(new Date(item.candleEndTime), "HH:mm")}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className="profit"
                    style={{ width: isMobile && "150px" }}
                  >
                    {item.direction.toUpperCase() === "BULL" ? (
                      item.binaryOrderType === "OPTION" ? (
                        <OptionBull />
                      ) : (
                        <RetractionBull />
                      )
                    ) : item.binaryOrderType === "OPTION" ? (
                      <OptionSell />
                    ) : (
                      <RetractionSell />
                    )}
                    <Typography
                      color={labelsColors[item.status].color}
                      variant="body1"
                    >
                      {item.status.toUpperCase() === "WIN"
                        ? `+ ${currencyFormat(item.profit)}`
                        : item.status.toUpperCase() === "LOSE"
                        ? `- ${currencyFormat(item.accept)}`
                        : currencyFormat(item.accept)}
                    </Typography>
                  </div>
                </AccordionSummary>
                {currentTab === "history" && (
                  <AccordionDetails sx={{ bgcolor: "transparent" }}>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("type_of_operation")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {item.binaryOrderType === "OPTION"
                            ? t("new_options")
                            : t("retraction")}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("status")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {statusLabelMap[item.status.toUpperCase()] ||
                            t("unknown_status")}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("direction")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {item.direction.toUpperCase() === "BEAR"
                            ? t("bear")
                            : t("bull")}
                        </Typography>
                      </Typography>
                    </Box>
                    {item.binaryOrderType === "OPTION" && (
                      <Box>
                        <Typography color="#606f79" variant="subtitle1">
                          {t("candle_timeFrame")}:{" "}
                          <Typography
                            color="#EEE"
                            display="inline-block"
                            variant="body1"
                          >
                            {item.candleTimeFrame}
                          </Typography>
                        </Typography>
                      </Box>
                    )}
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("par_comercial")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {item.symbol}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("operation_date")} :{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {format(new Date(item.createdAt), "dd/M/yyyy")}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {item.direction.toUpperCase() === "BEAR"
                          ? t("time_to_sell")
                          : t("time_to_buy")}
                        :{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {format(new Date(item.createdAt), "HH:mm:ss")}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("open_time")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {format(new Date(item.candleStartTime), "HH:mm:ss")}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("expiration_time")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {format(new Date(item.candleEndTime), "HH:mm:ss")}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="#606f79" variant="subtitle1">
                        {t("open_price")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                        >
                          {currencyFormat(item.cop)}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        if (item.binaryOrderType === "OPTION") {
                          handleOpenModal(item);
                        }
                      }}
                    >
                      <Typography color="#606f79" variant="subtitle1">
                        {t("close_price")}:{" "}
                        <Typography
                          color="#EEE"
                          display="inline-block"
                          variant="body1"
                          mr={1}
                        >
                          {currencyFormat(item.ccp)}
                        </Typography>
                        {item.binaryOrderType === "OPTION" && (
                          <InsightsIcon
                            sx={{
                              color: "#1bba87",
                              fontSize: "1rem",
                              verticalAlign: "middle",
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleCopy(item.id)}
                    >
                      <Typography color="#606f79" variant="subtitle1">
                        ID:{" "}
                        <Typography
                          color={copiedLink !== null ? "#1bba87" : "#EEE"}
                          display="inline-block"
                          variant="body1"
                          mr={1}
                        >
                          {copiedLink !== null ? `${t("copied")}!` : item.id}
                        </Typography>
                        <BsCopy size={14} color="#606f79" />
                      </Typography>
                    </Box>
                  </AccordionDetails>
                )}
              </Accordion>
            ))}
          </Box>
          <HistoryCandlesModal
            open={openModal}
            handleClose={() => handleCloseModal()}
            title="Histórico de Velas"
          >
            {selectedOrder && <HistoryCandles order={selectedOrder} />}
          </HistoryCandlesModal>
        </>
      )}
    </>
  );
};

export default memo(HistoryOrders);
