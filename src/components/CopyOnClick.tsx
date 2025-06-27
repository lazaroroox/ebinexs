import { Box, SxProps, Theme } from "@mui/material";
import { useState } from "react";
import { BsCopy } from "react-icons/bs";

const internalStyle: SxProps<Theme> = {
  cursor: "pointer",
  "& .copied, &:hover": {
    color: "#10f8a0",
  },
};

interface Props {
  text: string;
  sliceNumber?: number;
  fontSize?: number;
  prevText?: string;
  onlyText?: boolean;
  sx?: SxProps<Theme>; // ✅ nova prop
}

const CopyOnClick = ({
  text,
  sliceNumber,
  fontSize,
  prevText,
  onlyText,
  sx, // ✅ pegando a prop
}: Props) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = () => {
    if (text && navigator) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedLink("Copiado!");
          setTimeout(() => {
            setCopiedLink(null);
          }, 1500);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  return (
    <Box
      onClick={handleCopy}
      component="span"
      fontSize={fontSize}
      sx={{
        ...internalStyle,
        color: copiedLink ? "#10f8a0" : "#494f59",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        ...sx,
      }}
    >
      {!onlyText && (
        <>
          <BsCopy size={11} color="rgba(23, 224, 156, 1)" />
          {prevText && prevText}#
        </>
      )}
      {copiedLink || (sliceNumber ? text.slice(0, sliceNumber) : text)}
      {sliceNumber < text.length && (<>...</>)}
    </Box>
  );
};

export default CopyOnClick;
