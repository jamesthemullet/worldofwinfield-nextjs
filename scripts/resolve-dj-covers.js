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
//
// Some DJs can't be found (or can't be found correctly) by an exact name
// search alone — a stage name that collides with an unrelated, better
// documented Discogs entry, or one that's only catalogued under a fuller
// name. For those, add a "Discogs Override" column to the sheet and paste
// in either the DJ's Discogs artist page URL (e.g.
// https://www.discogs.com/artist/5224234-RAHA-5) or just the numeric ID
// (5224234) — search is skipped entirely and that artist is used directly.
// A DJ with a non-blank override is always re-resolved on the next run,
// even without --force, so editing the sheet is enough to fix a bad match.

const fs = require('fs');
const path = require('path');

const SHEET_ID = '1_zpDBFlpW2ZWTVsXQHoW6Y4FbGw8Vi53nMYpZiOypbg';
const OUTPUT_FILE = path.join(__dirname, '..', 'lib', 'data', 'dj-covers.json');
const USER_AGENT = 'WorldOfWinfieldCoverResolver/1.0 (jamesthemonkeh@hotmail.com)';
const FORCE = process.argv.includes('--force');

// Accepts a full Discogs artist URL or a bare numeric ID; returns null for
// anything else (including a blank cell).
function parseDiscogsOverride(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return null;

  const urlMatch = trimmed.match(/\/artist\/(\d+)/);
  if (urlMatch) return Number(urlMatch[1]);

  return /^\d+$/.test(trimmed) ? Number(trimmed) : null;
}

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
  const results = json.results || [];

  // Discogs disambiguates duplicate artist names with a trailing " (2)",
  // " (3)" etc, and search relevance ranking doesn't reliably put the
  // canonical (un-suffixed) entry first — a duplicate can outrank it. Prefer
  // an exact, un-suffixed title match; only fall back to a suffixed one
  // (via normalizeName's suffix-stripping) if no canonical entry exists.
  const rawMatch = results.find((result) => (result.title || '').trim() === name.trim());
  if (rawMatch) return rawMatch.id;

  const normalizedQuery = normalizeName(name);
  const fuzzyMatch = results.find(
    (result) => normalizeName(result.title || '') === normalizedQuery,
  );

  return fuzzyMatch ? fuzzyMatch.id : null;
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
  const overrideIndex = header.indexOf('Discogs Override');

  const overridesByName = {};
  if (overrideIndex !== -1) {
    for (const row of dataRows) {
      const name = (row[nameIndex] || '').trim();
      const artistId = parseDiscogsOverride(row[overrideIndex]);
      if (name && artistId) overridesByName[name] = artistId;
    }
  }

  let covers = {};
  if (!FORCE && fs.existsSync(OUTPUT_FILE)) {
    covers = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    console.log(`Resuming — ${Object.keys(covers).length} DJs already resolved.\n`);
  } else {
    console.log(`Starting fresh — ${dataRows.length} DJs to resolve.\n`);
  }

  const overriddenNames = Object.keys(overridesByName).filter((name) => covers[name] !== undefined);
  if (overriddenNames.length > 0) {
    console.log(
      `Re-resolving ${overriddenNames.length} overridden DJ(s): ${overriddenNames.join(', ')}\n`,
    );
    for (const name of overriddenNames) delete covers[name];
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

    const overrideArtistId = overridesByName[name];

    try {
      let artistId;
      if (overrideArtistId) {
        artistId = overrideArtistId;
      } else {
        artistId = await findArtistId(name, token);
        await sleep(rateLimitMs);
      }

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
  console.log(
    '\nReview any wrong matches — either delete that key from the JSON and re-run, or add\n' +
      'a Discogs artist URL/ID to the "Discogs Override" column in the sheet and re-run.',
  );
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
