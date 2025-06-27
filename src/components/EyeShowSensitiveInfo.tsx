import { useContext } from "react";
import LayoutContext from "src/contexts/LayoutContext";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { MdRemoveRedEye } from "react-icons/md";

const EyeShowSensitiveInfo = ({
  size,
  color,
}: {
  size: number;
  color?: string;
}) => {
  const { layout, setShowSensiveInfo } = useContext(LayoutContext);

  return (
    <span style={{ cursor: "pointer" }}>
      {layout.showSensiveInfo ? (
        <HiOutlineEyeOff
          className="eyeIcon"
          size={size}
          onClick={setShowSensiveInfo}
          color={color}
        />
      ) : (
        <MdRemoveRedEye
          className="eyeIcon"
          size={size}
          onClick={setShowSensiveInfo}
          color={color}
        />
      )}
    </span>
  );
};

export default EyeShowSensitiveInfo;
