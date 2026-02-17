# Realtime WebSocket Service

This service runs a standalone WebSocket server that fetches prices from Stooq and broadcasts updates to connected clients.

## Setup

1. Install dependencies:

   ```bash
   yarn --cwd realtime install
   ```

2. Create an env file from the template:

   ```bash
   copy realtime\\.env.example realtime\\.env
   ```

3. (Optional) Set `SYMBOLS` in `realtime/.env` or project root `.env`.

No API key is required for Stooq quote requests.

## Run

- From repo root:

  ```bash
  yarn dev:realtime
  ```

- Or directly:

  ```bash
  yarn --cwd realtime dev
  ```

Server starts on `ws://localhost:8081` by default.

Default polling is once per minute (`POLL_INTERVAL_MS=60000`) to keep request volume low.

For London Stock Exchange symbols, use `LSE:TICKER` (for example `LSE:FUTR`).

For US symbols, use the plain ticker (for example `NVDA`).

If port `8081` is already in use, set `PORT` in `realtime/.env` (for example `PORT=8090`) and set the frontend URL too:

```bash
# root .env.local
NEXT_PUBLIC_STOCKS_WS_URL=ws://localhost:8090
```

## Production

For production, deploy this `realtime` service to a host that supports long-running Node processes (for example Render, Railway, Fly, VPS).

Then set this environment variable in your Next.js production app:

```bash
NEXT_PUBLIC_STOCKS_WS_URL=wss://your-realtime-domain.example.com
```

Do not use `localhost` in production environment variables.

## Frontend usage

```ts
const socket = new WebSocket('ws://localhost:8081');
socket.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  if (payload.type === 'prices') {
    console.log(payload.data);
  }
};
```
