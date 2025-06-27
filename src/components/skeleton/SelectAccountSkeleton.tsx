import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Skeleton, Stack } from "@mui/material";
import Button from "@mui/material/Button";

export default function SelectAccountSkeleton() {
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#3a3a3a4d" }}
      disabled={false}
      endIcon={<KeyboardArrowDownIcon />}
    >
      <Stack direction={"column"} justifyContent="center" alignItems={"start"}>
        <Skeleton height={12} width={90} />
        <Skeleton height={18} width={90} />
      </Stack>
    </Button>
  );
}
