import { useState } from "react";
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride";
import { CustomTooltip } from "./CustomTooltip";

interface TourProps {
  onFinish: () => void;
}

export const Tour = ({ onFinish }: TourProps) => {
  const [steps] = useState<Step[]>([
    {
      target: ".my-account-section",
      title: "MINHA CONTA",
      content:
        "Aqui você encontra opções de saque, depósito, segurança e outras informações da sua conta Ebinex.",
      placement: "right-start",
      disableBeacon: true,
    },
    {
      target: ".account-selection-section",
      title: "ALTERAR TIPO DE CONTA",
      content:
        "Clique aqui para alternar entre a conta de treino e a conta real.",
      placement: "right-start",
    },
    {
      target: ".symbol-section",
      title: "TROCA DE ATIVOS",
      content:
        "Clique aqui para alternar entre os ativos disponíveis na plataforma",
      placement: "right-start",
    },
    {
      target: ".tradingview-section",
      title: "FERRAMENTAS GRÁFICAS",
      content:
        "Você pode alterar o tipo de gráfico, aplicar indicadores e outras ferramentas de análise gráfica..",
      placement: "center",
    },
    {
      target: ".ordens-section",
      title: "MENU DE ORDENS",
      content:
        "Nessa seção você pode definir o timeframe, valor e iniciar uma operação de compra ou venda de um ativo.",
      placement: "left",
    },
    {
      target: ".order-book-section",
      title: "OPERAÇÕES",
      content:
        "Veja as operações em andamento, o livro de ordens e o seu histórico resumido.",
      placement: "left",
    },
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    console.log("data", data);
    const { status, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (action === "close") {
      onFinish();
    }

    if (finishedStatuses.includes(status)) {
      console.log("Tour finished");
      onFinish();
    }
  };

  console.log("steps", steps);

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={true}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
      tooltipComponent={CustomTooltip}
    />
  );
};
