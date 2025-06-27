import { useTranslation } from "react-i18next";
import { AiFillThunderbolt } from "react-icons/ai";
import { HiReceiptPercent } from "react-icons/hi2";
import { MdCandlestickChart } from "react-icons/md";
import DepositListTable from "./DepositListTable";
import DepositPaymentDetails from "./DepositPaymentDetails";
import GoodPointsSection from "./GoodPointsDeposit";

const DepositScreenWrapper = () => {
  const { t } = useTranslation("deposit_page");
  const cardsMock = [
    {
      id: 1,
      label: t("good_points_section.cards.label_1"),
      description: t("good_points_section.cards.description_1"),
      icon: <AiFillThunderbolt size={28} />,
    },
    {
      id: 2,
      label: t("good_points_section.cards.label_2"),
      description: t("good_points_section.cards.description_2"),
      icon: <MdCandlestickChart size={28} />,
    },
    {
      id: 3,
      label: t("good_points_section.cards.label_3"),
      description: t("good_points_section.cards.description_3"),
      icon: <HiReceiptPercent size={28} />,
    },
  ];

  return (
    <>
      <DepositPaymentDetails />
      <GoodPointsSection
        cardsMock={cardsMock}
        title={t("good_points_section.title")}
      />
      <DepositListTable />
    </>
  );
};

export default DepositScreenWrapper;
