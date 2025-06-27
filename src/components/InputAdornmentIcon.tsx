import {
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SVGProps, useState } from "react";
import { IconType } from "react-icons";

interface InputAdornmentIconProps extends SVGProps<SVGElement> {
  icon: IconType;
  position?: "start" | "end";
  onClick: () => void;
}

export function InputAdornmentIcon({
  onClick,
  icon,
  position = "start",
}: InputAdornmentIconProps) {
  const Icon = icon;
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    if (isPressed) {
      onClick();
      setIsPressed(false);
      setTimeout(() => setIsHovered(false), 200);
    }
  };

  const handleMouseEnter = () => {
    if (!isPressed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPressed) {
      setIsHovered(false);
    }
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    setIsHovered(true);
  };

  const handleMouseUp = () => {
    if (isPressed) {
      if (!isMobile) {
        onClick();
      }
      setIsPressed(false);
      setTimeout(() => setIsHovered(false), 200);
    }
  };

  const iconColor =
    (isMobile && isPressed) || (!isMobile && isHovered) ? "#01DB97" : "#FFF";

  return (
    <InputAdornment position={position}>
      <IconButton
        onClick={onClick}
        sx={{
          background: "#161D21",
          width: 24,
          height: 24,
          borderRadius: "50%",
          padding: 0.5,
        }}
      >
        <Icon size={24} style={{ color: iconColor }} />
      </IconButton>
    </InputAdornment>
  );
}
