import { Box, IconButton, Typography } from "@mui/material";
import { useContext } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import SettingsContext from "src/contexts/SettingsContext";

export default function SoundButton() {
  const { settings, saveSettings } = useContext(SettingsContext);

  const handleToggleSound = (e: any): void => {
    e.stopPropagation();
    saveSettings({
      ...settings,
      isSoundOn: !settings.isSoundOn,
    });
  };

  return (
    <Box sx={{ alignSelf: "center" }}>
      <IconButton
        sx={{
          padding: "6px 8px",
          borderRadius: "4px !important",
        }}
        onClick={(e) => handleToggleSound(e)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: "1rem",
          }}
        >
          {settings.isSoundOn ? (
            <HiSpeakerWave
              color="#1bba87"
              size={24}
              title="Turn off result sound"
            />
          ) : (
            <HiSpeakerXMark
              color="#475760"
              size={24}
              title="Turn on result sound"
            />
          )}
          <Typography fontSize="12px" fontWeight={500}>
            Som
          </Typography>
        </Box>
      </IconButton>
    </Box>
  );
}
