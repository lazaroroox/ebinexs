import { useContext } from "react";
import LayoutContext from "src/contexts/LayoutContext";

const SensitiveInfo = ({ text }: { text: any }): any => {
  const { layout } = useContext(LayoutContext);

  return layout.showSensiveInfo ? text : "**********";
};

export default SensitiveInfo;
