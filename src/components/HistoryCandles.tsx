import { Box } from "@mui/material";
import { ColorType, createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { apiGet } from "src/services/apiService";

const HistoryCandles = ({ order }) => {
  const chartContainerRef = useRef(null);
  const [candlesComposition, setCandlesComposition] = useState([]);

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    const fetchCandlesData = async () => {
      try {
        const data = await apiGet(
          `/orders/${order.id}/candlesComposition?beforeCandlesCount=20&afterCandlesCount=20`
        );
        setCandlesComposition(data);
      } catch (error) {
        console.error("Error fetching candles data:", error);
      }
    };

    fetchCandlesData();
  }, [order.id]);

  useEffect(() => {
    if (!chartContainerRef.current || candlesComposition.length === 0) {
      return;
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chartOptions: any = {
      layout: {
        textColor: "black",
        background: {
          type: ColorType.VerticalGradient,
          topColor: "#00060A",
          bottomColor: "#000305",
        },
      },
      width: chartContainerRef.current.clientWidth,
    
      grid: {
        vertLines: {
          color: "#ffffff05",
          style: 0,
        },
        horzLines: {
          color: "#ffffff05",
          style: 0,
        },
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const formattedData = candlesComposition.map((item) => ({
      open: item.candle.o,
      high: item.candle.h,
      low: item.candle.l,
      close: item.candle.c,
      time: item.candle.t,
    }));

    candlestickSeries.setData(formattedData);
    chart.timeScale().setVisibleLogicalRange({ from: 0, to: 40 });

    console.log("order ->", order);
    const markers: any = [
      {
        time: new Date(order.candleStartTime).getTime(),
        position: "aboveBar",
        color: "red",
        shape: "arrowDown",
      },
    ];
    candlestickSeries.setMarkers(markers);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };

    return () => {
      chart.remove();
    };
  }, [candlesComposition]);

  return (
    <Box sx={{ mt: 2, height: "calc(100% - 56px)" }}>
      <div ref={chartContainerRef} style={{ height: "100%" }} />
    </Box>
  );
};

export default HistoryCandles;
