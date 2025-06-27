import { default as BitCoinUsdtImg } from "src/assets/images/icons/BTCUSDT.png";
import {
  default as PixIconDesktop,
  default as PixIconMobile,
} from "src/assets/images/icons/pix.png";
export interface MethodItem {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageMobileSrc?: string;
}

export const DEPOSIT_METHOD_BUTTON_LIST: MethodItem[] = [
  {
    id: "pix",
    title: "methods.pix.title",
    subtitle: "methods.pix.subtitle",
    imageSrc: PixIconDesktop,
    imageMobileSrc: PixIconMobile,
  },
  {
    id: "crypto",
    title: "methods.crypto.title",
    subtitle: "methods.crypto.subtitle",
    imageSrc: BitCoinUsdtImg,
  },
];
