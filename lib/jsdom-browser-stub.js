// `lib/sanitize.ts` only requires `jsdom` on the server, to sanitize HTML during static
// generation where there's no browser `window`. That branch never runs in the browser, so this
// stub (aliased in for client builds via `turbopack.resolveAlias` in next.config.js) keeps
// jsdom's Node-only dependencies (net, tls, …) out of the client bundle entirely.
module.exports = {};
