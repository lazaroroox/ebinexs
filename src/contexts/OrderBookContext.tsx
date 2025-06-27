import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";
import { OrderBookItem } from "../types/order";

interface State {
  bookRed: OrderBookItem[]; // Livros de ordens de venda (BEAR)
  bookGreen: OrderBookItem[]; // Livros de ordens de compra (BULL)
}

interface ApiProviderProps {
  children: ReactNode;
}

interface OrderBookContextValue extends State {
  handleCurrentBook: (data: any) => void;
  handleSingleBookEvent: (data: any) => void;
  clearBook: (data: any) => void;
  isLoading: boolean;
}

const OrderBookContext = createContext<OrderBookContextValue>({
  bookRed: [],
  bookGreen: [],
  handleCurrentBook: () => null,
  handleSingleBookEvent: () => null,
  clearBook: () => null,
  isLoading: false,
});

export const OrderBookProvider: FC<ApiProviderProps> = (props) => {
  const { children } = props;
  const [bookRed, setBookRed] = useState<OrderBookItem[]>([]);
  const [bookGreen, setBookGreen] = useState<OrderBookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedSymbol } = useContext(TradingViewContextV2);

  const handleCurrentBook = (data) => {
    if (data.event === "book") {
      const bull = data.payload?.bull || [];
      const bear = data.payload?.bear || [];
      setBookGreen(bull);
      setBookRed(bear);
      setIsLoading(false); // Dados carregados
    }
  };

  const handleSingleBookEvent = (data) => {
    if (data.event === "book_order") {
      const { direction, ...orderData } = data.payload;

      if (direction === "BULL") {
        setBookGreen((prev) => [...prev, orderData]);
      } else if (direction === "BEAR") {
        setBookRed((prev) => [...prev, orderData]);
      }
    }
  };

  const clearBook = () => {
    setBookGreen([]);
    setBookRed([]);
  };

  useEffect(() => {
    clearBook();
  }, [selectedSymbol]);

  return (
    <OrderBookContext.Provider
      value={{
        bookRed,
        bookGreen,
        handleCurrentBook,
        handleSingleBookEvent,
        clearBook,
        isLoading,
      }}
    >
      {children}
    </OrderBookContext.Provider>
  );
};

export default OrderBookContext;
