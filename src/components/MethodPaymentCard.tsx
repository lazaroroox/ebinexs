import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MethodItem } from "src/utils/constants";

const style = {
  background: "linear-gradient(317deg, #0a181c85, transparent)",
  height: "12rem",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",

  "&:hover": {
    outline: "2px solid #0ab575",
  },
};

interface MethodPaymentCardProps {
  onClickFn: () => void;
  methodItem: MethodItem;
}
const MethodPaymentCard = ({
  onClickFn,
  methodItem,
}: MethodPaymentCardProps) => {
  const { t } = useTranslation("dashboard");

  return (
    <>
      <Box sx={style} onClick={() => onClickFn()}>
        <Box>
          <img
            src={methodItem.imageSrc}
            alt={methodItem.title}
            width={methodItem.id === "pix" ? 50 : 100}
            style={{
              marginRight: methodItem.id === "pix" ? 12 : 0,
            }}
          />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600} color={"#fff"}>
            {t(methodItem.title)}
          </Typography>
          <Typography fontSize="1rem" fontWeight={400} color={"#72828b"}>
            {t(methodItem.subtitle)}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default MethodPaymentCard;
