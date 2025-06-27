import { Stack, Typography } from "@mui/material";
import numeral from "numeral";
import React from "react";
import { useTranslation } from "react-i18next";
import InformationIcon from "./InformationIcon";
import SensitiveInfo from "./SensitiveInfo";

interface BarraProgressoDuplaProps {
  deposito: number;
  saque: number;
  limite: number;
}

const BarraProgressoDupla: React.FC<BarraProgressoDuplaProps> = ({
  deposito,
  saque,
  limite,
}) => {
  const { t } = useTranslation("barra_progresso_dupla");

  // Calcula a largura das barras em percentual
  const depositoPercent = (deposito / limite) * 100;
  const saquePercent = (saque / limite) * 100;

  return (
    <>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        spacing={1}
        pb={1}
      >
        <Typography variant="body1" color={"#AAA;"}>
          {t("monthly_movement")}
        </Typography>
        <InformationIcon text={t("monthly_movement_info")} />
      </Stack>
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          color: "white",
          fontFamily: "Arial, sans-serif",
          marginTop: 2,
        }}
      >
        {/* Barra de progresso */}
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "#1a2b35",
            borderRadius: "5px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Barra verde (depósito) */}
          <div
            style={{
              height: "100%",
              backgroundColor: "#00B474",
              width: `${depositoPercent}%`,
              position: "absolute",
              left: "0",
            }}
          ></div>
          {/* Barra laranja (saque) */}
          <div
            style={{
              height: "100%",
              backgroundColor: "#c61954",
              borderRadius: "0 8px 8px 0",
              width: `${saquePercent}%`,
              position: "absolute",
              left: `${depositoPercent}%`,
            }}
          ></div>
        </div>

        {/* Informações abaixo da barra */}
        <div
          style={{
            marginTop: "8px",
            fontSize: "14px",
            gap: "0.5rem",
          }}
        >
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            gap={0.5}
          >
            <Typography variant="body2" gap={0.5}>
              <span style={{ color: "#00B474", marginRight: 2 }}>●</span>
              {t("deposit")} <br />
              <SensitiveInfo
                text={`R$ ${numeral(deposito).format("0,0.00")}`}
              />
            </Typography>
            <Typography variant="body2" gap={0.5}>
              <span style={{ color: "#c61954", marginRight: 1 }}>●</span>
              {t("withdraw")} <br />
              <SensitiveInfo text={`R$ ${numeral(saque).format("0,0.00")}`} />
            </Typography>
            <Typography variant="body2">
              {t("limit")} <br />
              <SensitiveInfo text={`R$ ${numeral(limite).format("0,0.00")}`} />
            </Typography>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default BarraProgressoDupla;
