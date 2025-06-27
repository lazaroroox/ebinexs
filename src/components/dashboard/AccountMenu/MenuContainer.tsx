import { Button, Grid, MenuItem, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

import { Logout } from "@mui/icons-material";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { CgArrowsExchange } from "react-icons/cg";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import {
  MdManageAccounts,
  MdOutlineWallet,
  MdWorkHistory,
} from "react-icons/md";
import { RiCoinsFill } from "react-icons/ri";
import { SiCodemagic } from "react-icons/si";
import { useNavigate } from "react-router";
import CopyOnClick from "src/components/CopyOnClick";
import {
  ButtonAccountMenu,
  ButtonLabelNew,
} from "src/components/dashboard/AccountMenu/ButtonAccountMenu";
import SoundButton from "src/components/dashboard/overview/SoundButton";
import { User } from "src/types/user";

export interface MenuData {
  title: string;
  icon: ReactNode;
  isNew?: boolean;
  externalLink?: string;
  href?: string;
  disabled?: boolean;
}

const accountMenus: Array<MenuData> = [
  {
    title: "Minha conta",
    icon: <MdManageAccounts size={24} color="#00B474" />,
    href: `/dashboard/profile`,
  },
  {
    title: "Histórico",
    icon: <MdWorkHistory size={24} color="#00B474" />,
    href: `/dashboard/profile/orders_center_trade`,
  },
  {
    title: "Depositar",
    icon: <MdOutlineWallet size={24} color="#00B474" />,
    href: `/dashboard/profile/deposit`,
  },
  {
    title: "Sacar",
    icon: <FaMoneyCheckDollar size={24} color="#00B474" />,
    href: `/dashboard/profile/to_withdraw`,
  },
  {
    title: "Trade rápido",
    icon: <SiCodemagic size={24} color="#00B474" />,
    isNew: true,
    href: "/exchange/trade/prediction",
    disabled: true,
  },
  {
    title: "Comprar cripto",
    icon: <RiCoinsFill size={24} color="#00B474" />,
    href: "/exchange",
    isNew: true,
    disabled: true,
  },
];

interface AccountMenuProps {
  user: User;
  onClickLogout: () => void;
}

const MenuContainer = ({ onClickLogout, user }: AccountMenuProps) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <MenuItem onClick={onClickLogout}>
        <Logout sx={{ color: "#ff5252", mr: 1 }} />
        Logout
      </MenuItem>
    );
  }

  return (
    <Stack direction="column" maxWidth={380} gap={2}>
      <Stack
        component="header"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mb={3.75}
        px={0.5}
      >
        <Typography fontSize={13} fontWeight={700} color="#EFEFEF">
          {user.name}
        </Typography>
        <CopyOnClick
          text={user.publicId}
          fontSize={11}
          sliceNumber={10}
          prevText="ID: "
        />
      </Stack>

      <Grid container spacing={1} columns={12}>
        {accountMenus.map((menu) => (
          <Grid size={6} key={menu.title}>
            <MenuItem
              sx={{
                flex: 1,
                width: "100%",
                height: "100%",
                display: "flex",
                padding: 0,

                "&:hover": {
                  backgroundColor: "transparent !important",
                },
              }}
            >
              <ButtonAccountMenu
                icon={menu.icon}
                text={menu.title}
                isNew={menu.isNew}
                href={menu.href}
                isExchange={menu.href?.includes("/exchange")}
                disabled={menu.disabled}
              />
            </MenuItem>
          </Grid>
        ))}
      </Grid>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={0.5}
        component={"a"}
        width={"100%"}
        sx={{
          position: "relative",
          background: "#00B474",
          "&:hover": {
            backgroundColor: "#00A268",
          },
          padding: "6px 16px",
          borderRadius: "8px",
          textDecoration: "none",
        }}
        href="/exchange/portfolio"
      >
        <ButtonLabelNew />
        <CgArrowsExchange size={24} />
        <Typography fontSize={12} fontWeight={700} color="#FBFFFF">
          Ebinex Exchange
        </Typography>
      </Stack>

      <Stack
        direction="row"
        py={2.5}
        justifyContent="space-between"
        borderTop="1px solid #15181A"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap={1.25}
        >
          <Button
            variant="text"
            onClick={() => navigate("/dashboard/profile/support")}
          >
            <BiSupport size={24} color="#01DB97" />
            <Typography fontSize={12} pl={1} fontWeight={500} color="#EFEFEF">
              Suporte
            </Typography>
          </Button>
          <SoundButton />
        </Stack>

        <MenuItem onClick={onClickLogout} sx={{ padding: 0 }}>
          <AiOutlineLogout size={20} color="#FF025C" />
        </MenuItem>
      </Stack>
    </Stack>
  );
};

export default MenuContainer;
