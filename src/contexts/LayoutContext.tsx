import type { FC, ReactNode } from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type AccountValidationType = {
  started?: boolean;
  finish?: boolean;
  activeForm?: string;
};
interface Layout {
  activeDrawer: string;
  activeTab: string;
  modal2fa: boolean;
  modalSupport: boolean;
  modalDeleteAccount: boolean;
  modalBetaDepositInfoModal: boolean;
  modalHowToDepositPix: boolean;
  modalAlertAccountReal: boolean;
  modalAlertAccountDemo: boolean;
  modalAlertWellcomeModal: boolean;
  modalRequireDocumentValidate: boolean;
  modalOutsideMarket: boolean;
  outsideMarketText: string;
  enableEditAccount: boolean;
  accountValidation: AccountValidationType;
  orderHistoryTab: number;
  relaodPage: boolean;
  showSensiveInfo: boolean;
  loadingTradingview: boolean;
  chartButtonsDisabled: boolean;
  isPopUpOpen: boolean;
  chartRef: HTMLIFrameElement | null;
}

export interface LayoutContextValue {
  layout: Layout;
  setActiveTab: (name: string) => void;
  setActiveDrawer: (name: string, tab?: string) => void;
  setModalTwoStepVerificationModal: (bool: boolean) => void;
  setModalDeleteAccountModal: (bool: boolean) => void;
  setModalHowToDepositPix: (bool: boolean) => void;
  setModalSupport: (bool: boolean) => void;
  setModalBetaDepositInfo: (bool: boolean) => void;
  setModalAlertAccountReal: (bool: boolean) => void;
  setModalAlertAccountDemo: (bool: boolean) => void;
  setModalAlertWellcomeModal: (bool: boolean) => void;
  setOrderHistoryTab: (id: number) => void;
  setModalRequireDocumentValidate: (bool: boolean) => void;
  setModalOutsideMarket: (
    bool: boolean,
    text: string,
    reload?: boolean
  ) => void;
  setAccountValidate: (data: AccountValidationType) => void;
  setEnableEditAccount: (bool: boolean) => void;
  setShowSensiveInfo: () => void;
  setLoadingTradingview: (bool: boolean) => void;
  setChartButtonsDisabled: (bool: boolean) => void;
  handleChartLoadingState: (bool: boolean) => void;
  setIsPopUpOpen: (bool: boolean) => void;
  setChartRef: (iframe: HTMLIFrameElement) => void;
}

interface LayoutProviderProps {
  children?: ReactNode;
}

const initialLayout: Layout = {
  activeDrawer: "",
  activeTab: "login",
  modal2fa: false,
  modalSupport: false,
  modalDeleteAccount: false,
  modalBetaDepositInfoModal: false,
  modalHowToDepositPix: false,
  modalAlertAccountReal: false,
  modalAlertAccountDemo: false,
  modalAlertWellcomeModal: false,
  modalRequireDocumentValidate: false,
  modalOutsideMarket: false,
  outsideMarketText: "",
  enableEditAccount: false,
  accountValidation: {
    started: false,
    finish: false,
    activeForm: "documment",
  },
  orderHistoryTab: 0,
  relaodPage: false,
  showSensiveInfo:
    localStorage.getItem("showSensiveInfo") === "false" ? false : true,
  loadingTradingview: true,
  chartButtonsDisabled: true,
  isPopUpOpen: false,
  chartRef: null,
};

const LayoutContext = createContext<LayoutContextValue>({
  layout: initialLayout,
  setActiveTab: (name: string) => {},
  setActiveDrawer: (name: string, tab?: string) => {},
  setModalTwoStepVerificationModal: (bool: boolean) => {},
  setModalDeleteAccountModal: (bool: boolean) => {},
  setModalHowToDepositPix: (bool: boolean) => {},
  setModalSupport: (bool: boolean) => {},
  setModalBetaDepositInfo: (bool: boolean) => {},
  setModalAlertAccountReal: (bool: boolean) => {},
  setModalAlertWellcomeModal: (bool: boolean) => {},
  setModalAlertAccountDemo: (bool: boolean) => {},
  setOrderHistoryTab: (id: number) => {},
  setModalRequireDocumentValidate: (bool: boolean) => {},
  setModalOutsideMarket: (bool: boolean, text: string, reload?: boolean) => {},
  setAccountValidate: (data: AccountValidationType) => {},
  setEnableEditAccount: (bool: boolean) => {},
  setShowSensiveInfo: () => {},
  setLoadingTradingview: (bool: boolean) => {},
  setChartButtonsDisabled: (bool: boolean) => {},
  handleChartLoadingState: (bool: boolean) => {},
  setIsPopUpOpen: (bool: boolean) => {},
  setChartRef: (bool: HTMLIFrameElement) => {},
});

export const LayoutProvider: FC<LayoutProviderProps> = (props) => {
  const { children } = props;
  const [layout, setLayout] = useState<Layout>(initialLayout);
  const [accountValidationStorege, setAccountValidationStorege] =
    useLocalStorage<AccountValidationType>("accountValidationStorege", {
      started: false,
      finish: false,
      activeForm: "documment",
    });

  const setIsPopUpOpen = (bool: boolean) => {
    setLayout((prevLayout) => ({ ...prevLayout, isPopUpOpen: bool }));
  };

  const handleChartLoadingState = (bool: boolean) => {
    setLayout((prev) => ({
      ...prev,
      ...(prev.loadingTradingview !== bool && {
        loadingTradingview: bool,
      }),
      ...(prev.chartButtonsDisabled !== bool && {
        chartButtonsDisabled: bool,
      }),
    }));
  };

  const setChartButtonsDisabled = (bool: boolean) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      chartButtonsDisabled: bool,
    }));
  };

  const setActiveDrawer = (name: string, tab?: string) => {
    if (tab) {
      setLayout((prevLayout) => ({
        ...prevLayout,
        activeDrawer: name,
        activeTab: tab,
      }));
    } else {
      setLayout((prevLayout) => ({ ...prevLayout, activeDrawer: name }));
    }
  };

  const setShowSensiveInfo = () => {
    localStorage.setItem(
      "showSensiveInfo",
      (!layout.showSensiveInfo).toString()
    );

    setLayout((prevLayout) => ({
      ...prevLayout,
      showSensiveInfo: !prevLayout.showSensiveInfo,
    }));
  };

  const setActiveTab = (name: string) => {
    setLayout((prevLayout) => ({ ...prevLayout, activeTab: name }));
  };

  const setOrderHistoryTab = (id: number) => {
    setLayout((prevLayout) => ({ ...prevLayout, orderHistoryTab: id }));
  };

  const setModalTwoStepVerificationModal = (bool: boolean) => {
    setLayout((prevLayout) => ({ ...prevLayout, modal2fa: bool }));
  };

  const setModalDeleteAccountModal = (bool: boolean) => {
    setLayout((prevLayout) => ({ ...prevLayout, modalDeleteAccount: bool }));
  };

  const setModalHowToDepositPix = (bool: boolean) => {
    setLayout((prevLayout) => ({ ...prevLayout, modalHowToDepositPix: bool }));
  };

  const setModalSupport = (bool: boolean) => {
    setLayout((prevLayout) => ({ ...prevLayout, modalSupport: bool }));
  };

  const setModalBetaDepositInfo = (bool: boolean) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      modalBetaDepositInfoModal: bool,
    }));
  };

  const setModalAlertAccountReal = (bool: boolean) => {
    setLayout((prevLayout) => ({ ...prevLayout, modalAlertAccountReal: bool }));
  };

  const setModalAlertAccountDemo = (bool: boolean) => {
    setLayout((prevLayout) => ({ ...prevLayout, modalAlertAccountDemo: bool }));
  };

  const setModalAlertWellcomeModal = (bool: boolean) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      modalAlertWellcomeModal: bool,
    }));
  };

  const setModalRequireDocumentValidate = (bool: boolean) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      modalRequireDocumentValidate: bool,
    }));
  };

  const setModalOutsideMarket = useCallback(
    (bool: boolean, text: string, reload = true) => {
      setLayout((prevLayout) => {
        if (
          prevLayout.modalOutsideMarket === bool &&
          prevLayout.outsideMarketText === text &&
          prevLayout.relaodPage === reload
        ) {
          console.log("Estado já atualizado, ignorando");
          return prevLayout;
        }
        return {
          ...prevLayout,
          modalOutsideMarket: bool,
          outsideMarketText: text,
          relaodPage: reload,
        };
      });
    },
    []
  );

  const setEnableEditAccount = (bool: boolean) => {
    const a = { ...layout, enableEditAccount: bool };
    setLayout(a);
  };

  const setAccountValidate = (data: AccountValidationType) => {
    const accountValidation = {
      ...layout.accountValidation,
      ...data,
    };
    setAccountValidationStorege(accountValidation);

    setLayout((prevLayout) => ({
      ...prevLayout,
      accountValidation,
    }));
  };

  const setLoadingTradingview = (bool: boolean) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      loadingTradingview: bool,
    }));
  };

  useEffect(() => {
    let timerId;

    if (layout.loadingTradingview || layout.chartButtonsDisabled) {
      timerId = setTimeout(() => {
        handleChartLoadingState(false);
        console.log("Estado resetado para false após 5 segundos");
      }, 5000); // 5000 ms = 5 segundos
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [layout.loadingTradingview, layout.chartButtonsDisabled]);

  const setChartRef = (iframe: HTMLIFrameElement | null) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      chartRef: iframe,
    }));
  };

  return (
    <LayoutContext.Provider
      value={{
        layout,
        setActiveTab,
        setActiveDrawer,
        setModalTwoStepVerificationModal,
        setModalDeleteAccountModal,
        setModalHowToDepositPix,
        setModalSupport,
        setModalBetaDepositInfo,
        setModalAlertAccountReal,
        setModalAlertAccountDemo,
        setModalAlertWellcomeModal,
        setModalRequireDocumentValidate,
        setModalOutsideMarket,
        setEnableEditAccount,
        setAccountValidate,
        setOrderHistoryTab,
        setShowSensiveInfo,
        setLoadingTradingview,
        setChartButtonsDisabled,
        setIsPopUpOpen,
        handleChartLoadingState,
        setChartRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const LayoutConsumer = LayoutContext.Consumer;

export default LayoutContext;
