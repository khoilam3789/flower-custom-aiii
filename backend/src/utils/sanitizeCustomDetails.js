const isDataImage = (value) => typeof value === "string" && value.startsWith("data:image/");

const sanitizeNode = (value, counters) => {
  if (isDataImage(value)) {
    counters.cleaned += 1;
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeNode(entry, counters));
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [key, childValue] of Object.entries(value)) {
      next[key] = sanitizeNode(childValue, counters);
    }
    return next;
  }

  return value;
};

export const sanitizeCustomDetailsWithStats = (details) => {
  if (!details || typeof details !== "object") {
    return { sanitized: details, cleanedFields: 0 };
  }

  const counters = { cleaned: 0 };
  const sanitized = sanitizeNode(details, counters);
  return { sanitized, cleanedFields: counters.cleaned };
};

export const sanitizeCustomDetails = (details) => sanitizeCustomDetailsWithStats(details).sanitized;
