import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BsGraphUp } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { RevenueCard } from "src/components/dashboard/operations-history/revenue-card";
import useOperationsRevenue from "src/swr/use-operations-revenue";

interface OperationsRevenueProps {
  query: string;
  assertivityOperations: {
    dataChart: Array<{
      status: string;
      accumulated: number;
    }>;
    assertivityPercentage: number;
  };
  totalAmountOperations: number;
}

export default function OperationsRevenue({
  assertivityOperations,
  query,
  totalAmountOperations,
}: OperationsRevenueProps) {
  const { t } = useTranslation("operationsStatistics");

  const { data: operationsRevenue, loading: loadingRevenue } =
    useOperationsRevenue({
      query,
    });

  return (
    <Grid container gap={3} py={4}>
      <RevenueCard
        icon={<MdAttachMoney size={28} color="white" />}
        loadingRevenue={loadingRevenue}
        title={t("revenue")}
        type="revenue"
        dataChart={operationsRevenue?.revenueByDate}
      />
      <RevenueCard
        loadingRevenue={loadingRevenue}
        title={t("assertivity")}
        type="assertivity"
        dataChart={assertivityOperations.dataChart}
        assertivityOperations={assertivityOperations.assertivityPercentage}
      />
      <RevenueCard
        icon={<BsGraphUp size={22} color="#FF5912" />}
        loadingRevenue={loadingRevenue}
        title={t("total_operations")}
        type="total-operations"
        dataChart={operationsRevenue?.revenueByDate}
        totalAmountOperations={totalAmountOperations}
      />
    </Grid>
  );
}
