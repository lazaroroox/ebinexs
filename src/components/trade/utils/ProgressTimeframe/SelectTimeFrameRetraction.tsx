import { Button, Skeleton, Stack } from "@mui/material";
import { CgTimelapse } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";

interface SelectTimeFrameRetractionProps {
  timeOrderRetraction: string;
  isShowInput: boolean;
  handleChangeShowInput: () => void;
}

export function SelectTimeFrameRetraction({
  handleChangeShowInput,
  isShowInput,
  timeOrderRetraction,
}: SelectTimeFrameRetractionProps) {
  return (
    <Stack direction="row" alignItems="center" gap={0.25}>
      <CgTimelapse size={20} color="#00B474" />
      {!timeOrderRetraction ? (
        <Skeleton variant="text" width={60} height={16} />
      ) : (
        <Stack
          component={Button}
          onClick={handleChangeShowInput}
          direction="row"
          alignItems="center"
          gap={1}
          fontWeight={700}
          fontSize={14}
        >
          {timeOrderRetraction}
          <IoIosArrowDown
            style={{
              rotate: `${isShowInput ? 180 : 0}deg`,
              transition: "rotate 0.3s ease",
            }}
            size={12}
            color="#FFFFFF"
          />
        </Stack>
      )}
    </Stack>
  );
}
