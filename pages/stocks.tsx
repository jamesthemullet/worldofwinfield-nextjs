import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Container from '../components/container';
import Layout from '../components/layout';
import PostHeader from '../components/post-header';

type StockRow = {
  symbol: string;
  price: string;
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
    return 'ws://localhost:8081';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.hostname}:8081`;
};

const formatPrice = (value: unknown) => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }

  if (typeof value === 'string') {
    return value;
  }

  return 'N/A';
};

const normalisePrices = (input: unknown): StockRow[] => {
  if (!input || typeof input !== 'object') {
    return [];
  }

  const raw = input as Record<string, unknown>;
  const rows = Object.entries(raw)
    .filter(([key, value]) => {
      if (key === 'code' || key === 'message' || key === 'status') {
        return false;
      }

      return !!value && typeof value === 'object';
    })
    .map(([symbol, value]) => {
      const stock = value as Record<string, unknown>;
      console.log(9, stock);
      const priceValue = stock.price;
      const errorValue = stock.error;
      return {
        symbol,
        price: errorValue ? 'N/A' : formatPrice(priceValue),
      };
    })
    .filter((row) => row.symbol);

  return rows;
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
            console.log(8, payload);

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

            if (nextStocks.length) {
              setStocks(nextStocks);
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
                  stocks.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>{stock.symbol}</td>
                      <td>{stock.price}</td>
                    </tr>
                  ))
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

const TableWrapper = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--colour-dark);
  }

  th,
  td {
    border: 1px solid var(--colour-dark);
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: var(--colour-dark);
    color: var(--colour-white);
    font-family: 'Oswald', sans-serif;
    letter-spacing: 1px;
  }
`;
