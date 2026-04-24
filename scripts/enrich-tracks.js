#!/usr/bin/env node
// Reads your favourite-tracks Google Sheet, looks up each track on MusicBrainz,
// and outputs an enriched CSV with Year Released, Label, and a confidence score.
//
// Usage:
//   node scripts/enrich-tracks.js
//
// The script saves progress as it goes (enrich-tracks-progress.json) so if it
// gets interrupted you can just re-run it and it will pick up where it left off.
// Low-confidence matches are flagged with ⚠️  — review those before importing.

const fs = require('fs');
const path = require('path');

const SHEET_ID = '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA';
const PROGRESS_FILE = path.join(__dirname, 'enrich-tracks-progress.json');
const OUTPUT_FILE = path.join(__dirname, 'enrich-tracks-output.csv');
const MB_USER_AGENT = 'WorldOfWinfieldEnricher/1.0 (jamesthemonkeh@hotmail.com)';
const RATE_LIMIT_MS = 1100; // MusicBrainz allows ~1 req/sec; stay just under
const CONFIDENCE_THRESHOLD = 70; // scores below this get flagged for review

// --- helpers ---

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

function parseArtistTrack(combined) {
  // Split on the first occurrence of " - " only
  const idx = combined.indexOf(' - ');
  if (idx === -1) return { artist: combined.trim(), track: null };
  return {
    artist: combined.slice(0, idx).trim(),
    track: combined.slice(idx + 3).trim(),
  };
}

function escapeCSV(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// --- API calls ---

async function fetchSheet(apiKey) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?alt=json&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet API returned ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (!json.values) throw new Error('No values returned from sheet');
  return json.values;
}

async function queryMusicBrainz(artist, track) {
  // Escape quotes inside field values for the Lucene query
  const safeArtist = artist.replace(/"/g, '\\"');
  const safeTrack = track.replace(/"/g, '\\"');
  const q = `recording:"${safeTrack}" AND artist:"${safeArtist}"`;
  const url = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(q)}&fmt=json&limit=5&inc=releases+labels`;
  const res = await fetch(url, { headers: { 'User-Agent': MB_USER_AGENT } });
  if (res.status === 503) throw new Error('MusicBrainz rate limit hit — try again later');
  if (!res.ok) throw new Error(`MusicBrainz returned ${res.status}`);
  return res.json();
}

function extractInfo(mbResult) {
  const recordings = mbResult.recordings || [];
  if (!recordings.length) return { year: '', label: '', confidence: 0 };

  const top = recordings[0];
  const confidence = top.score ?? 0;

  // Find the earliest dated release to get the original release year + label
  const releases = (top.releases || []).filter((r) => r.date);
  releases.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const earliest = releases[0];
  if (!earliest) return { year: '', label: '', confidence };

  const year = earliest.date ? earliest.date.slice(0, 4) : '';
  const labelInfo = earliest['label-info'] || [];
  const label = labelInfo[0]?.label?.name || '';

  return { year, label, confidence };
}

// --- main ---

async function main() {
  loadEnvLocal();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    console.error('Error: NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('Fetching sheet data...');
  const rows = await fetchSheet(apiKey);
  const [header, ...dataRows] = rows;

  const artistTrackIndex = header.indexOf('Artist/Track Name');
  if (artistTrackIndex === -1) {
    console.error('Error: Could not find "Artist/Track Name" column in sheet');
    process.exit(1);
  }

  // Load existing progress so we can resume interrupted runs
  let progress = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    const done = Object.keys(progress).length;
    console.log(`Resuming — ${done} tracks already processed, ${dataRows.length - done} remaining.\n`);
  } else {
    console.log(`Starting fresh — ${dataRows.length} tracks to process.\n`);
  }

  let enriched = 0;
  let skipped = 0;
  let failed = 0;
  let flagged = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const combined = (row[artistTrackIndex] || '').trim();

    if (!combined) continue;

    // Already done in a previous run
    if (progress[combined] !== undefined) {
      skipped++;
      continue;
    }

    const { artist, track } = parseArtistTrack(combined);

    if (!track) {
      progress[combined] = { year: '', label: '', confidence: 0, note: 'could not parse artist/track' };
      console.warn(`[${i + 1}/${dataRows.length}] SKIPPED (unparseable): ${combined}`);
      skipped++;
      continue;
    }

    try {
      const mbResult = await queryMusicBrainz(artist, track);
      const { year, label, confidence } = extractInfo(mbResult);
      const isLowConfidence = confidence < CONFIDENCE_THRESHOLD;

      progress[combined] = { year, label, confidence };
      enriched++;
      if (isLowConfidence) flagged++;

      const flag = isLowConfidence ? ' ⚠️' : '';
      console.log(
        `[${i + 1}/${dataRows.length}] ${combined}\n` +
        `  → ${year || '(no year)'}, ${label || '(no label)'}  score: ${confidence}${flag}\n`
      );
    } catch (err) {
      progress[combined] = { year: '', label: '', confidence: 0, note: err.message };
      failed++;
      console.error(`[${i + 1}/${dataRows.length}] FAILED: ${combined}\n  → ${err.message}\n`);
    }

    // Save progress every 20 tracks in case the run gets interrupted
    if ((enriched + failed) % 20 === 0) {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    }

    await sleep(RATE_LIMIT_MS);
  }

  // Final progress save
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));

  // Write enriched CSV
  const newHeaders = [...header, 'Year Released', 'Label', 'MB Confidence'];
  const csvLines = [newHeaders.map(escapeCSV).join(',')];

  for (const row of dataRows) {
    const combined = (row[artistTrackIndex] || '').trim();
    const info = progress[combined] || { year: '', label: '', confidence: '' };
    csvLines.push([...row, info.year, info.label, info.confidence].map(escapeCSV).join(','));
  }

  fs.writeFileSync(OUTPUT_FILE, csvLines.join('\n'), 'utf8');

  console.log('─'.repeat(60));
  console.log(`Done!`);
  console.log(`  Enriched:  ${enriched}`);
  console.log(`  Skipped:   ${skipped} (already processed)`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Flagged:   ${flagged} (confidence < ${CONFIDENCE_THRESHOLD} — review these)`);
  console.log(`\nOutput: ${OUTPUT_FILE}`);
  console.log(`Progress saved: ${PROGRESS_FILE}`);
  console.log('\nNext steps:');
  console.log('  1. Open enrich-tracks-output.csv and filter by low MB Confidence scores');
  console.log('  2. Manually fix any wrong matches');
  console.log('  3. Import/paste the Year Released and Label columns into your Google Sheet');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
