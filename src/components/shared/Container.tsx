import { FC, PropsWithChildren } from "react";
import { Box, SxProps } from "@mui/material";
import { Theme } from "@emotion/react";

interface ContainerProps {
  sx?: SxProps<Theme>;
}

const Container: FC<PropsWithChildren<ContainerProps>> = (props) => {
  const { sx, children } = props;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1440,
        marginX: "auto",
        paddingX: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Container;
