import {
    createContext,
    MouseEvent,
    ReactNode,
    useContext,
    useState,
} from "react";

interface SymbolMenuContextProps {
  anchorEl: null | HTMLElement;
  isOpen: boolean;
  handleOpen: (event: MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
}

const SymbolMenuContext = createContext<SymbolMenuContextProps | undefined>(
  undefined
);

export const SymbolMenuProvider = ({ children }: { children: ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <SymbolMenuContext.Provider
      value={{ anchorEl, isOpen, handleOpen, handleClose }}
    >
      {children}
    </SymbolMenuContext.Provider>
  );
};

export const useSymbolMenu = () => {
  const context = useContext(SymbolMenuContext);
  if (context === undefined) {
    throw new Error(
      "useSymbolMenu deve ser usado dentro de SymbolMenuProvider"
    );
  }
  return context;
};
