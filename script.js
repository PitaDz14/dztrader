// Binance WebSocket URL
const wsUrl = 'wss://stream.binance.com:9443/ws/neirousdt@kline_3m';
const socket = new WebSocket(wsUrl);

// Chart configuration
const chartProperties = {
    width: 1000,
    height: 500,
    layout: {
        background: { color: '#1a1f2e' },
        textColor: '#DDD'
    },
    grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' }
    },
    crosshair: {
        mode: 0
    },
    priceScale: {
        borderColor: '#485c7b'
    },
    timeScale: {
        borderColor: '#485c7b',
        timeVisible: true,
        secondsVisible: false
    }
};

// Initialize chart
const chart = LightweightCharts.createChart(
    document.getElementById('chart'),
    chartProperties
);

// Create candlestick series
const candleSeries = chart.addCandlestickSeries();

// Variables for technical analysis
let prices = [];
let volumes = [];
let rsiPeriod = 14;
let lastPrice = 0;

// Calculate RSI
function calculateRSI(prices, period = 14) {
    if (prices.length < period) return 0;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
        const difference = prices[i] - prices[i - 1];
        if (difference >= 0) {
            gains += difference;
        } else {
            losses -= difference;
        }
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

// Generate trading signal
function generateSignal(price, rsi, volume) {
    if (rsi > 70 && volume > volumes.reduce((a, b) => a + b, 0) / volumes.length) {
        return 'sell';
    } else if (rsi < 30 && volume > volumes.reduce((a, b) => a + b, 0) / volumes.length) {
        return 'buy';
    }
    return 'neutral';
}

// Update UI elements
function updateUI(price, signal) {
    document.getElementById('live-price').textContent = price.toFixed(8);
    document.getElementById('current-price').textContent = `السعر: ${price.toFixed(8)} USDT`;
    
    const priceChange = ((price - lastPrice) / lastPrice * 100);
    document.getElementById('price-change').textContent = `${priceChange.toFixed(2)}%`;
    document.getElementById('price-change').className = priceChange >= 0 ? 'positive' : 'negative';
    
    const signalStatus = document.querySelector('.signal-status');
    signalStatus.textContent = signal === 'buy' ? 'شراء' : signal === 'sell' ? 'بيع' : 'محايد';
    signalStatus.className = `signal-status ${signal}`;
    
    if (signal === 'buy') {
        document.getElementById('target-price').textContent = (price * 1.03).toFixed(8);
        document.getElementById('stop-loss').textContent = (price * 0.98).toFixed(8);
    } else if (signal === 'sell') {
        document.getElementById('target-price').textContent = (price * 0.97).toFixed(8);
        document.getElementById('stop-loss').textContent = (price * 1.02).toFixed(8);
    }
}

// WebSocket message handler
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const candle = data.k;
    
    const price = parseFloat(candle.c);
    const volume = parseFloat(candle.v);
    
    prices.push(price);
    volumes.push(volume);
    
    if (prices.length > 100) {
        prices.shift();
        volumes.shift();
    }
    
    const rsi = calculateRSI(prices);
    const signal = generateSignal(price, rsi, volume);
    
    document.getElementById('rsi-value').textContent = rsi.toFixed(2);
    document.getElementById('volume-value').textContent = volume.toFixed(2);
    
    candleSeries.update({
        time: candle.t / 1000,
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c)
    });
    
    updateUI(price, signal);
    lastPrice = price;
};

// Fetch historical data
async function fetchHistoricalData() {
    const response = await fetch('https://api.binance.com/api/v3/klines?symbol=NEIROUSDT&interval=3m&limit=1000');
    const data = await response.json();
    
    const historicalData = data.map(d => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4])
    }));
    
    candleSeries.setData(historicalData);
}

// Initialize historical data
fetchHistoricalData();