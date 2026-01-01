
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol, interval }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = ''; // Limpa o container antes de renderizar
      
      // Mapeamento de intervalos do app para o TradingView
      const intervalMap: Record<string, string> = {
        '1s': '1',
        '15m': '15',
        '1h': '60',
        '4h': '240',
        '1d': 'D',
        '1w': 'W'
      };

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": `BINANCE:${symbol}USDT`,
        "interval": intervalMap[interval] || "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "br",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com",
        "backgroundColor": "rgba(11, 14, 17, 1)",
        "gridColor": "rgba(30, 35, 41, 1)",
        "hide_side_toolbar": false,
      });
      container.current.appendChild(script);
    }
  }, [symbol, interval]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
};

export default TradingViewWidget;
