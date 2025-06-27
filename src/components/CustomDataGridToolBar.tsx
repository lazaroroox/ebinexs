import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const CustomDataGridToolBar = ({ customProp, ...props }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const style = {
    mt: isMobile ? 2 : 0,

    "& .MuiButtonBase-root": {
      backgroundColor: "#222",
      marginLeft: "2px",
    },
    "& .MuiDataGrid-toolbarContainer": {
      justifyContent: isMobile && "space-between",
      gap: isMobile ? "0rem" : "0.5rem",
      padding: 0,
      paddingTop: isMobile ? 0 : 2,
    },
    "& .MuiDataGrid-toolbarContainer button": {
      width: isMobile ? "47%" : "initial",
      fontSize: "0.875rem",
      background: "#0c151a",
      marginBottom: "1rem",
      padding: isMobile ? "1rem" : "0.5rem 1rem",
      "&:hover": {
        outline: "2px solid #0ab575",
      },
    },
  };

  return (
    <Box sx={style}>
      <GridToolbarContainer>
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{ utf8WithBom: true }}
        />
        <GridToolbarDensitySelector />
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    </Box>
  );
};

export default CustomDataGridToolBar;
