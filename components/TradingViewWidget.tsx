
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol, interval }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Limpa qualquer conteúdo residual
    const currentContainer = container.current;
    currentContainer.innerHTML = '';
    
    const intervalMap: Record<string, string> = {
      '1s': '1',
      '15m': '15',
      '1h': '60',
      '4h': '240',
      '1d': 'D',
      '1w': 'W'
    };

    const widgetId = `tv-widget-${symbol}-${interval}`;
    const script = document.createElement("script");
    script.id = widgetId;
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
    
    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) currentContainer.innerHTML = '';
    };
  }, [symbol, interval]);

  return (
    <div className="tradingview-widget-container h-full w-full bg-[#0b0e11]" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
};

export default TradingViewWidget;
