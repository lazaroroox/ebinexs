import { FC } from "react";
import { format } from "date-fns";
import { Typography, Stack, Box } from "@mui/material";
import PropTypes from "prop-types";
import { OrderBookItem } from "../../types/order";
import { useTranslation } from "react-i18next";

const scrollStyle = {
  maxHeight: "80px",
  marginLeft: "4px",
  overflow: "auto",
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

interface Column {
  id: "invest" | "createdAt";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number | Date) => string;
}

const columns: Column[] = [
  {
    id: "invest",
    label: "value",
    minWidth: 90,
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "createdAt",
    label: "time",
    minWidth: 90,
    align: "right",
    format: (value: Date) => format(new Date(value), "HH:mm:ss"),
  },
];

interface OrderBookProps {
  orders: OrderBookItem[];
  color?: string;
  rowColor?: string;
  showColumnLabel?: boolean;
}

const OrderBookTable: FC<OrderBookProps> = (props) => {
  const { t } = useTranslation("dashboard");
  const { orders, color, rowColor, showColumnLabel = true } = props;

  const getPercentageColor = (value) => {
    const maxValue = Math.max.apply(
      null,
      orders.map((o) => o.invest)
    );
    return ((value / maxValue) * 100).toFixed(2);
  };

  return (
    <Box sx={{ py: 1, px: 2 }}>
      {showColumnLabel && (
        <Stack
          direction={"row"}
          justifyContent="space-between"
          sx={{ my: 1, pr: "1rem" }}
        >
          {columns.map((column) => (
            <Typography
              key={`column-${column.id}`}
              fontWeight={500}
              color="#606f79"
              fontSize={14}
              lineHeight={1}
            >
              {t(column.label)}
            </Typography>
          ))}
        </Stack>
      )}
      <Stack direction={"column"} spacing={1}>
        <Box sx={scrollStyle}>
          {orders.map((row, index) => (
            <Box
              key={`order-${index}}-${row.id}`}
              sx={{
                mt: "0px !important",
                mr: "8px",
                borderRadius: 1,
                background: `linear-gradient(90deg, ${rowColor} ${getPercentageColor(
                  row.invest
                )}%, #00000000 ${getPercentageColor(row.invest)}%)`,
              }}
            >
              <Stack
                direction={"row"}
                justifyContent="space-between"
                sx={{ mb: "2px" }}
              >
                {columns.map((column, index) => {
                  const value = row[column.id];
                  return (
                    <Typography
                      key={`${row.id}--${index}-${column.id}`}
                      sx={{
                        fontWeight: 500,
                        py: 0.5,
                        px: 1,
                        textAlign: column.id === "createdAt" ? "end" : null,
                        color: column.id === "invest" ? color : "white",
                      }}
                      fontWeight={500}
                      fontSize={14}
                    >
                      {column.format ? column.format(value) : value}
                    </Typography>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

OrderBookTable.propTypes = {
  orders: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
  rowColor: PropTypes.string.isRequired,
};

export default OrderBookTable;
