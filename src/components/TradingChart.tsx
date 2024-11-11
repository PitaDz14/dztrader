import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface TradingChartProps {
  pair: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ pair }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      chart.current = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#1a1a1a' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
      });

      const candlestickSeries = chart.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Fetch and update data for the selected pair
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${pair.replace('/', '')}&interval=3m&limit=1000`
          );
          const data = await response.json();
          
          const formattedData = data.map((d: any[]) => ({
            time: d[0] / 1000,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          }));
          
          candlestickSeries.setData(formattedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();

      return () => {
        chart.current.remove();
      };
    }
  }, [pair]);

  return <div ref={chartContainerRef} className="w-full h-[500px]" />;
};

export default TradingChart;