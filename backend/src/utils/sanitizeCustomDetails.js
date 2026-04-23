const LEGACY_IMAGE_KEYS = new Set(["aiImage", "previewImage", "imageBase64", "base64Image"]);

const isDataImage = (value) => typeof value === "string" && value.startsWith("data:image/");

const isGenericDataBase64 = (value) =>
  typeof value === "string" && value.startsWith("data:") && value.includes(";base64,");

const isLikelyRawBase64Blob = (value) => {
  if (typeof value !== "string") return false;

  const compact = value.replace(/\s+/g, "");
  if (compact.length < 1500) return false;

  // Typical JPEG/PNG/WebP base64 signatures.
  if (
    compact.startsWith("/9j/") ||
    compact.startsWith("iVBORw0KGgo") ||
    compact.startsWith("UklGR") ||
    compact.startsWith("R0lGOD")
  ) {
    return true;
  }

  // Generic base64 payload check.
  return /^[A-Za-z0-9+/=]+$/.test(compact);
};

const createReasonStats = () => ({
  dataImage: 0,
  genericDataBase64: 0,
  rawBase64Blob: 0,
  legacyImageKeyLargeValue: 0
});

const sanitizeNode = (value, counters, parentKey = "") => {
  if (isDataImage(value)) {
    counters.cleaned += 1;
    counters.reasons.dataImage += 1;
    return "";
  }

  if (isGenericDataBase64(value)) {
    counters.cleaned += 1;
    counters.reasons.genericDataBase64 += 1;
    return "";
  }

  if (isLikelyRawBase64Blob(value)) {
    counters.cleaned += 1;
    counters.reasons.rawBase64Blob += 1;
    return "";
  }

  if (
    typeof value === "string" &&
    LEGACY_IMAGE_KEYS.has(parentKey) &&
    value.length > 500
  ) {
    counters.cleaned += 1;
    counters.reasons.legacyImageKeyLargeValue += 1;
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeNode(entry, counters, parentKey));
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [key, childValue] of Object.entries(value)) {
      next[key] = sanitizeNode(childValue, counters, key);
    }
    return next;
  }

  return value;
};

export const sanitizeCustomDetailsWithStats = (details) => {
  if (!details || typeof details !== "object") {
    return { sanitized: details, cleanedFields: 0, reasonStats: createReasonStats() };
  }

  const counters = { cleaned: 0, reasons: createReasonStats() };
  const sanitized = sanitizeNode(details, counters);
  return { sanitized, cleanedFields: counters.cleaned, reasonStats: counters.reasons };
};

export const sanitizeCustomDetails = (details) => sanitizeCustomDetailsWithStats(details).sanitized;
