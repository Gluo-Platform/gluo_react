type RGB = [number, number, number];

function saturation(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) {
    return 0;
  }
  return (max - min) / max;
}

function luminance(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function punch([r, g, b]: RGB): RGB {
  const max = Math.max(r, g, b);
  return [
    Math.round(r + (max - r) * 0.2),
    Math.round(g + (max - g) * 0.2),
    Math.round(b + (max - b) * 0.2),
  ];
}

function toCss([r, g, b]: RGB, alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hueKey(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) {
    return 0;
  }

  let hue = 0;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return Math.round((((hue * 60 + 360) % 360) / 30) % 12);
}

export type AvatarPalette = {
  one: string;
  two: string;
  three: string;
  washOne: string;
  washTwo: string;
  washThree: string;
};

export async function extractAvatarPalette(
  src: string,
): Promise<AvatarPalette | null> {
  const response = await fetch(
    `/api/auth/avatar?src=${encodeURIComponent(src)}`,
  );
  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    return null;
  }

  context.drawImage(bitmap, 0, 0, size, size);
  bitmap.close();

  const { data } = context.getImageData(0, 0, size, size);
  const buckets = new Map<
    number,
    { color: RGB; score: number; count: number }
  >();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 180) {
      continue;
    }

    const sat = saturation(r, g, b);
    const lum = luminance(r, g, b);
    if (sat < 0.12 || lum < 0.08 || lum > 0.92) {
      continue;
    }

    const key = hueKey(r, g, b);
    const score = (0.45 + sat) * (1 - Math.abs(lum - 0.52));
    const current = buckets.get(key);
    if (!current) {
      buckets.set(key, { color: [r, g, b], score, count: 1 });
      continue;
    }

    current.score += score;
    current.count += 1;
    current.color = [
      Math.round((current.color[0] * (current.count - 1) + r) / current.count),
      Math.round((current.color[1] * (current.count - 1) + g) / current.count),
      Math.round((current.color[2] * (current.count - 1) + b) / current.count),
    ];
  }

  const ranked = [...buckets.values()]
    .sort((left, right) => right.score - left.score)
    .map((bucket) => punch(bucket.color));

  if (ranked.length === 0) {
    return null;
  }

  const one = ranked[0];
  const two = ranked[1] ?? one;
  const three = ranked[2] ?? ranked[0];

  return {
    one: toCss(one, 0.9),
    two: toCss(two, 0.75),
    three: toCss(three, 0.6),
    washOne: toCss(one, 0.48),
    washTwo: toCss(two, 0.32),
    washThree: toCss(three, 0.2),
  };
}
