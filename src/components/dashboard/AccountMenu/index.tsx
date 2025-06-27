import { Avatar, Box, IconButton, Menu } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ButtonLabelNew } from "src/components/dashboard/AccountMenu/ButtonAccountMenu";
import MenuContainer from "src/components/dashboard/AccountMenu/MenuContainer";
import useAuth from "src/hooks/useAuth";
import useUser from "src/swr/use-user";

export default function AccountMenu() {
  // const { locale } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
        className="my-account-section"
      >
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              // transition: "all 0.2s ease-in-out",
            }}
            alt="User Avatar"
            src={user?.avatar}
          />
          <ButtonLabelNew showBottom size="sm" />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          "& .MuiMenu-paper": {
            background: "#030B10 !important",
          },

          "& .MuiList-root": {
            background: "#030B10",
          },
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              padding: "32px 32px 0",

              color: "#fff",
              width: 380,
              border: "1px solid #15181A",
              borderRadius: "12px",

              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                background: "#030B10",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuContainer user={user} onClickLogout={handleLogout} />
      </Menu>
    </>
  );
}
