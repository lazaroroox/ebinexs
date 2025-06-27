import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { VscCopy } from "react-icons/vsc";

type TextObject = {
  id: string;
  value: string;
};

type TextCopyProps = string | TextObject;

interface TextCopyComponentProps {
  text: TextCopyProps;
}

const TextCopy: React.FC<TextCopyComponentProps> = ({ text }) => {
  const { t } = useTranslation("dashboard");

  const [copied, setCopied] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const value = typeof text === "string" ? text : text.value;
  const id = typeof text === "object" ? text.id : undefined;

  if (!value) return <span>N/A</span>;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(id || value);

    setTimeout(() => {
      if (isMounted.current) {
        setCopied(null);
      }
    }, 2000);
  };

  const divStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "0.25rem",
    "& .link-cell": {
      cursor: "pointer",
      padding: "0.75rem 0",
      transition: "transform 0.4s",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      "&.copied": {
        color: "#0ab575",
      },
      "&:hover": {
        color: "#0ab575",
        transform: "translateY(-4px)",
      },
    },
  };

  return (
    <Box sx={divStyle} title={value}>
      <Box
        flex={1}
        className={copied === (id || value) ? "copied link-cell" : "link-cell"}
        onClick={handleCopy}
      >
        {copied === (id || value) ? `${t("copied")}!` : value}
      </Box>

      <VscCopy size={16} onClick={handleCopy} />
    </Box>
  );
};

export default TextCopy;
