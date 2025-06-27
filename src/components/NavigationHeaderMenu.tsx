import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MouseEvent, useContext, useEffect, useMemo, useState } from "react";
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
import Logo from "src/components/Logo";
import MenuTimezone from "src/components/menus/MenuTimezone";
import SettingsContext from "src/contexts/SettingsContext";
import X from "src/icons/X";

const languageOptions = {
  br: {
    icon: "/static/icons/pt_flag.png",
    label: "Português",
  },
  en: {
    icon: "/static/icons/uk_flag.svg",
    label: "English",
  },
  es: {
    icon: "/static/icons/es_flag.svg",
    label: "Español",
  },
};

const NavigationHeaderMenu = () => {
  const { t, i18n } = useTranslation("navigation_header_menu");

  const { settings } = useContext(SettingsContext);

  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const screenLessThanMd = useMediaQuery(theme.breakpoints.down("md"));
  const open = Boolean(anchorEl);

  const navLinks = [
    {
      label: t("trade"),
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

  const selectedLanguage = useMemo(() => {
    if (settings.language) {
      return languageOptions[settings.language];
    }

    return languageOptions["br"];
  }, [settings]);

  useEffect(() => {
    if (settings && typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(settings.language);
    }
  }, [settings, i18n]);

  if (screenLessThanMd) {
    return (
      <>
        <Tooltip title="Menu">
          <Box sx={{ alignSelf: "center" }}>
            <IconButton
              onClick={(e) => handleMenuClick(e, "")}
              size="small"
              sx={{ padding: 0 }}
            >
              <RxHamburgerMenu size={24} color="#FBFFFF" />
            </IconButton>
          </Box>
        </Tooltip>
        <Drawer
          anchor="right"
          open={open}
          onClose={handleMenuClose}
          sx={{
            "& .MuiDrawer-paper": {
              background: "#01080C",
              px: "1.5rem",
              py: "3.75rem",
            },
          }}
        >
          <Stack
            direction="column"
            flex={1}
            justifyContent="flex-start"
            gap={7}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Logo />
              <X onClick={handleMenuClose} />
            </Stack>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {navLinks.map((item) => (
                <Accordion
                  sx={{
                    width: "240px",
                    background: "transparent",
                  }}
                  key={item.label}
                >
                  <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
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
                        key={subLink.label}
                        component={"a"}
                        href={subLink.href}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: ".5rem",
                          paddingBottom: "1rem",
                          paddingLeft: "0.5rem",
                          transition: "transform 0.4s",
                          textDecoration: "none",
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
            </Box>

            <MenuTimezone selectedOptionLanguage={selectedLanguage} />
          </Stack>
        </Drawer>
      </>
    );
  }

  return (
    <AppBar
      elevation={0}
      position="sticky"
      sx={{
        width: "max-content",
        background: "transparent !important",

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
      }}
      id="navigation"
    >
      <Toolbar disableGutters sx={{ px: "1rem" }}>
        {navLinks.map((item) => (
          <div key={item.label}>
            <Button
              color="inherit"
              onClick={(e) => handleMenuClick(e, item.label)}
              sx={{ fontSize: 14, fontWeight: 400, px: "0.5rem" }}
            >
              {item.label}
              <IoIosArrowDown style={{ marginLeft: ".5rem" }} />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={activeMenu === item.label}
              onClose={handleMenuClose}
              sx={{
                "& .MuiPaper-root": {
                  background: "#030B10",
                  color: "#EEE",
                  borderRadius: "8px",
                  border: "2px solid #15181A",
                  marginTop: "0.5rem",
                  backdropFilter: "blur(12px)",
                },
              }}
            >
              {item.subLinks.map((subLink) => (
                <MenuItem
                  key={subLink.label}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: ".5rem",
                    paddingBottom: "1rem",
                    transition: "transform 0.4s",
                    "&:hover": {
                      transform: "translateX(4px)",
                      borderLeft: "2px solid #10f8a0",
                    },
                  }}
                >
                  <Box
                    component="a"
                    href={subLink.href}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: ".5rem",
                      textDecoration: "none",
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
              ))}
            </Menu>
          </div>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationHeaderMenu;
