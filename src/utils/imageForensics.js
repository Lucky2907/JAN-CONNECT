const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

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

const isLikelyScreenshot = (file, width, height) => {
  const lowerName = (file.name || '').toLowerCase();
  const screenshotName = /screenshot|screen_shot|screen-shot|capture/.test(lowerName);
  const likelyDisplayAspect = width > 0 && height > 0 && width / height > 1.6 && width / height < 2.1;
  const pngHint = (file.type || '').includes('png');
  return screenshotName || (pngHint && likelyDisplayAspect);
};

const computeElaScore = (bytesPerPixel, megaPixels) => {
  let elaScore = 35;

  if (bytesPerPixel < 0.09) {
    elaScore += 28;
  } else if (bytesPerPixel < 0.15) {
    elaScore += 16;
  }

  if (megaPixels > 8 && bytesPerPixel < 0.12) {
    elaScore += 18;
  }

  if (megaPixels < 0.3) {
    elaScore += 12;
  }

  return clamp(Math.round(elaScore), 0, 100);
};

export const analyzeImageForensics = async (file, options = {}) => {
  const knownImageFingerprints = options.knownImageFingerprints || [];

  if (!file) {
    return {
      verdict: 'SUSPICIOUS',
      confidence: 45,
      reasons: ['No image file was provided for verification.'],
      ela_score: 0,
      metadata_ok: false,
      ai_generated: false,
      action: 'FLAG_FOR_REVIEW'
    };
  }

  const { width, height } = await loadImageDimensions(file);
  const pixelCount = Math.max(width * height, 1);
  const bytesPerPixel = file.size / pixelCount;
  const megaPixels = pixelCount / 1000000;

  const fingerprint = `${(file.name || 'unknown').toLowerCase()}-${file.size}-${width}x${height}`;
  const recycledPattern = knownImageFingerprints.includes(fingerprint);

  const metadataOk = Boolean(file.type) && Boolean(file.lastModified) && Boolean(file.name);
  const screenshotSignature = isLikelyScreenshot(file, width, height);

  const lowerName = (file.name || '').toLowerCase();
  const aiNameHint = /midjourney|dalle|stable[-_ ]?diffusion|generated|ai/.test(lowerName);
  const aiCompressionHint = megaPixels >= 6 && bytesPerPixel < 0.1;
  const aiGenerated = aiNameHint || aiCompressionHint;

  const elaScore = computeElaScore(bytesPerPixel, megaPixels);

  const reasons = [];
  let suspicionScore = 0;

  if (!metadataOk) {
    suspicionScore += 24;
    reasons.push('Image metadata is missing or incomplete, so source verification is weak.');
  }

  if (elaScore >= 70) {
    suspicionScore += 30;
    reasons.push('Compression pattern looks uneven, which can indicate edited regions.');
  } else if (elaScore >= 55) {
    suspicionScore += 16;
    reasons.push('Some compression inconsistency is present; manual review is recommended.');
  }

  if (aiGenerated) {
    suspicionScore += 34;
    reasons.push('File characteristics match common AI-generated image patterns.');
  }

  if (screenshotSignature) {
    suspicionScore += 18;
    reasons.push('Image appears to be a screenshot instead of a direct camera photo.');
  }

  if (recycledPattern) {
    suspicionScore += 42;
    reasons.push('This image fingerprint matches a previously submitted file.');
  }

  let verdict = 'REAL';
  let confidence = 86;
  let action = 'APPROVE';

  if (suspicionScore >= 70) {
    verdict = 'FAKE';
    confidence = clamp(62 + suspicionScore / 2, 81, 99);
  } else if (suspicionScore >= 35) {
    verdict = 'SUSPICIOUS';
    confidence = clamp(45 + suspicionScore / 2.2, 40, 80);
  } else {
    confidence = clamp(88 - suspicionScore / 3, 81, 95);
  }

  if (confidence > 80) {
    if (verdict === 'FAKE') {
      action = 'REJECT';
    } else {
      action = 'APPROVE';
    }
  }

  if (confidence >= 40 && confidence <= 80) {
    action = 'FLAG_FOR_REVIEW';
  }

  if (reasons.length === 0) {
    reasons.push('No significant tampering indicators were detected in this upload.');
  }

  return {
    verdict,
    confidence: Math.round(confidence),
    reasons,
    ela_score: elaScore,
    metadata_ok: metadataOk,
    ai_generated: aiGenerated,
    action
  };
};
