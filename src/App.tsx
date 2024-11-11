import React, { useState, useEffect } from 'react';
import { Wallet, Clock, TrendingUp } from 'lucide-react';
import TradingChart from './components/TradingChart';
import SignalIndicator from './components/SignalIndicator';
import CurrencySelector from './components/CurrencySelector';

function App() {
  const [currentPrice, setCurrentPrice] = useState(0.85);
  const [signal, setSignal] = useState<'buy' | 'sell' | 'neutral'>('neutral');
  const [selectedPair, setSelectedPair] = useState('NEIRO/USDT');
  const [tradeType, setTradeType] = useState<'LONG' | 'SHORT'>('LONG');

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase().replace('/', '')}@kline_3m`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.k.c);
      setCurrentPrice(price);
      
      // Determine trade type based on price movement
      if (price > currentPrice) {
        setTradeType('LONG');
      } else if (price < currentPrice) {
        setTradeType('SHORT');
      }
    };

    return () => ws.close();
  }, [selectedPair]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Crypto Analysis</h1>
            </div>
            <CurrencySelector
              selectedPair={selectedPair}
              onSelect={setSelectedPair}
            />
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">3H Timeframe</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Spot Trading</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <TradingChart pair={selectedPair} />
            </div>
          </div>
          
          <div className="space-y-6">
            <SignalIndicator
              signal={signal}
              price={currentPrice}
              target={currentPrice * (tradeType === 'LONG' ? 1.05 : 0.95)}
              stopLoss={currentPrice * (tradeType === 'LONG' ? 0.98 : 1.02)}
              tradeType={tradeType}
            />
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Key Indicators</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">RSI (14)</span>
                    <span className={tradeType === 'LONG' ? 'text-green-400' : 'text-red-400'}>58.24</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`${tradeType === 'LONG' ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} style={{ width: '58%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">MACD</span>
                    <span className={tradeType === 'LONG' ? 'text-green-400' : 'text-red-400'}>
                      {tradeType === 'LONG' ? 'Bullish' : 'Bearish'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`${tradeType === 'LONG' ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-blue-400">Above Average</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Trading Rules</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Maximum position duration: 3 hours</li>
                <li>• Recommended stop-loss: 2%</li>
                <li>• Take profit targets: 3-5%</li>
                <li>• Only enter when all indicators align</li>
                <li>• Monitor volume for confirmation</li>
                <li className="text-yellow-400 font-semibold">
                  • Current Strategy: {tradeType}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;