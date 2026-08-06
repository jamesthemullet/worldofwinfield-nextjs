#!/usr/bin/env node
// Reads your favourite-djs Google Sheet, looks up each DJ on Discogs (the
// database this underground/electronic scene actually catalogues itself in),
// and writes resolved artist photo URLs to lib/data/dj-covers.json.
//
// Usage:
//   node scripts/resolve-dj-covers.js [--force]
//
// The page reads lib/data/dj-covers.json directly at build time — nothing
// calls Discogs at request/build time. That's deliberate: Discogs' rate limit
// (25 req/min unauthenticated, 60/min with a DISCOGS_TOKEN) is too slow for
// ~200 DJs x 2 calls each to fit inside an ISR revalidation. Run this script
// by hand whenever the DJ list changes, review the output, then commit it.
//
// The script saves progress as it goes, so if it gets interrupted you can
// just re-run it and it will pick up where it left off. Pass --force to
// re-resolve every DJ (e.g. after raising DISCOGS_TOKEN rate limits or fixing
// a bug in the matching logic).

const fs = require('fs');
const path = require('path');

const SHEET_ID = '1_zpDBFlpW2ZWTVsXQHoW6Y4FbGw8Vi53nMYpZiOypbg';
const OUTPUT_FILE = path.join(__dirname, '..', 'lib', 'data', 'dj-covers.json');
const USER_AGENT = 'WorldOfWinfieldCoverResolver/1.0 (jamesthemonkeh@hotmail.com)';
const FORCE = process.argv.includes('--force');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

// Discogs disambiguates same-named artists with a trailing " (2)", " (3)" etc.
// — strip that before comparing so "Raha (3)" can still match a query of "Raha".
function stripDisambiguationSuffix(name) {
  return (name || '').replace(/\s*\(\d+\)\s*$/, '');
}

function normalizeName(name) {
  return stripDisambiguationSuffix(name)
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

async function discogsFetch(url, token) {
  const headers = { 'User-Agent': USER_AGENT };
  if (token) headers.Authorization = `Discogs token=${token}`;

  const res = await fetch(url, { headers });
  if (res.status === 429) throw new Error('Discogs rate limit hit — try again later');
  if (!res.ok) throw new Error(`Discogs returned ${res.status}`);
  return res.json();
}

async function findArtistId(name, token) {
  const params = new URLSearchParams({ q: name, type: 'artist' });
  const json = await discogsFetch(`https://api.discogs.com/database/search?${params}`, token);

  const normalizedQuery = normalizeName(name);
  const match = (json.results || []).find(
    (result) => normalizeName(result.title || '') === normalizedQuery,
  );

  return match ? match.id : null;
}

async function fetchArtistImageUrl(artistId, token) {
  const json = await discogsFetch(`https://api.discogs.com/artists/${artistId}`, token);
  const primary = (json.images || []).find((img) => img.type === 'primary') || json.images?.[0];
  return primary?.uri || null;
}

async function fetchSheet(apiKey) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?alt=json&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet API returned ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (!json.values) throw new Error('No values returned from sheet');
  return json.values;
}

async function main() {
  loadEnvLocal();

  const sheetApiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
  if (!sheetApiKey) {
    console.error('Error: NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY not found in .env');
    process.exit(1);
  }

  const token = process.env.DISCOGS_TOKEN;
  const rateLimitMs = token ? 1050 : 2500;
  console.log(
    token
      ? 'Using DISCOGS_TOKEN — pacing at ~60 req/min.'
      : 'No DISCOGS_TOKEN found — pacing at ~25 req/min (set DISCOGS_TOKEN in .env for a faster run).',
  );

  console.log('Fetching sheet data...');
  const rows = await fetchSheet(sheetApiKey);
  const [header, ...dataRows] = rows;

  const nameIndex = header.indexOf('Name');
  if (nameIndex === -1) {
    console.error('Error: Could not find "Name" column in sheet');
    process.exit(1);
  }

  let covers = {};
  if (!FORCE && fs.existsSync(OUTPUT_FILE)) {
    covers = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    console.log(`Resuming — ${Object.keys(covers).length} DJs already resolved.\n`);
  } else {
    console.log(`Starting fresh — ${dataRows.length} DJs to resolve.\n`);
  }

  let resolved = 0;
  let notFound = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const name = (dataRows[i][nameIndex] || '').trim();
    if (!name) continue;

    if (covers[name] !== undefined) {
      skipped++;
      continue;
    }

    try {
      const artistId = await findArtistId(name, token);
      await sleep(rateLimitMs);

      if (!artistId) {
        covers[name] = null;
        notFound++;
        console.log(`[${i + 1}/${dataRows.length}] ${name} → no exact match on Discogs`);
      } else {
        const imageUrl = await fetchArtistImageUrl(artistId, token);
        await sleep(rateLimitMs);

        covers[name] = imageUrl;
        resolved++;
        console.log(`[${i + 1}/${dataRows.length}] ${name} → ${imageUrl || '(no image)'}`);
      }
    } catch (err) {
      covers[name] = null;
      failed++;
      console.error(`[${i + 1}/${dataRows.length}] FAILED: ${name} → ${err.message}`);
      await sleep(rateLimitMs);
    }

    if ((resolved + notFound + failed) % 10 === 0) {
      fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(covers, null, 2));
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(covers, null, 2));

  console.log('─'.repeat(60));
  console.log('Done!');
  console.log(`  Resolved:  ${resolved}`);
  console.log(`  No match:  ${notFound}`);
  console.log(`  Skipped:   ${skipped} (already in cache)`);
  console.log(`  Failed:    ${failed}`);
  console.log(`\nOutput: ${OUTPUT_FILE}`);
  console.log('\nReview any wrong matches, delete that key from the JSON, and re-run to retry it.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
