import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

interface ChartComponentProps {
  data?: {
    time: string;
    value: number;
  }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const ChartComponent: React.FC<ChartComponentProps> = (props) => {
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart: IChartApi = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current?.clientWidth,
      height: 250,
    });

    // create price lines
    const minPriceLine = {
      price: data![0].value, // Set the minimum price from the data
      color: "#3B82F6",

      axisLabelVisible: true,
      title: "Entry",
    };

    const avgPriceLine = {
      price: data!.reduce((sum, d) => sum + d.value, 0) / data!.length, // Calculate the average price
      color: "#3B82F6",

      axisLabelVisible: true,
      title: "Exit",
    };

    const maxPriceLine = {
      price: data![data!.length - 1].value, // Set the maximum price from the data
      color: "#3B82F6",

      axisLabelVisible: true,
      title: "Exit",
    };

    chart.timeScale().fitContent();

    const newSeries: ISeriesApi<"Area"> = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.setData(data!);

    // Add price lines to the chart
    newSeries.createPriceLine(minPriceLine);
    newSeries.createPriceLine(avgPriceLine);
    // newSeries.createPriceLine(maxPriceLine);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return <div ref={chartContainerRef} />;
};

export function Chart(props: ChartComponentProps) {
  return <ChartComponent {...props} />;
}
