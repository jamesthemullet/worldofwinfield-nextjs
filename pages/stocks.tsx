import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';

type StockRow = {
  symbol: string;
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
      const stock = value as Record<string, unknown>;
      const priceValue = stock.price;
      const previousCloseValue = stock.previousClose;
      const errorValue = stock.error;

      return {
        symbol,
        price: errorValue || typeof priceValue !== 'number' ? null : priceValue,
        previousClose: typeof previousCloseValue === 'number' ? previousCloseValue : null,
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
              const previousPulseMap = new Map(currentStocks.map((s) => [s.symbol, s.pulseNonce ?? 0]));

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
        <PageContainer>
          <StyledPostHeader>
            <PostHeader title="Stocks" />
          </StyledPostHeader>

          <StatusRow>
            <span>Connection: {status}</span>
            <span>Server: {wsUrl}</span>
            {lastUpdated ? (
              <span>Last update: {new Date(lastUpdated).toLocaleTimeString()}</span>
            ) : null}
          </StatusRow>

          {errorMessage ? <ErrorText>{errorMessage}</ErrorText> : null}
          {serverMessage && !errorMessage ? <InfoText>{serverMessage}</InfoText> : null}

          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {stocks.length ? (
                  stocks.map((stock) => {
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
                      <tr key={stock.symbol} className={[direction || '', pulseClass].filter(Boolean).join(' ')}>
                        <td>{stock.symbol}</td>

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
                  })
                ) : (
                  <tr>
                    <td colSpan={2}>Waiting for live prices…</td>
                  </tr>
                )}
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

const StyledPostHeader = styled.div`
  margin: 0 auto;
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
