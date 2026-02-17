const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });

const port = Number(process.env.PORT || 8081);
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 60000);
const symbols = (process.env.SYMBOLS || 'NVDA,LSE:FUTR,LSE:MGNS,LSE:MKS')
  .split(',')
  .map((symbol) => symbol.trim())
  .filter(Boolean);

const wss = new WebSocketServer({ port });
let latestStatusMessage = null;
let lastSuccessfulPrices = null;
const quoteRequestHeaders = {
  'User-Agent': 'Mozilla/5.0',
  Accept: 'text/csv,text/plain,*/*',
};

function normaliseSymbol(symbol) {
  const lseMatch = symbol.match(/^LSE:(.+)$/i);

  if (lseMatch) {
    return `${lseMatch[1].toUpperCase()}.UK`;
  }

  if (symbol.includes('.')) {
    return symbol.trim().toUpperCase();
  }

  return `${symbol.trim().toUpperCase()}.US`;
}

function broadcast(payload) {
  const message = JSON.stringify(payload);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function setServerStatus(message) {
  if (latestStatusMessage === message) {
    return;
  }

  latestStatusMessage = message;

  if (message) {
    broadcast({
      type: 'status',
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  broadcast({
    type: 'status',
    level: 'info',
    message: 'Realtime feed active',
    timestamp: new Date().toISOString(),
  });
}

function parseNumericValue(value) {
  if (value === undefined || value === null || value === '' || value === 'N/D') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchStooqQuote(resolvedSymbol) {
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(resolvedSymbol.toLowerCase())}&i=d`;
  const response = await fetch(url, { headers: quoteRequestHeaders });

  if (!response.ok) {
    throw new Error(`Stooq HTTP error: ${response.status}`);
  }

  const body = (await response.text()).trim();
  const [symbol, date, time, open, high, low, close, volume] = body.split(',');

  if (!symbol) {
    return null;
  }

  return {
    symbol,
    date,
    time,
    open: parseNumericValue(open),
    high: parseNumericValue(high),
    low: parseNumericValue(low),
    close: parseNumericValue(close),
    volume: parseNumericValue(volume),
  };
}

async function fetchPrices() {
  if (!symbols.length) {
    const message = 'No symbols configured. Set SYMBOLS environment variable.';
    console.error(message);
    setServerStatus(message);
    return null;
  }

  try {
    const requestedToResolved = symbols.map((requestedSymbol) => ({
      requestedSymbol,
      resolvedSymbol: normaliseSymbol(requestedSymbol),
    }));

    const resolvedSymbols = [...new Set(requestedToResolved.map((item) => item.resolvedSymbol))];
    const quoteEntries = await Promise.all(
      resolvedSymbols.map(async (resolvedSymbol) => {
        const quote = await fetchStooqQuote(resolvedSymbol);
        return [resolvedSymbol.toUpperCase(), quote];
      }),
    );
    const quoteBySymbol = new Map(quoteEntries);

    const prices = requestedToResolved.reduce((accumulator, symbolPair) => {
      const raw = quoteBySymbol.get(symbolPair.resolvedSymbol.toUpperCase()) || null;
      const price = raw?.close ?? raw?.open ?? null;

      if (price !== null && price !== undefined) {
        accumulator[symbolPair.requestedSymbol] = {
          requestedSymbol: symbolPair.requestedSymbol,
          resolvedSymbol: symbolPair.resolvedSymbol,
          price,
        };
      } else {
        accumulator[symbolPair.requestedSymbol] = {
          requestedSymbol: symbolPair.requestedSymbol,
          resolvedSymbol: symbolPair.resolvedSymbol,
          error: `No price for ${symbolPair.resolvedSymbol}`,
        };
      }

      return accumulator;
    }, {});

    const allFailed = Object.values(prices).every(
      (result) => result.price === undefined || result.price === null,
    );

    if (allFailed) {
      setServerStatus('No valid prices returned for configured symbols.');
      return prices;
    }

    setServerStatus(null);
    lastSuccessfulPrices = prices;
    return prices;
  } catch (error) {
    console.error('API fetch error', error);
    setServerStatus(error?.message || 'Failed to fetch prices from Stooq.');
    return lastSuccessfulPrices;
  }
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.send(
    JSON.stringify({
      type: 'status',
      level: latestStatusMessage ? 'error' : 'info',
      message: latestStatusMessage || 'Connected to realtime server',
      timestamp: new Date().toISOString(),
    }),
  );

  fetchPrices().then((prices) => {
    if (!prices) {
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'prices', data: prices }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

wss.on('error', (error) => {
  console.error(`WebSocket server failed on port ${port}:`, error.message);
  process.exit(1);
});

setInterval(async () => {
  if (wss.clients.size === 0) {
    return;
  }

  const prices = await fetchPrices();

  if (!prices) {
    return;
  }

  broadcast({ type: 'prices', data: prices, timestamp: new Date().toISOString() });
}, pollIntervalMs);

console.log(`Realtime WebSocket server running on ws://localhost:${port}`);
