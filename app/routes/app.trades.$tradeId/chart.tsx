import axios from 'axios';
import { IChartApi, ISeriesApi, CrosshairMode, createChart, UTCTimestamp } from 'lightweight-charts';

export default function createStockChart(symbol: string, interval: string, container: HTMLElement): void {
  const chartProperties = {
    width: 600,
    height: 300,
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
  };

  const chart: IChartApi = createChart(container, chartProperties);
  const candleSeries: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries();

  let apiKey = "GCJ0CZ9USBAB4IY5";
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

  axios.get(url)
    .then(response => {
      const data = response.data;
      console.log("Data supposed to been seen")
      console.log("Data: ", data)


      if (data && data["Time Series (5min)"]) {
        console.log("Data supposed to been seen")

        const timeSeriesData = data["Time Series (5min)"];
        const chartData = Object.entries(timeSeriesData).map(([time, values]: any) => ({
            time: (new Date(time)).getTime() as UTCTimestamp,
            open: parseFloat(values["1. open"]),
          high: parseFloat(values["2. high"]),
          low: parseFloat(values["3. low"]),
          close: parseFloat(values["4. close"]),
        }));
        console.log("Data boi: ", chartData)
        console.log("Data supposed to been seen")
        candleSeries.setData(chartData);
        chart.timeScale().fitContent();
      } else {
        console.error('Invalid data format or missing time series data');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}