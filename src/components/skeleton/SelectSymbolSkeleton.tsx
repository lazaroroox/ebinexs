import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Skeleton, Stack } from "@mui/material";
import Button from "@mui/material/Button";

export default function SelectSymbolSkeleton() {
  return (
    <>
      <Button
        variant="contained"
        style={{ position: "relative", backgroundColor: "#3a3a3a4d" }}
        disabled={true}
        endIcon={<KeyboardArrowDownIcon />}
        className="symbol-section"
      >
        <Stack
          direction={"column"}
          justifyContent="center"
          alignItems={"start"}
        >
          <Skeleton height={20} width={90} />
        </Stack>
      </Button>
    </>
  );
}
