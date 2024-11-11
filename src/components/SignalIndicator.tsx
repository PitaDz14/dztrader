import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface SignalIndicatorProps {
  signal: 'buy' | 'sell' | 'neutral';
  price: number;
  target: number;
  stopLoss: number;
  tradeType: 'LONG' | 'SHORT';
}

const SignalIndicator: React.FC<SignalIndicatorProps> = ({
  signal,
  price,
  target,
  stopLoss,
  tradeType,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-200">Trading Signal</h3>
        {signal === 'buy' && (
          <TrendingUp className="w-8 h-8 text-green-500" />
        )}
        {signal === 'sell' && (
          <TrendingDown className="w-8 h-8 text-red-500" />
        )}
        {signal === 'neutral' && (
          <AlertCircle className="w-8 h-8 text-yellow-500" />
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Current Price</span>
          <span className="text-gray-200 font-semibold">${price.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Target Price</span>
          <span className={`font-semibold ${tradeType === 'LONG' ? 'text-green-400' : 'text-red-400'}`}>
            ${target.toFixed(4)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Stop Loss</span>
          <span className={`font-semibold ${tradeType === 'LONG' ? 'text-red-400' : 'text-green-400'}`}>
            ${stopLoss.toFixed(4)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className={`text-center font-bold text-lg
          ${tradeType === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>
          {tradeType} {signal.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default SignalIndicator;