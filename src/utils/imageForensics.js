const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const AI_MODEL_ID = 'Xenova/clip-vit-base-patch32';

const LABELS = [
  'a real camera photo of a civic issue',
  'an AI-generated image',
  'a screenshot or screen capture',
  'an edited or manipulated photo'
];

let classifierPromise = null;

const getClassifier = async () => {
  if (!classifierPromise) {
    const { pipeline } = await import('@xenova/transformers');
    classifierPromise = pipeline('zero-shot-image-classification', AI_MODEL_ID);
  }

  return classifierPromise;
};

const loadImageDimensions = (file) => new Promise((resolve) => {
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);

  img.onload = () => {
    const result = { width: img.naturalWidth || 0, height: img.naturalHeight || 0 };
    URL.revokeObjectURL(objectUrl);
    resolve(result);
  };

  img.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    resolve({ width: 0, height: 0 });
  };

  img.src = objectUrl;
});

const normalizeLabel = (label = '') => label.toLowerCase();

const fallbackHeuristicScan = async (file, options = {}) => {
  const knownImageFingerprints = options.knownImageFingerprints || [];
  const { width, height } = await loadImageDimensions(file);
  const pixelCount = Math.max(width * height, 1);
  const bytesPerPixel = file.size / pixelCount;
  const megaPixels = pixelCount / 1000000;

  const lowerName = (file.name || '').toLowerCase();
  const fingerprint = `${lowerName}-${file.size}-${width}x${height}`;
  const screenshotName = /screenshot|screen_shot|screen-shot|capture/.test(lowerName);
  const screenshotAspect = width > 0 && height > 0 && width / height > 1.6 && width / height < 2.1;
  const recycledPattern = knownImageFingerprints.includes(fingerprint);
  const aiNameHint = /midjourney|dalle|stable[-_ ]?diffusion|generated|ai/.test(lowerName);
  const aiCompressionHint = megaPixels >= 6 && bytesPerPixel < 0.1;

  let suspicionScore = 0;
  const reasons = [];

  if (!file.type || !file.lastModified || !file.name) {
    suspicionScore += 24;
    reasons.push('Image metadata is missing or incomplete.');
  }

  if (screenshotName || screenshotAspect) {
    suspicionScore += 18;
    reasons.push('The file looks like a screenshot or capture.');
  }

  if (aiNameHint || aiCompressionHint) {
    suspicionScore += 28;
    reasons.push('The file name or compression pattern suggests AI generation.');
  }

  if (recycledPattern) {
    suspicionScore += 42;
    reasons.push('This fingerprint matches a previously submitted file.');
  }

  const verdict = suspicionScore >= 55 ? 'SUSPICIOUS' : 'REAL';
  const action = verdict === 'SUSPICIOUS' ? 'FLAG_FOR_REVIEW' : 'APPROVE';

  return {
    verdict,
    confidence: clamp(50 + suspicionScore, 50, 90),
    reasons: reasons.length ? reasons : ['No strong tampering indicators were detected.'],
    ela_score: Math.round(clamp(35 + suspicionScore, 0, 100)),
    metadata_ok: Boolean(file.type) && Boolean(file.lastModified) && Boolean(file.name),
    ai_generated: Boolean(aiNameHint || aiCompressionHint),
    action,
    model: 'heuristic-fallback'
  };
};

const runAiScan = async (file) => {
  const classifier = await getClassifier();
  const predictions = await classifier(file, LABELS, { topk: LABELS.length });

  const ranked = Array.isArray(predictions) ? predictions : [];
  const topPrediction = ranked[0] || { label: LABELS[0], score: 0.5 };
  const confidence = Math.round((topPrediction.score || 0) * 100);

  const labelScores = new Map(
    ranked.map((item) => [normalizeLabel(item.label), item.score || 0])
  );

  const realScore = labelScores.get(normalizeLabel(LABELS[0])) || 0;
  const aiScore = labelScores.get(normalizeLabel(LABELS[1])) || 0;
  const screenshotScore = labelScores.get(normalizeLabel(LABELS[2])) || 0;
  const editedScore = labelScores.get(normalizeLabel(LABELS[3])) || 0;

  const reasons = ranked.slice(0, 3).map((item) => {
    const percent = Math.round((item.score || 0) * 100);
    return `${item.label} (${percent}%)`;
  });

  let verdict = 'REAL';
  let action = 'APPROVE';

  if (aiScore >= Math.max(realScore, screenshotScore, editedScore) && aiScore >= 0.34) {
    verdict = 'FAKE';
    action = 'REJECT';
  } else if (editedScore >= Math.max(realScore, aiScore, screenshotScore) && editedScore >= 0.3) {
    verdict = 'SUSPICIOUS';
    action = 'FLAG_FOR_REVIEW';
  } else if (screenshotScore >= Math.max(realScore, aiScore, editedScore) && screenshotScore >= 0.3) {
    verdict = 'SUSPICIOUS';
    action = 'FLAG_FOR_REVIEW';
  } else if (realScore < 0.45) {
    verdict = 'SUSPICIOUS';
    action = 'FLAG_FOR_REVIEW';
  }

  return {
    verdict,
    confidence: clamp(confidence, 40, 99),
    reasons: reasons.length ? reasons : ['The model did not return a strong signal.'],
    ela_score: Math.round(clamp((aiScore * 100) + (editedScore * 100), 0, 100)),
    metadata_ok: Boolean(file.type) && Boolean(file.lastModified) && Boolean(file.name),
    ai_generated: aiScore >= 0.34,
    action,
    model: AI_MODEL_ID,
    labelScores: ranked
  };
};

export const analyzeImageForensics = async (file, options = {}) => {
  if (!file) {
    return {
      verdict: 'SUSPICIOUS',
      confidence: 45,
      reasons: ['No image file was provided for verification.'],
      ela_score: 0,
      metadata_ok: false,
      ai_generated: false,
      action: 'FLAG_FOR_REVIEW',
      model: 'none'
    };
  }

  try {
    return await runAiScan(file, options);
  } catch (error) {
    console.error('AI image scan failed, using heuristic fallback:', error);
    const fallback = await fallbackHeuristicScan(file, options);
    return {
      ...fallback,
      reasons: [
        'AI model was unavailable, so a heuristic fallback was used.',
        ...fallback.reasons
      ]
    };
  }
};
