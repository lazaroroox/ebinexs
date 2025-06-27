import { Box, Button, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BsFire } from "react-icons/bs";
import { useNavigate } from "react-router";

interface ButtonAccountMenuProps {
  text: string;
  href: string;
  icon: ReactNode;
  isNew?: boolean;
  isExchange?: boolean;
  disabled?: boolean;
}

export function ButtonAccountMenu({
  text,
  href,
  icon,
  isNew = false,
  isExchange = false,
  disabled = false,
}: ButtonAccountMenuProps) {
  const navigate = useNavigate();
  function redirectPage() {
    if (href) {
      return navigate(href);
    }
  }

  if (isExchange) {
    if (disabled) {
      return null;
    }
    return (
      <Stack
        component={"a"}
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        gap={1}
        sx={{
          position: "relative",
          background: disabled ? "#1c1c1c" : "#111619", // Cor diferente quando desativado
          padding: "0.75rem 0.5rem",
          borderRadius: "0.5rem",
          flex: 1,
          height: 65,
          textDecoration: "none",
          pointerEvents: disabled ? "none" : "auto", // Desativa cliques quando desativado
          opacity: disabled ? 0.5 : 1, // Reduz opacidade quando desativado

          "&:hover": {
            background: disabled ? "#1c1c1c" : "#161D21", // Sem hover quando desativado
          },
        }}
        href={disabled ? undefined : href} // Remove o link se desativado
      >
        {isNew && <ButtonLabelNew />}
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            background: "rgba(214, 214, 214, 0.05)",
            borderRadius: "50%",
            padding: "0.5rem",
            width: "46px",
            height: "46px",
          }}
        >
          {icon}
        </Stack>

        <Typography
          color="#EFEFEF"
          fontSize={12}
          fontWeight={500}
          whiteSpace="wrap"
          textAlign="left"
        >
          {text}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      component={Button}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      gap={1}
      sx={{
        position: "relative",
        background: disabled ? "#1c1c1c" : "#111619",
        padding: "0.75rem 0.5rem",
        borderRadius: "0.5rem",
        flex: 1,
        height: 65,
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.5 : 1,

        "&:hover": {
          background: disabled ? "#1c1c1c" : "#161D21",
        },
      }}
      href={isExchange ? "/exchange" : undefined}
      onClick={disabled ? undefined : redirectPage}
      disabled={disabled}
    >
      {isNew && <ButtonLabelNew />}
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "rgba(214, 214, 214, 0.05)",
          borderRadius: "50%",
          padding: "0.5rem",
          width: "46px",
          height: "46px",
        }}
      >
        {icon}
      </Stack>

      <Typography
        color="#EFEFEF"
        fontSize={12}
        fontWeight={500}
        whiteSpace="wrap"
        textAlign="left"
      >
        {text}
      </Typography>
    </Stack>
  );
}

interface ButtonLabelNewProps {
  showBottom?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ButtonLabelNew({
  size = "md",
  showBottom = false,
}: ButtonLabelNewProps) {
  const { t } = useTranslation("dashboard");
  return (
    <Box
      sx={{
        position: "absolute",
        ...(showBottom
          ? {
              bottom: 0,
            }
          : {
              top: 0,
            }),

        right: 0,
      }}
    >
      <Box
        sx={{
          background: "#FF025C",

          ...(size === "sm" && {
            padding: "0.125rem 0.25rem",
          }),

          ...(size === "md" && {
            padding: "0.25rem 0.5rem",
          }),
          borderRadius: "0.25rem",
        }}
      >
        <Typography color="#FBFFFF" fontSize={10} fontWeight={600}>
          {t("new")}
        </Typography>
      </Box>

      <Box
        position="absolute"
        top={0}
        right={0}
        sx={{
          transform: "translate(50%, -50%)",
          zIndex: 2,
          background: "#030B10",
          borderRadius: "50%",
          width: 14,
          height: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BsFire size={10} color="#FB1455" />
      </Box>
    </Box>
  );
}
