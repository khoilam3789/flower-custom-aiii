import sharp from "sharp";

const WIDTH = 1024;
const HEIGHT = 1024;

const decodeDataUri = (dataUri) => {
  if (!dataUri || typeof dataUri !== "string") {
    return null;
  }

  const base64 = dataUri.includes(",") ? dataUri.split(",")[1] : dataUri;
  return Buffer.from(base64, "base64");
};

const buildBagSvg = (color, shape) => {
  const bagPath =
    shape === "round"
      ? "M280 240 C280 170, 744 170, 744 240 L704 820 C698 890, 326 890, 320 820 Z"
      : shape === "square"
        ? "M300 220 L724 220 L724 840 L300 840 Z"
        : "M280 240 C280 170, 744 170, 744 240 L760 840 C756 900, 268 900, 264 840 Z";

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#2a2a2a" stop-opacity="0.35" />
        </linearGradient>
      </defs>
      <path d="${bagPath}" fill="url(#bagGrad)" />
      <ellipse cx="512" cy="218" rx="170" ry="70" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="8" />
    </svg>
  `);
};

const normalizeAsset = async (input, size, brightness = 1) => {
  const buf = decodeDataUri(input);

  if (!buf) {
    return null;
  }

  return sharp(buf)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .modulate({ brightness, saturation: 1.1 })
    .sharpen({ sigma: 0.8 })
    .png()
    .toBuffer();
};

export const composeBoothImage = async ({
  flowers = [],
  leaves = [],
  bagColor = "#c58f64",
  bagShape = "classic",
  bagImage = null,
  outputAbsolutePath
}) => {
  const background = {
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: "#f7efe5"
    }
  };

  const base = sharp(background)
    .composite([
      {
        input: Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="55%" cy="15%" r="80%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="100%" stop-color="#d8c9b8" stop-opacity="1"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)
      },
      { input: buildBagSvg(bagColor, bagShape) }
    ]);

  const composites = [];
  const flowerUnitSize = 160;
  const leafUnitSize = 130;

  const bagImageBuffer = await normalizeAsset(bagImage, 520, 0.98);
  if (bagImageBuffer) {
    composites.push({
      input: bagImageBuffer,
      left: 252,
      top: 298,
      blend: "overlay"
    });
  }

  const expandedFlowers = flowers.flatMap((item) =>
    Array.from({ length: Math.max(0, item.quantity || 0) }).map(() => item.image)
  );

  const expandedLeaves = leaves.flatMap((item) =>
    Array.from({ length: Math.max(0, item.quantity || 0) }).map(() => item.image)
  );

  for (let i = 0; i < expandedLeaves.length; i += 1) {
    const asset = await normalizeAsset(expandedLeaves[i], leafUnitSize, 0.95);
    if (!asset) continue;
    composites.push({
      input: asset,
      left: 250 + ((i * 71) % 500),
      top: 260 + Math.floor(i / 7) * 55
    });
  }

  for (let i = 0; i < expandedFlowers.length; i += 1) {
    const asset = await normalizeAsset(expandedFlowers[i], flowerUnitSize, 1.02);
    if (!asset) continue;
    composites.push({
      input: asset,
      left: 220 + ((i * 83) % 560),
      top: 220 + Math.floor(i / 6) * 70
    });
  }

  await base
    .composite(composites)
    .composite([
      {
        input: Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg"><ellipse cx="512" cy="900" rx="280" ry="60" fill="#000" fill-opacity="0.18"/></svg>`)
      }
    ])
    .png({ quality: 95 })
    .toFile(outputAbsolutePath);
};
