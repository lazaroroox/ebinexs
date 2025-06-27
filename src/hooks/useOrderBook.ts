import { useContext } from "react";
import OrderBookContext from "src/contexts/OrderBookContext";

const useOrderBook = () => useContext(OrderBookContext);

export default useOrderBook;
