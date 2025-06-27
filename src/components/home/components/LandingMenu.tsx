import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { BiLinkExternal, BiLogoBitcoin, BiSolidBusiness } from "react-icons/bi";
import { BsFillCreditCardFill } from "react-icons/bs";
import { CgLoadbarDoc } from "react-icons/cg";
import { FaGraduationCap, FaQuestion } from "react-icons/fa";
import { GiClick } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router";
import { useTestMode } from "src/contexts/TestModeContext";
import LanguageSelect from "./LanguageSelect";

const menuStyle = {
  "& .MuiPaper-root": {
    background: "transparent",
  },
  ".MuiPaper-root:before": { display: "none" },
  "& .MuiList-root": {
    width: "100%",
    maxHeight: "calc(100vh - 100px)",
    background: "rgb(0 9 14 / 97%)",
    borderRadius: "8px",
    backdropFilter: "blur(10px)",
    marginTop: "20px",
  },
  "& .header_info, & .footer_info": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "& .header_info .copy_id": {
    color: "#AAA",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",

    "&:hover": {
      color: "#01DB97",
      fill: "#01DB97",
    },
  },
  "& .footer_info": {
    paddingTop: "0.5rem",
  },
  "& .middle_info": {
    color: "#EEE",
    display: "flex",
    justifyContext: "center",
    gap: "0.5rem",
  },

  "& .middle_info .middle_info_flex": {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  "& .middle_info .list_item": {
    gap: "0.5rem",
    borderRadius: "8px",
    backgroundColor: "#0c161a",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    fontWeight: "500",
    paddingLeft: isMobile ? "4.5rem" : "2rem",

    "& svg": {
      fill: "#01DB97",
    },

    "&: hover": {
      background: "#111e23",
      color: "#FFF",
    },
  },
  "& .footer_info li": {
    padding: "1rem 0.5rem",
    gap: "0.5rem",

    "&: hover": {
      background: "transparent",
      color: "#01DB97",
    },
    "&.logout:hover": {
      background: "transparent",
      color: "#FF025C",
    },
  },
};

const style = {
  background: "transparent ",

  "& .MuiButtonBase-root": {
    background: "transparent",
    color: "#EEE",
  },

  "& .MuiList-root": {
    background: "#040709",
    color: "#EEE",
  },

  "& .bg_menu_item": {
    background: "transparent",
    color: "#EEE",
  },
};

export default function LandingMenu() {
  const { t, i18n } = useTranslation("navigation_header_menu");

  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const screenLessThanMd = useMediaQuery(theme.breakpoints.down("md"));

  const open = Boolean(anchorEl);

  const { createTestId } = useTestMode();

  const handleMenuClick = (event: MouseEvent<HTMLElement>, label: string) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu((prev) => (prev === label ? null : label));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const handleMenuOptionClick = (href?: string) => {
    if (!!href) {
      navigate(href);
    }

    setActiveMenu(null);
  };

  const navLinks = [
    {
      label: t("trade"),
      testId: "trade-button",
      subLinks: [
        {
          label: t("trading_portal"),
          description: t("trading_portal_description"),
          icon: <BiLinkExternal size={20} color="#01DB97" />,
          href: "/traderoom",
        },
        {
          label: t("spot"),
          description: t("spot_description"),
          icon: <BiLogoBitcoin size={20} color="#01DB97" />,
          href: "/exchange",
        },
        {
          label: t("new_options"),
          description: t("new_options_description"),
          icon: <MdCandlestickChart size={20} color="#01DB97" />,
          href: "/traderoom",
        },
        // {
        //   label: t("retracement"),
        //   description: t("retracement_description"),
        //   icon: <CgTimelapse size={20} color="#01DB97" />,
        //   href: "/traderoom",
        // },
        // {
        //   label: t("prediction"),
        //   description: t("prediction_description"),
        //   icon: <SiCodemagic size={20} color="#01DB97" />,
        //   href: "/exchange/trade/prediction",
        // },
      ],
    },
    {
      label: t("buy_crypto"),
      subLinks: [
        {
          label: t("buy_with_one_click"),
          description: t("buy_with_one_click_description"),
          icon: <GiClick size={20} color="#01DB97" />,
          href: "/exchange",
        },
        {
          label: t("deposit_with_pix"),
          description: t("deposit_with_pix_description"),
          icon: <BsFillCreditCardFill size={20} color="#01DB97" />,
          href: "/dashboard/profile/deposit",
        },
        // {
        //   label: t("deposit_with_crypto"),
        //   description: t("deposit_with_crypto_description"),
        //   icon: <BsCurrencyBitcoin size={20} color="#01DB97" />,
        //   href: "/dashboard/profile/deposit",
        // },
      ],
    },
    {
      label: t("education"),
      subLinks: [
        {
          label: t("blog"),
          description: t("blog_description"),
          icon: <BiLinkExternal size={20} color="#01DB97" />,
        },
        {
          label: t("what_is_bitcoin"),
          description: t("what_is_bitcoin_description"),
          icon: <BiLogoBitcoin size={20} color="#01DB97" />,
        },
        {
          label: t("what_are_new_options"),
          description: t("what_are_new_options_description"),
          icon: <MdCandlestickChart size={20} color="#01DB97" />,
        },
      ],
    },
    {
      label: t("more"),
      subLinks: [
        {
          label: t("faq"),
          description: t("faq_description"),
          icon: <FaQuestion size={20} color="#01DB97" />,
        },
        {
          label: t("about_us"),
          description: t("about_us_description"),
          icon: <BiSolidBusiness size={20} color="#01DB97" />,
        },
        {
          label: t("demo_account"),
          description: t("demo_account_description"),
          icon: <FaGraduationCap size={20} color="#01DB97" />,
        },
        {
          label: t("regulations"),
          description: t("regulations_description"),
          icon: <CgLoadbarDoc size={20} color="#01DB97" />,
        },
      ],
    },
  ];

  if (screenLessThanMd) {
    return (
      <>
        <Tooltip title="Menu">
          <Box sx={{ alignSelf: "center" }}>
            <IconButton
              aria-label="Abrir menu"
              onClick={(e) => handleMenuClick(e, "")}
              size="small"
              sx={{ padding: 0 }}
            >
              <RxHamburgerMenu size={24} color="#FBFFFF" />
            </IconButton>
          </Box>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          sx={menuStyle}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box className="header_info">
            <Box
              sx={{
                display: "flex",
                flexDirection: screenLessThanMd ? "column" : "row",
                alignItems: screenLessThanMd ? "flex-start" : "center",
                justifyContent: screenLessThanMd ? "initial" : "space-between",
              }}
            >
              {navLinks.map((item) => (
                <Accordion
                  sx={{
                    width: "240px",
                  }}
                  key={item.label}
                >
                  <AccordionSummary>
                    <Typography
                      fontSize="0.875rem"
                      fontWeight={500}
                      color="#FFF"
                      fontFamily="Inter"
                    >
                      {item.label}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      background: "transparent",
                    }}
                  >
                    {item.subLinks.map((subLink) => (
                      <Box
                        onClick={() => {
                          if (subLink.externalLink) {
                            window.open(subLink.externalLink, "_self");
                          } else {
                            handleMenuOptionClick(subLink.href);
                          }
                        }}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: ".5rem",
                          paddingBottom: "1rem",
                          paddingLeft: "0.5rem",
                          transition: "transform 0.4s",
                          "&:hover": {
                            transform: "translateX(4px)",
                            borderLeft: "2px solid #10f8a0",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Box
                            className="icon_circle"
                            sx={{
                              background: "rgba(0, 166, 103, 0.2)",
                              borderRadius: "50%",
                              width: "2rem",
                              height: "2rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {subLink.icon}
                          </Box>
                          <Typography variant="subtitle1">
                            {subLink.label}
                          </Typography>
                        </Box>
                        <Typography
                          fontSize={12}
                          fontWeight={400}
                          fontFamily="Inter"
                          color="#909090"
                          flex={1}
                          sx={{ textWrap: "auto" }}
                        >
                          {subLink.description}
                        </Typography>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
              {/* <Typography fontSize="1rem" fontWeight={600} color="#FFF">
                {user?.name}
              </Typography>
              <Typography
                variant="body2"
                className="copy_id"
                onClick={(e) => handleCopy(e, user?.publicId)}
                color={copiedLink !== null && "#01DB97 !important"}
              >
                ID: {copiedLink !== null ? `${t("copied")}!` : user?.publicId}{" "}
                <BsCopy size={12} />
              </Typography> */}
            </Box>
            {/* {screenLessThanMd && <SoundButton />} */}
          </Box>
        </Menu>
      </>
    );
  }

  return (
    <AppBar elevation={0} position="sticky" sx={style} id="navigation">
      <Toolbar>
        {navLinks.map((item) => (
          <div key={item.label}>
            <Button
              {...createTestId(item.testId)}
              color="inherit"
              onClick={(e) => handleMenuClick(e, item.label)}
              sx={{ fontSize: 14, fontWeight: 400 }}
            >
              {item.label}
              <IoIosArrowDown style={{ marginLeft: ".5rem" }} />
            </Button>

            {/* Menu para cada link de navegação */}
            <Menu
              anchorEl={anchorEl}
              open={activeMenu === item.label}
              onClose={handleMenuClose}
              sx={{
                "& .MuiPaper-root": {
                  color: "#EEE",
                  background: "#040709d1",
                  backdropFilter: "blur(12px)",
                  border: "1px solid #0d1215",
                  borderRadius: "8px",
                  marginTop: "0.5rem",
                },
              }}
            >
              {item.subLinks.map((subLink) => {
                const isExchange = subLink.href?.includes("/exchange");

                return (
                  <MenuItem key={subLink.label}>
                    <Box
                      component={isExchange ? "a" : undefined}
                      href={subLink.href}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: ".5rem",
                        paddingBottom: "1rem",
                        paddingLeft: "0.5rem",
                        textDecoration: "none",
                        transition: "transform 0.4s",
                        textWrap: "auto",
                        "&:hover": {
                          transform: "translateX(4px)",
                          borderLeft: "2px solid #10f8a0",
                        },
                      }}
                      onClick={() => {
                        if (subLink.externalLink) {
                          window.open(subLink.externalLink, "_self");
                        } else {
                          handleMenuOptionClick(subLink.href);
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Box className="icon_circle">{subLink.icon}</Box>
                        <Typography variant="subtitle1">
                          {subLink.label}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="#909090"
                        width={300}
                        whiteSpace="normal"
                      >
                        {subLink.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        ))}
        <Box ml={2}>{!isMobile && <LanguageSelect />}</Box>
      </Toolbar>
    </AppBar>
  );
}
