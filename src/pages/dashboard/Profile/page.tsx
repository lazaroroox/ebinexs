import { Grid } from "@mui/material";
import ProfileImage from "src/components/dashboard/profile/ProfileImage";
import ProfileOptions from "src/components/dashboard/profile/ProfileOptions";
import { DepositPromotionBanner } from "src/layout/Banner";

export function ProfilePage() {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        mt: 1,
        justifyContent: "center",
      }}
    >
      <Grid size={{ xs: 12, md: 4 }}>
        <ProfileImage />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <ProfileOptions />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <DepositPromotionBanner />
      </Grid>
    </Grid>
  );
}
