const path = require('path');
const { WebSocketServer, WebSocket: WsWebSocket } = require('ws');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });

const port = Number(process.env.PORT || 8081);
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 60000);
const symbols = (
  process.env.SYMBOLS ||
  'XLON:GAW,XLON:YU.,XLON:FORT,XLON:GRI,XLON:THRL,XLON:IPX,XLON:TW.,XLON:FOUR,XLON:RWS,XNYS:NVO,XNYS:EVTL,XLON:EMG,XLON:CAML,XLON:SQZ,XLON:COST,XNAS:RYAAY,XLON:KLR,XLON:MONY,XWBO:OMV,XLON:JET2,XLON:FUTR,XLON:MGNS,XLON:MKS,XLON:EVR,XLON:AIE,XLON:BRLA,XLON:BIOG,XLON:IBT,XLON:FSG,XLON:PCGH,XLON:GCL,XLON:0LY1,XLON:JEGI,XLON:CGEO,XLON:JGGI,XLON:PCT,XLON:SPOL,XLON:NAVF,XLON:JEDT,XLON:IAD,XLON:IKOR,XLON:FCSS,XLON:HFEL,XLON:BRSC,XLON:JUSC,XLON:GSCT,XLON:TRIG,XLON:ROBG,XLON:SSIT,XETR:PCFP,XETR:PCFH,XLON:BRFI'
)
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
const fetchTimeoutMs = Number(process.env.FETCH_TIMEOUT_MS || 10000);
const fetchRetries = Number(process.env.FETCH_RETRIES || 2);
const retryDelayMs = Number(process.env.FETCH_RETRY_DELAY_MS || 500);
const symbolFetchConcurrency = Number(process.env.SYMBOL_FETCH_CONCURRENCY || 6);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchTextWithRetry(url, contextLabel) {
  let lastError = null;

  for (let attempt = 0; attempt <= fetchRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);

    try {
      const response = await fetch(url, {
        headers: quoteRequestHeaders,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`${contextLabel} HTTP error: ${response.status}`);
      }

      return (await response.text()).trim();
    } catch (error) {
      lastError = error;

      if (attempt < fetchRetries) {
        await delay(retryDelayMs * (attempt + 1));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error(`${contextLabel} fetch failed`);
}

async function mapWithConcurrency(items, limit, mapper) {
  if (!items.length) {
    return [];
  }

  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 1;
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(safeLimit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function normaliseSymbol(symbol) {
  const trimmed = symbol.trim();
  const exchangeMatch = trimmed.match(/^([A-Z]+):(.+)$/i);

  if (exchangeMatch) {
    const exchange = exchangeMatch[1].toUpperCase();
    const ticker = exchangeMatch[2].trim().toUpperCase().replace(/\.$/, '');

    if (exchange === 'LSE' || exchange === 'XLON') {
      return `${ticker}.UK`;
    }

    if (
      exchange === 'NYSE' ||
      exchange === 'XNYS' ||
      exchange === 'NASDAQ' ||
      exchange === 'XNAS'
    ) {
      return `${ticker}.US`;
    }

    if (exchange === 'XWBO') {
      return `${ticker}.SG`;
    }

    if (exchange === 'XETR' || exchange === 'XETRA') {
      return `${ticker}.DE`;
    }

    return ticker.includes('.') ? ticker : `${ticker}.US`;
  }

  const lseMatch = trimmed.match(/^LSE:(.+)$/i);

  if (lseMatch) {
    return `${lseMatch[1].toUpperCase().replace(/\.$/, '')}.UK`;
  }

  if (trimmed.includes('.')) {
    return trimmed.toUpperCase();
  }

  return `${trimmed.toUpperCase()}.US`;
}

function broadcast(payload) {
  const message = JSON.stringify(payload);

  wss.clients.forEach((client) => {
    if (client.readyState === WsWebSocket.OPEN) {
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
  const body = await fetchTextWithRetry(url, 'Stooq quote');
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

function parsePreviousCloseFromHistory(csvText) {
  if (!csvText) {
    return null;
  }

  const lines = csvText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return null;
  }

  const closingPrices = lines
    .slice(1)
    .map((line) => {
      const columns = line.split(',');
      return parseNumericValue(columns[4]);
    })
    .filter((value) => value !== null);

  if (closingPrices.length < 2) {
    return null;
  }

  return closingPrices[closingPrices.length - 2];
}

async function fetchStooqPreviousClose(resolvedSymbol) {
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(resolvedSymbol.toLowerCase())}&i=d`;
  const body = await fetchTextWithRetry(url, 'Stooq history');
  return parsePreviousCloseFromHistory(body);
}

function normaliseSymbolForYahoo(resolvedSymbol) {
  const upper = resolvedSymbol.toUpperCase();

  if (upper.endsWith('.UK')) {
    return `${upper.slice(0, -3)}.L`;
  }

  if (upper.endsWith('.US')) {
    return upper.slice(0, -3);
  }

  return upper;
}

function pickLastFinite(values) {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    const value = values[index];
    if (Number.isFinite(value)) {
      return { value, index };
    }
  }

  return null;
}

async function fetchYahooFallback(resolvedSymbol) {
  const yahooSymbol = normaliseSymbolForYahoo(resolvedSymbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1mo`;
  const body = await fetchTextWithRetry(url, 'Yahoo chart');
  const payload = JSON.parse(body);
  const result = payload?.chart?.result?.[0];
  const closes = result?.indicators?.quote?.[0]?.close;

  if (!Array.isArray(closes) || closes.length === 0) {
    return null;
  }

  const latest = pickLastFinite(closes);
  if (!latest) {
    return null;
  }

  let previousClose = null;
  for (let index = latest.index - 1; index >= 0; index -= 1) {
    if (Number.isFinite(closes[index])) {
      previousClose = closes[index];
      break;
    }
  }

  if (previousClose === null && Number.isFinite(result?.meta?.previousClose)) {
    previousClose = result.meta.previousClose;
  }

  return {
    requestedSymbol: yahooSymbol,
    price: latest.value,
    previousClose,
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
    const quoteEntries = await mapWithConcurrency(
      resolvedSymbols,
      symbolFetchConcurrency,
      async (resolvedSymbol) => {
        const [quoteResult, previousCloseResult] = await Promise.allSettled([
          fetchStooqQuote(resolvedSymbol),
          fetchStooqPreviousClose(resolvedSymbol),
        ]);

        let quote = quoteResult.status === 'fulfilled' ? quoteResult.value : null;
        let previousClose =
          previousCloseResult.status === 'fulfilled' ? previousCloseResult.value : null;

        if (!quote || quote.close === null) {
          try {
            const yahooFallback = await fetchYahooFallback(resolvedSymbol);

            if (yahooFallback) {
              quote = {
                symbol: yahooFallback.requestedSymbol,
                date: null,
                time: null,
                open: null,
                high: null,
                low: null,
                close: yahooFallback.price,
                volume: null,
              };
              previousClose = previousClose ?? yahooFallback.previousClose;
            }
          } catch (error) {
            console.error(
              `Yahoo fallback failed for ${resolvedSymbol}: ${error?.message || error}`,
            );
          }
        }

        if (!quote) {
          const quoteError =
            quoteResult.status === 'rejected'
              ? quoteResult.reason?.message || 'Unknown quote error'
              : null;
          console.error(`Failed to fetch quote for ${resolvedSymbol}: ${quoteError}`);
        }

        return [resolvedSymbol.toUpperCase(), { quote, previousClose }];
      },
    );
    const quoteBySymbol = new Map(quoteEntries);

    const prices = requestedToResolved.reduce((accumulator, symbolPair) => {
      const raw = quoteBySymbol.get(symbolPair.resolvedSymbol.toUpperCase()) || null;
      const price = raw?.quote?.close ?? raw?.quote?.open ?? null;
      const previousClose = raw?.previousClose ?? null;

      if (price !== null && price !== undefined) {
        accumulator[symbolPair.requestedSymbol] = {
          requestedSymbol: symbolPair.requestedSymbol,
          resolvedSymbol: symbolPair.resolvedSymbol,
          price,
          previousClose,
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

    if (ws.readyState === WsWebSocket.OPEN) {
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

console.log(`Realtime WebSocket server running on port ${port}`);
