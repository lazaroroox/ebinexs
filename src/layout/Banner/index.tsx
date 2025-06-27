import { autocompleteClasses, Box, Container, Stack, useMediaQuery, useTheme } from "@mui/material";
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { HeaderSection } from "./HeaderSection";
import bannerImg from "src/assets/images/banner_new_ebinex.png";
import bannerImgMobile from "src/assets/images/banner_new_ebinex_mobile.png";


const style = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  "& .banner_image": {
    width: "100%",
  },
};
export function DepositPromotionBanner() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box sx={style} component={Stack} direction="column" gap={2.5}>
      <HeaderSection
        icon={<BsFillRocketTakeoffFill size={20} />}
        title="Faça mais com a ebinex"
      />

      <Box minHeight={{ sm: 'auto', md: 300 }} position="relative">
        {isMobile ? (
          <img
            className="banner_image"
            src={bannerImgMobile}
            alt="banner example new ebinex exchange"
          />
        ) : (
          <img
            className="banner_image"
            src={bannerImg}
            alt="banner example new ebinex exchange"
          />
        )}
      </Box>
    </Box>
  );
}
