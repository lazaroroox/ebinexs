import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  listItens: Array<{
    label: ReactNode;
    onClick: () => void;
    isSelected: boolean;
  }>;
}

export function ToggleButtons({ listItens }: Props) {
  return (
    <ToggleButtonGroup sx={{ gap: 1.25 }}>
      {listItens.map(({ isSelected, label, onClick }, i) => (
        <ToggleButton
          key={i}
          sx={{
            borderRadius: "24px !important",
            border: isSelected ? 0 : "1px solid #15181A !important",
            background: isSelected ? "#00B474 !important" : "transparent",
            padding: "10px 20px",
            textTransform: "capitalize",
            gap: "0.25rem",

            "@media screen and (max-width: 600px)": {
              padding: "8px",
            },
          }}
          value=""
          onClick={onClick}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
