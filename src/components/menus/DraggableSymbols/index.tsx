import { move } from "@dnd-kit/helpers";
import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/react";
import { useContext } from "react";
import { ButtonSymbol } from "src/components/menus/DraggableSymbols/ButtonSymbol";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";

export function DraggableSymbols({
  activeSymbol,
  selectedSymbols,
  handleSwitchSymbol,
  handleCloseSymbolTab,
  handleCloseDropdown,
  handleClickOpenList,
  isOpenTvToolbar,
}) {
  const { headerMenuSymbols, updateHeaderMenuSymbols } =
    useContext(TradingViewContextV2);
  function handleDragEnd(event) {
    const newOrderedSymbols = move(selectedSymbols, event);
    localStorage.setItem(
      "selectedMenuSymbols",
      JSON.stringify(newOrderedSymbols)
    );

    if (
      !newOrderedSymbols.every(
        (symbol, index) => symbol === headerMenuSymbols[index]
      )
    ) {
      updateHeaderMenuSymbols(newOrderedSymbols);
    }
  }

  return (
    <DragDropProvider
      sensors={[PointerSensor, KeyboardSensor]}
      onBeforeDragStart={(e) => console.log("Before drag start", e)}
      onDragEnd={handleDragEnd}
    >
      {selectedSymbols.map((item, index) => {
        return (
          <ButtonSymbol
            id={item}
            index={index}
            key={item}
            amountSelectedSymbols={selectedSymbols.length}
            activeSymbol={activeSymbol}
            canvasWidth={isOpenTvToolbar ? 52 : 5}
            handleClickOpenList={handleClickOpenList}
            handleSwitchSymbol={handleSwitchSymbol}
            handleCloseSymbolTab={handleCloseSymbolTab}
            {...(selectedSymbols.length === 1 && {
              className: "symbol-section",
            })}
          />
        );
      })}
    </DragDropProvider>
  );
}
