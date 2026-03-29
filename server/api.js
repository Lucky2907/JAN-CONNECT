import express from 'express';
import cors from 'cors';
import { evaluateRedCircleGeofence } from '../src/utils/geofencingEngine.js';
import { DEFAULT_INDIA_RED_CIRCLES } from '../src/utils/redCircleStore.js';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const evaluateForensicsPayload = (payload = {}) => {
  const ela = clamp(Number(payload.ela_score || 0), 0, 100);
  const metadataOk = Boolean(payload.metadata_ok);
  const aiGenerated = Boolean(payload.ai_generated);
  const screenshotSignature = Boolean(payload.screenshot_signature);
  const recycledPattern = Boolean(payload.recycled_pattern);

  const reasons = [];
  let suspicion = 0;

  if (ela >= 70) {
    suspicion += 30;
    reasons.push('Compression pattern appears uneven, indicating potential edits.');
  } else if (ela >= 55) {
    suspicion += 16;
    reasons.push('Moderate compression inconsistency found.');
  }

  if (!metadataOk) {
    suspicion += 22;
    reasons.push('EXIF metadata is incomplete or missing.');
  }

  if (aiGenerated) {
    suspicion += 34;
    reasons.push('Detected characteristics consistent with AI-generated visuals.');
  }

  if (screenshotSignature) {
    suspicion += 18;
    reasons.push('Screenshot-like quality and compression detected.');
  }

  if (recycledPattern) {
    suspicion += 40;
    reasons.push('Potential recycled internet image pattern detected.');
  }

  let verdict = 'REAL';
  let confidence = 86;
  let action = 'APPROVE';

  if (suspicion >= 70) {
    verdict = 'FAKE';
    confidence = clamp(62 + suspicion / 2, 81, 99);
  } else if (suspicion >= 35) {
    verdict = 'SUSPICIOUS';
    confidence = clamp(45 + suspicion / 2.2, 40, 80);
  } else {
    confidence = clamp(88 - suspicion / 3, 81, 95);
  }

  if (confidence > 80) {
    action = verdict === 'FAKE' ? 'REJECT' : 'APPROVE';
  }

  if (confidence >= 40 && confidence <= 80) {
    action = 'FLAG_FOR_REVIEW';
  }

  return {
    verdict,
    confidence: Math.round(confidence),
    reasons: reasons.length ? reasons : ['No major tampering indicators were detected.'],
    ela_score: ela,
    metadata_ok: metadataOk,
    ai_generated: aiGenerated,
    action
  };
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'jan-connect-api' });
});

app.get('/api/red-circles/default', (_req, res) => {
  res.json({ zones: DEFAULT_INDIA_RED_CIRCLES });
});

app.post('/api/forensics/analyze', (req, res) => {
  const result = evaluateForensicsPayload(req.body || {});
  res.json(result);
});

app.post('/api/geofence/evaluate', (req, res) => {
  const { citizen, activeRedCircles, previousStatusByZone, timestamp, defaultPoliceSubstation } = req.body || {};

  if (!citizen || typeof citizen.latitude !== 'number' || typeof citizen.longitude !== 'number') {
    res.status(400).json({
      error: 'citizen.latitude and citizen.longitude are required numbers.'
    });
    return;
  }

  const zones = Array.isArray(activeRedCircles) && activeRedCircles.length
    ? activeRedCircles
    : DEFAULT_INDIA_RED_CIRCLES;

  const result = evaluateRedCircleGeofence(
    { latitude: citizen.latitude, longitude: citizen.longitude },
    zones,
    {
      previousStatusByZone: previousStatusByZone || {},
      timestamp,
      defaultPoliceSubstation: defaultPoliceSubstation || 'Central Substation'
    }
  );

  res.json(result);
});

app.listen(port, () => {
  console.log(`JAN CONNECT API server running on port ${port}`);
});
