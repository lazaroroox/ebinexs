import labelsColors from "src/theme/labelsColors";
import { OrderDirectionEnum } from "src/types/order";
import formatCurrency from "./formatCurrency";

export const getResulteOnLive = ({
  order,
  payout,
  lastDailyBar,
}: {
  order: any;
  payout: number;
  lastDailyBar: any;
}) => {
  const accept = order.accept;

  let status = "PENDING";

  if (accept > 0) {
    status = "OPEN";

    const amount = order.accept;
    let estimateIncome = amount * (payout / 100);
    estimateIncome = parseFloat(estimateIncome.toFixed(3));

    const numericResult = parseFloat(estimateIncome.toFixed(2));
    const formattedResult = formatCurrency(numericResult);

    if (order.direction === OrderDirectionEnum.BULL.toUpperCase()) {
      return order.cop < lastDailyBar.close
        ? {
            color: labelsColors["WIN"].color,
            simbol: "+",
            result: formattedResult,
            value: numericResult,
            status,
          }
        : {
            color: labelsColors["LOSE"].color,
            simbol: "-",
            result: formatCurrency(order.accept ?? 0),
            value: order.accept ?? 0,
            status,
          };
    } else {
      return order.cop > lastDailyBar.close
        ? {
            color: labelsColors["WIN"].color,
            simbol: "+",
            result: formattedResult,
            value: numericResult,
            status,
          }
        : {
            color: labelsColors["LOSE"].color,
            simbol: "-",
            result: formatCurrency(order.accept ?? 0),
            value: order.accept ?? 0,
            status,
          };
    }
  } else {
    return {
      color: labelsColors["PENDING"].color,
      simbol: "",
      result: formatCurrency(order.invest ?? 0),
      value: order.invest ?? 0,
      status,
    };
  }
};
