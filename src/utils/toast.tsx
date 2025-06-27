import { isMobile } from "react-device-detect";
import { cssTransition, toast, ToastPosition } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { Box, Stack } from "@mui/material";
import React from "react";
import { BsCheckAll } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import ToastPaper from "../components/custom/ToastPaper";

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
  appendPosition: false,
  collapse: true,
});

const getToastStyle = (position?: ToastPosition) => {
  const baseStyle = {
    fontSize: isMobile ? 10 : 12,
    height: isMobile ? 50 : null,
  };

  if (position === "top-center") {
    return {
      ...baseStyle,
      fontWeight: "bold",
      justifyContent: "center",
      display: "flex",
      top: 365,
      padding: 0,
    };
  }

  return baseStyle;
};

type NotifyOptions = {
  position?: ToastPosition;
  theme?: "light" | "dark" | "colored";
  time?: number;
  style?: { [key: string]: string };
  modal?: boolean;
  result?: any;
  value?: string;
};

const notify = (
  message: string,
  type: "success" | "error",
  options?: NotifyOptions,
  icon?: React.ReactNode
) => {
  if (options?.modal) {
    const defaultProgressStyle =
      type === "success"
        ? { backgroundColor: "#08C58A" }
        : { backgroundColor: "#FF025C" };

    const progressStyle = { ...defaultProgressStyle, ...options?.style };

    const toastOptions = {
      style: getToastStyle(options?.position),
      theme: options?.theme || "dark",
      closeButton: false,
      position: "top-center" as ToastPosition,
      progressStyle,
      hideProgressBar: true,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      autoClose: options?.time || 1500,
      draggable: false,
      transition: bounce,
      className: options?.modal ? "Toastify__toast--modal" : "", // Adicionar a classe para modais
    };

    const uniqueToastId = uuidv4(); // Gerar um ID único para cada toast
    return toast(
      <ToastPaper result={options?.result} value={options?.value} />,
      { ...toastOptions, toastId: uniqueToastId }
    );
  } else {
    const defaultStyle = {
      backgroundColor: "#030B10",
      color: "white",
      fontSize: 14,
      width: "100%",
      height: isMobile ? 50 : null,
      borderRadius: 9,
      border: "1px solid #15181A",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    };

    const progressStyle = {
      backgroundColor: type === "success" ? "#08C58A" : "#FF025C",
    };

    const toastOptions = {
      closeButton: true,
      style: defaultStyle,
      position: "bottom-left" as ToastPosition,
      progressStyle,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      rtl: false,
      autoClose: options?.time || 1500,
    };

    if (type === "success") {
      toast.success(message, {
        ...toastOptions,
        icon: ({ theme, type }) => (
          <Stack
            position="relative"
            alignItems="center"
            justifyContent="center"
            borderRadius={2}
            bgcolor="rgba(0, 180, 116, 0.1)"
            padding={0.75}
            width={40}
            height={40}
            overflow="hidden"
          >
            <Box
              sx={{
                position: "absolute",
                bottom: -5,
                width: 14,
                height: 14,
                filter: "blur(7.5px)",
                background: "#01DB97",
              }}
            />
            {icon ? icon : <BsCheckAll size={26} color="#00B474" />}
          </Stack>
        ),
      });
    } else {
      toast.error(message, {
        ...toastOptions,
        icon: ({ theme, type }) => (
          <Stack
            position="relative"
            alignItems="center"
            justifyContent="center"
            borderRadius={2}
            bgcolor="rgba(191, 2, 69, 0.1)"
            padding={0.75}
            width={40}
            height={40}
            overflow="hidden"
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: 14,
                height: 14,
                filter: "blur(16.32000160217285px)",
                background: "#FF025C",
              }}
            />
            {icon ? icon : <VscError size={23} color="#FF025C" />}
          </Stack>
        ),
      });
    }
  }
};

export const notifySuccess = (
  message: string,
  options?: NotifyOptions,
  icon?: React.ReactNode
) => {
  notify(message, "success", options, icon);
};

export const notifyError = (
  message: string,
  options?: NotifyOptions,
  icon?: React.ReactNode
) => {
  notify(message, "error", options, icon);
};
