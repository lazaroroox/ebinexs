import { SxProps, Theme, styled } from "@mui/material/styles";
import type { FC } from "react";

interface LogoProps {
  sx?: SxProps<Theme>;
}

const LogoRoot = styled("img")({});

const Logo: FC<LogoProps> = (props) => (
  <LogoRoot
    src="https://ebinex-public.s3.sa-east-1.amazonaws.com/logo-ebinex.svg"
    width="100"
    height="25"
    alt="Ebinex logo"
    {...props}
  />
);

export default Logo;
