import React from 'react';

interface CurrencySelectorProps {
  selectedPair: string;
  onSelect: (pair: string) => void;
}

const TRADING_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'NOT/USDT', 'NEIRO/USDT', 'APE/USDT',
  'TURBO/USDT', 'ATM/USDT', 'DOT/USDT', 'SYS/USDT', '1MBABYDOGE/USDT',
  'GALA/USDT', 'SOL/USDT', 'TRX/USDT', 'BAL/USDT', 'ALPACA/USDT',
  'ALPHA/USDT', 'WLD/USDT', 'BNT/USDT', 'ZK/USDT', 'DEXE/USDT',
  'HMSTR/USDT', 'DOGE/USDT', 'DOGS/USDT', 'SUI/USDT', 'ATOM/USDT',
  'AVA/USDT', 'AXS/USDT', 'AVAX/USDT', 'BAKE/USDT', 'HOT/USDT',
  'KAVA/USDT', 'MASK/USDT', 'SHIB/USDT', 'STORJ/USDT', 'SUSHI/USDT',
  'UNI/USDT', 'XRP/USDT', 'BNB/USDT', 'PEOPLE/USDT', 'ASTR/USDT',
  'APT/USDT', 'PEPE/USDT', 'AST/USDT', 'ARK/USDT', 'MEME/USDT'
];

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ selectedPair, onSelect }) => {
  return (
    <div className="relative">
      <select
        value={selectedPair}
        onChange={(e) => onSelect(e.target.value)}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {TRADING_PAIRS.map((pair) => (
          <option key={pair} value={pair}>
            {pair}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default CurrencySelector;