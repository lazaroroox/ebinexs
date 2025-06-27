import { BiCheck } from "react-icons/bi";
import TitleWithCircleIcon from "./TitleWithCircleIcon";
import { CgClose } from "react-icons/cg";

export const Check2FAandKYCToChangeColor = ({
  label,
  isUsingWhat,
}: {
  isUsingWhat: boolean;
  label: string;
}) =>
  isUsingWhat ? (
    <TitleWithCircleIcon label={label} icon={<BiCheck size={18} />} />
  ) : (
    <TitleWithCircleIcon
      label={label}
      icon={<CgClose size={14} />}
      bgColor=" #400016"
      color="#ff005c"
    />
  );
