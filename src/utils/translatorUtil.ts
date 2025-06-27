// temporary translation method
const translate = (text: string): string => {
  switch (text) {
    case "OPEN": {
      return "open";
    }
    case "PENDING": {
      return "pending";
    }
    case "WIN": {
      return "win";
    }
    case "LOSE": {
      return "lose";
    }
    case "REFUNDED": {
      return "refunded";
    }
    case "CONFIRMED": {
      return "confirmed";
    }
    case "IN_PROCESS": {
      return "in_process";
    }
    case "COMPLETE": {
      return "complete";
    }
    case "CANCELED": {
      return "canceled";
    }
    case "BULL": {
      return "bull";
    }
    case "BEAR": {
      return "bear";
    }
    default: {
      return text;
    }
  }
};

export default translate;
