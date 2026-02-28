import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';

type StockRow = {
  symbol: string;
  companyName: string;
  price: number | null;
  previousClose?: number | null;
  previousPrice?: number | null;
  tickDirection?: 'up' | 'down' | null;
  pulseNonce?: number;
};

type PricesPayload = {
  type?: string;
  level?: 'info' | 'error';
  message?: string;
  data?: unknown;
  timestamp?: string;
};

const OWNED_STOCK_SYMBOLS = new Set([
  'XLON:GAW',
  'XLON:YU.',
  'XLON:FORT',
  'XLON:GRI',
  'XLON:THRL',
  'XLON:IPX',
  'XLON:TW.',
  'XLON:FOUR',
  'XLON:RWS',
  'XNYS:NVO',
  'XNYS:EVTL',
  'XLON:EMG',
  'XLON:CAML',
  'XLON:SQZ',
  'XLON:COST',
  'XNAS:RYAAY',
  'XLON:KLR',
  'XLON:MONY',
  'XWBO:OMV',
  'XLON:JET2',
  'XLON:FUTR',
  'XLON:MGNS',
  'XLON:MKS',
  'XLON:EVR',
]);

const OWNED_FUND_SYMBOLS = new Set([
  'XLON:AIE',
  'XLON:BRLA',
  'XLON:BIOG',
  'XLON:IBT',
  'XLON:FSG',
  'XLON:PCGH',
  'XLON:GCL',
  'XLON:0LY1',
  'XLON:JEGI',
  'XLON:CGEO',
  'XLON:JGGI',
  'XLON:PCT',
  'XLON:SPOL',
  'XLON:NAVF',
  'XLON:JEDT',
  'XLON:IAD',
  'XLON:IKOR',
  'XLON:FCSS',
  'XLON:HFEL',
  'XLON:BRSC',
  'XLON:JUSC',
  'XLON:GSCT',
  'XLON:TRIG',
  'XLON:ROBG',
  'XLON:SSIT',
  'XETR:PCFP',
  'XETR:PCFH',
  'XLON:BRFI',
]);

const COMPANY_NAMES: Record<string, string> = {
  'XLON:GAW': 'Games Workshop Group PLC',
  'XLON:YU.': 'YU Group PLC',
  'XLON:FORT': 'Forterra PLC',
  'XLON:GRI': 'Grainger PLC',
  'XLON:THRL': 'Target Healthcare REIT PLC',
  'XLON:IPX': 'Impax Asset Management Group PLC',
  'XLON:TW.': 'Taylor Wimpey PLC',
  'XLON:FOUR': '4imprint Group PLC',
  'XLON:RWS': 'RWS Holdings PLC',
  'XNYS:NVO': 'Novo Nordisk A/S',
  'XNYS:EVTL': 'Vertical Aerospace Ltd.',
  'XLON:EMG': 'Man Group PLC',
  'XLON:CAML': 'Central Asia Metals PLC',
  'XLON:SQZ': 'Serica Energy PLC',
  'XLON:COST': 'Costain Group PLC',
  'XNAS:RYAAY': 'Ryanair Holdings plc',
  'XLON:KLR': 'Keller Group PLC',
  'XLON:MONY': 'MONY Group plc',
  'XWBO:OMV': 'OMV AG',
  'XLON:JET2': 'Jet2 PLC',
  'XLON:FUTR': 'Future PLC',
  'XLON:MGNS': 'Morgan Sindall Group PLC',
  'XLON:MKS': 'Marks and Spencer Group p.l.c.',
  'XLON:EVR': 'Evraz PLC',
  'XLON:AIE': 'Ashoka India Equity Investment Trust PLC',
  'XLON:BRLA': 'BlackRock Latin American Investment Trust PLC',
  'XLON:BIOG': 'The Biotech Growth Trust PLC',
  'XLON:IBT': 'International Biotechnology Trust PLC',
  'XLON:FSG': 'Foresight Group Holdings Limited',
  'XLON:PCGH': 'Polar Capital Global Healthcare Trust PLC',
  'XLON:GCL': 'Geiger Counter Limited',
  'XLON:0LY1': 'WisdomTree, Inc.',
  'XLON:JEGI': 'JPMorgan European Growth & Income PLC',
  'XLON:CGEO': 'Georgia Capital PLC',
  'XLON:JGGI': 'JPMorgan Global Growth & Income PLC',
  'XLON:PCT': 'Polar Capital Technology Trust PLC',
  'XLON:SPOL': 'iShares MSCI Pol ETF USD A',
  'XLON:NAVF': 'Nippon Active Value Fund PLC',
  'XLON:JEDT': 'JPMorgan European Discovery Trust PLC',
  'XLON:IAD': 'Invesco Asia Dragon Trust PLC',
  'XLON:IKOR': 'iShares MSCI Korea ETF USD D',
  'XLON:FCSS': 'Fidelity China Special Situations PLC',
  'XLON:HFEL': 'Henderson Far East Income Limited',
  'XLON:BRSC': 'BlackRock Smaller Companies Trust PLC',
  'XLON:JUSC': 'JPMorgan US Smaller Companies Investment Trust PLC',
  'XLON:GSCT': 'The Global Smaller Companies Trust PLC',
  'XLON:TRIG': 'The Renewables Infrastructure Group Limited',
  'XLON:ROBG': 'L&G ROBO Global Robotics and Automation UCITS ETF',
  'XLON:SSIT': 'Seraphim Space Investment Trust PLC',
  'XETR:PCFP': 'WisdomTree Gold 3x Daily Leveraged',
  'XETR:PCFH': 'WisdomTree Silver 3x Daily Leveraged',
  'XLON:BRFI': 'BlackRock Frontiers Investment Trust PLC',
};

const normaliseSymbolAlias = (symbol: string): string => {
  const trimmed = symbol.trim().toUpperCase();
  const match = trimmed.match(/^([A-Z]+):(.+)$/);

  if (!match) {
    return trimmed;
  }

  const exchange = match[1];
  const ticker = match[2].replace(/\.$/, '');

  if (exchange === 'LSE' || exchange === 'XLON') {
    return `XLON:${ticker}`;
  }

  if (exchange === 'NYSE' || exchange === 'XNYS') {
    return `XNYS:${ticker}`;
  }

  if (exchange === 'NASDAQ' || exchange === 'XNAS') {
    return `XNAS:${ticker}`;
  }

  if (exchange === 'XETRA' || exchange === 'XETR') {
    return `XETR:${ticker}`;
  }

  return `${exchange}:${ticker}`;
};

const getCompanyName = (symbol: string): string => COMPANY_NAMES[symbol] || symbol;

const resolveDefaultWsUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const isLocalHost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (!isLocalHost) {
    return '';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.hostname}:8081`;
};

const normalisePrices = (input: unknown): StockRow[] => {
  if (!input || typeof input !== 'object') {
    return [];
  }

  const raw = input as Record<string, unknown>;

  return Object.entries(raw)
    .filter(([, value]) => value && typeof value === 'object')
    .map(([symbol, value]) => {
      const canonicalSymbol = normaliseSymbolAlias(symbol);
      const stock = value as Record<string, unknown>;
      const priceValue = stock.price;
      const previousCloseValue = stock.previousClose;
      const errorValue = stock.error;
      const numericPrice =
        typeof priceValue === 'number'
          ? priceValue
          : typeof priceValue === 'string'
            ? Number(priceValue)
            : null;

      return {
        symbol: canonicalSymbol,
        companyName: getCompanyName(canonicalSymbol),
        price: errorValue || !Number.isFinite(numericPrice) ? null : numericPrice,
        previousClose: typeof previousCloseValue === 'number' ? previousCloseValue : null,
      };
    });
};

const buildConfiguredRows = (symbols: Set<string>, liveRows: StockRow[]): StockRow[] => {
  const liveBySymbol = new Map(
    liveRows.map((row) => [normaliseSymbolAlias(row.symbol), { ...row, symbol: normaliseSymbolAlias(row.symbol) }]),
  );

  return Array.from(symbols).map((symbol) => {
    const canonicalSymbol = normaliseSymbolAlias(symbol);
    const existing = liveBySymbol.get(canonicalSymbol);

    if (existing) {
      return existing;
    }

    return {
      symbol: canonicalSymbol,
      companyName: getCompanyName(canonicalSymbol),
      price: null,
      previousClose: null,
      previousPrice: null,
      tickDirection: null,
      pulseNonce: 0,
    };
  });
};

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockRow[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>(
    'connecting',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const wsUrl = useMemo(() => process.env.NEXT_PUBLIC_STOCKS_WS_URL || resolveDefaultWsUrl(), []);
  const ownedStocks = useMemo(
    () => buildConfiguredRows(OWNED_STOCK_SYMBOLS, stocks),
    [stocks],
  );
  const ownedFunds = useMemo(
    () => buildConfiguredRows(OWNED_FUND_SYMBOLS, stocks),
    [stocks],
  );

  useEffect(() => {
    if (!wsUrl) {
      setStatus('error');
      setErrorMessage('Set NEXT_PUBLIC_STOCKS_WS_URL to your public websocket URL in production.');
      return;
    }

    let activeSocket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let shouldReconnect = true;

    const connect = () => {
      try {
        activeSocket = new WebSocket(wsUrl);
        setStatus('connecting');

        activeSocket.onopen = () => {
          setStatus('connected');
          setErrorMessage(null);
        };

        activeSocket.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data) as PricesPayload;

            if (payload.type === 'status') {
              if (payload.level === 'error') {
                setErrorMessage(payload.message || 'Realtime server reported an error.');
              } else {
                setErrorMessage(null);
              }

              setServerMessage(payload.message || null);
              return;
            }

            if (payload.type !== 'prices') {
              return;
            }

            const nextStocks = normalisePrices(payload.data);

            setStocks((currentStocks) => {
              const previousMap = new Map(currentStocks.map((s) => [s.symbol, s.price]));
              const previousPulseMap = new Map(
                currentStocks.map((s) => [s.symbol, s.pulseNonce ?? 0]),
              );

              return nextStocks.map((stock) => {
                const previousPrice = previousMap.get(stock.symbol) ?? null;
                const tickChange =
                  previousPrice !== null && stock.price !== null ? stock.price - previousPrice : 0;

                const tickDirection = tickChange > 0 ? 'up' : tickChange < 0 ? 'down' : null;
                const previousPulseNonce = previousPulseMap.get(stock.symbol) ?? 0;

                return {
                  ...stock,
                  previousPrice,
                  tickDirection,
                  pulseNonce: tickDirection ? previousPulseNonce + 1 : previousPulseNonce,
                };
              });
            });

            if (nextStocks.length) {
              setLastUpdated(payload.timestamp || new Date().toISOString());
              setErrorMessage(null);
              setServerMessage(null);
            }
          } catch {
            setErrorMessage('Received invalid message from realtime server.');
            setStatus('error');
          }
        };

        activeSocket.onerror = () => {
          setStatus('error');
          setErrorMessage(`Unable to connect to realtime server at ${wsUrl}.`);
        };

        activeSocket.onclose = () => {
          setStatus('disconnected');

          if (shouldReconnect) {
            reconnectTimer = setTimeout(connect, 2000);
          }
        };
      } catch {
        setStatus('error');
        setErrorMessage('WebSocket is not available in this browser.');
      }
    };

    connect();

    return () => {
      shouldReconnect = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      if (activeSocket) {
        activeSocket.close();
      }
    };
  }, [wsUrl]);

  return (
    <Layout preview={null} title="Stocks">
      <Container>
        <PostHeader title="Stocks" />

        <PageContainer>
          <StatusRow>
            <span>Connection: {status}</span>
            <span>Server: {wsUrl}</span>
            {lastUpdated ? (
              <span>Last update: {new Date(lastUpdated).toLocaleTimeString()}</span>
            ) : null}
          </StatusRow>

          {errorMessage ? <ErrorText>{errorMessage}</ErrorText> : null}
          {serverMessage && !errorMessage ? <InfoText>{serverMessage}</InfoText> : null}

          <h2>Stocks I Own</h2>

          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {ownedStocks.map((stock) => {
                    const baseline = stock.previousClose ?? stock.previousPrice ?? null;

                    const change =
                      baseline !== null && stock.price !== null ? stock.price - baseline : null;

                    const percent = change !== null && baseline ? (change / baseline) * 100 : null;

                    const direction =
                      change === null ? null : change > 0 ? 'up' : change < 0 ? 'down' : null;

                    const pulseClass =
                      stock.tickDirection !== null
                        ? `pulse-${stock.tickDirection}-${(stock.pulseNonce || 0) % 2 === 0 ? 'a' : 'b'}`
                        : '';

                    return (
                      <tr
                        key={stock.symbol}
                        className={[direction || '', pulseClass].filter(Boolean).join(' ')}>
                        <td>
                          {stock.companyName}
                          <SymbolText>{stock.symbol}</SymbolText>
                        </td>

                        <td>
                          <Price className={direction || ''}>
                            {stock.price !== null ? stock.price.toFixed(2) : 'N/A'}
                          </Price>

                          {change !== null && percent !== null && (
                            <Change className={direction || ''}>
                              {change > 0 ? '+' : ''}
                              {change.toFixed(2)} ({percent.toFixed(2)}%)
                            </Change>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </TableWrapper>

          <h2>Funds I Own</h2>

          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {ownedFunds.map((stock) => {
                    const baseline = stock.previousClose ?? stock.previousPrice ?? null;

                    const change =
                      baseline !== null && stock.price !== null ? stock.price - baseline : null;

                    const percent = change !== null && baseline ? (change / baseline) * 100 : null;

                    const direction =
                      change === null ? null : change > 0 ? 'up' : change < 0 ? 'down' : null;

                    const pulseClass =
                      stock.tickDirection !== null
                        ? `pulse-${stock.tickDirection}-${(stock.pulseNonce || 0) % 2 === 0 ? 'a' : 'b'}`
                        : '';

                    return (
                      <tr
                        key={stock.symbol}
                        className={[direction || '', pulseClass].filter(Boolean).join(' ')}>
                        <td>
                          {stock.companyName}
                          <SymbolText>{stock.symbol}</SymbolText>
                        </td>

                        <td>
                          <Price className={direction || ''}>
                            {stock.price !== null ? stock.price.toFixed(2) : 'N/A'}
                          </Price>

                          {change !== null && percent !== null && (
                            <Change className={direction || ''}>
                              {change > 0 ? '+' : ''}
                              {change.toFixed(2)} ({percent.toFixed(2)}%)
                            </Change>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </TableWrapper>
        </PageContainer>
      </Container>
    </Layout>
  );
}

const PageContainer = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0;
  font-family: 'Oswald', sans-serif;
  text-transform: capitalize;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ErrorText = styled.p`
  color: var(--colour-pink);
  margin: 0.5rem 0 1rem;
`;

const SymbolText = styled.span`
  display: block;
  opacity: 0.7;
  font-size: 0.8rem;
`;

const InfoText = styled.p`
  color: var(--colour-azure);
  margin: 0.5rem 0 1rem;
`;

const Price = styled.div`
  font-weight: bold;
  transition: color 0.2s ease;

  &.up {
    color: #16a34a;
  }

  &.down {
    color: #dc2626;
  }
`;

const Change = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;

  &.up {
    color: #16a34a;
  }

  &.down {
    color: #dc2626;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--colour-dark);
  }

  tr.up {
    background: rgba(22, 163, 74, 0.05);
  }

  tr.down {
    background: rgba(220, 38, 38, 0.05);
  }

  tr.pulse-up-a,
  tr.pulse-up-b {
    animation: flashUp 0.45s ease;
  }

  tr.pulse-down-a,
  tr.pulse-down-b {
    animation: flashDown 0.45s ease;
  }

  @keyframes flashUp {
    0% {
      background: rgba(22, 163, 74, 0.15);
    }
    100% {
      background: transparent;
    }
  }

  @keyframes flashDown {
    0% {
      background: rgba(220, 38, 38, 0.15);
    }
    100% {
      background: transparent;
    }
  }
`;
