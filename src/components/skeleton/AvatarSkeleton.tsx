import { Skeleton } from "@mui/material";

export default function AvatarSkeleton({
  height,
  width,
}: {
  height?: number;
  width?: number;
}) {
  return (
    <Skeleton variant="circular" height={height || 40} width={width || 40} />
  );
}
