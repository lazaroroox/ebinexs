import { CircularProgress, IconButton } from "@mui/material";
import Refresh from "src/icons/Refresh";

interface IProps {
  loading: boolean;
  fetchFunction: () => void;
}

const ReloadIconButton = ({ loading, fetchFunction }: IProps) => {
  return loading ? (
    <CircularProgress size={25} sx={{ mt: 0.5, mr: 1 }} />
  ) : (
    <IconButton
      aria-label="refresh"
      onClick={() => fetchFunction()}
      sx={{
        background: "#070f14",
        width: "50px",
        height: "50px",
        "&:hover": {
          background: "#0a1014",
          outline: "2px solid #0ab575",
        },
      }}
    >
      <Refresh />
    </IconButton>
  );
};

export default ReloadIconButton;
