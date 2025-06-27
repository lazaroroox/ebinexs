import { useLottie } from "lottie-react";
import pusingGreen from "../../../assets/lotties/pusing-green-dot-v1.json";
import pusingRed from "../../../assets/lotties/pusing-red-dot-v1.json";

type PusingDotProps = {
  isMarketOpen?: boolean;
};
function PusingDot({ isMarketOpen }: PusingDotProps) {
  const options = {
    animationData: isMarketOpen ? pusingGreen : pusingRed,
    loop: true,
    style: {
      width: 20,
      heigth: 20,
      maxHeight: 20,
    },
  };

  const { View } = useLottie(options);
  return <>{View}</>;
}

export default PusingDot;
