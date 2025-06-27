import { Box, Button, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { ChangeEvent, FC, memo, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useOrderBook from "src/hooks/useOrderBook";
import { useLocalStorage } from "usehooks-ts";

import useApiData from "src/hooks/useApiData";
import { Order } from "src/types/order";
import OrderBookSwitch from "../OrderBookSwitch";
import OrderBookTable from "../OrderBookTable";
import HistoryOrders from "./HistoryOrders";
import LiveOrders from "./LiveOrders";

export const winLostIconStyle = {
  width: "1.4rem",
  height: "1.4rem",
  fontSize: "0.85rem",
  fontWeigth: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  padding: ".75rem",
};

export const scrollStyle = {
  // maxHeight: "230px",
  marginLeft: "8px",
  overflow: "auto",
  paddingBottom: "16px",
  " &::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#1c1c1c",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#01DB97",
    borderRadius: "20px",
    border: "none",
  },
};

export interface OrderWithImage extends Order {
  image: string;
  symbol: string;
}

const OperationsTab: FC = () => {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { bookRed, bookGreen, isLoading } = useOrderBook();
  const {
    selectedCandle,
    userLiveOperations,
    userOrders,
    updateUserOrders,
    operationMode,
  } = useApiData();

  const [currentTab, setCurrentTab] = useLocalStorage<string>(
    "currentTab",
    "order_book"
  );

  const navigate = useNavigate();

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const tabs = [
    { label: t("operations"), value: "operations" },
    { label: t("orders"), value: "order_book" },
    { label: t("history"), value: "history" },
  ];

  const isNewOptionsTab = operationMode === "OPTION";

  const visibleTabs = isNewOptionsTab
    ? tabs
    : tabs.filter((tab) => tab.value !== "order_book");

  useEffect(() => {
    if (!isNewOptionsTab && currentTab === "order_book") {
      setCurrentTab("operations");
    }
  }, [isNewOptionsTab, currentTab]);

  const previousOperationsRef = useRef({});

  useEffect(() => {
    const currentOperations = Object.keys(userLiveOperations);
    const previousOperations = Object.keys(previousOperationsRef.current);
    const isNewOperationCreated =
      currentOperations.length > previousOperations.length;

    if (isNewOperationCreated && currentTab !== "operations") {
      setCurrentTab("operations");
    }

    previousOperationsRef.current = userLiveOperations;
  }, [userLiveOperations]);

  return (
    <Box
      sx={{
        // outline: "1px solid #0b1721",
        minHeight: 320,
        bgcolor: "#040c11",
        borderRadius: "8px",
        marginTop: isMobile ? 2 : 0,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
      }}
      className="order-book-section"
    >
      <Box>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
          textColor="primary"
          value={currentTab}
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
          }}
        >
          {visibleTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              sx={{
                textTransform: "capitalize",
                fontSize: ".85rem",
                flex: 1,
                maxWidth: "unset",
              }}
            />
          ))}
        </Tabs>
      </Box>

      {currentTab === "order_book" && (
        <Box
          sx={{
            maxHeight: "300px",
            overflow: "auto",
          }}
        >
          <OrderBookTable
            orders={bookGreen}
            color="#00ffae"
            rowColor="#1e4438"
          />
          <OrderBookSwitch isLoading={isLoading} />
          <OrderBookTable
            orders={bookRed}
            color="#FF025C"
            rowColor="#37131c"
            showColumnLabel={false}
          />
        </Box>
      )}
      {currentTab === "operations" && <LiveOrders />}
      {currentTab === "history" && <HistoryOrders />}
      {currentTab === "history" && (
        <Button
          onClick={() => navigate("/dashboard/profile/orders_center_trade")}
          sx={{
            width: "100%",
            background: "#10171c",
            color: "#83939f",
            padding: "0.1rem 1rem",
            zIndex: "5",
            display: "flex",
            borderRadius: "0 0 4px 4px",
            justifyContent: "space-between",
            outline: "1px solid #0b1721",
            fontSize: ".8rem",
            "&:hover": {
              background: "#172630",
            },
          }}
        >
          {t("full_history")} <FiExternalLink size={16} />
        </Button>
      )}
    </Box>
  );
};

export default memo(OperationsTab);
