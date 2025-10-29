type PaletteColor = string;

type CoverStyleId = keyof typeof COVER_STYLE_CONFIG;

export interface GenerateCoverOptions {
  title: string;
  subtitle?: string;
  mood?: string;
  keywords?: string[];
  style?: CoverStyleId;
}

interface PaletteConfig {
  label: string;
  description: string;
  previewGradient: [PaletteColor, PaletteColor, PaletteColor];
  gradient: PaletteColor[];
  accent: PaletteColor;
  accentSecondary: PaletteColor;
  text: PaletteColor;
  mutedText: PaletteColor;
  tagBackground: PaletteColor;
  tagText: PaletteColor;
  highlight: PaletteColor;
}

export const COVER_STYLE_CONFIG = {
  sunset: {
    label: "Sunset Glow",
    description: "Warm oranges, coral haze, and luminous highlights.",
    previewGradient: ["#ff8c68", "#ff5d8f", "#6558f5"],
    gradient: ["#ff9966", "#ff5e62", "#944dff"],
    accent: "#ffe9d9",
    accentSecondary: "#ffb4d3",
    text: "#fffdf7",
    mutedText: "rgba(255, 250, 246, 0.82)",
    tagBackground: "rgba(255, 255, 255, 0.18)",
    tagText: "#fff3eb",
    highlight: "rgba(255, 220, 200, 0.45)",
  },
  midnight: {
    label: "Midnight Neon",
    description: "Deep indigos with electric blue and magenta accents.",
    previewGradient: ["#1d2671", "#0f172a", "#a855f7"],
    gradient: ["#1d2671", "#0f172a", "#a855f7"],
    accent: "#1e40af",
    accentSecondary: "#22d3ee",
    text: "#e0f2ff",
    mutedText: "rgba(224, 242, 255, 0.72)",
    tagBackground: "rgba(30, 64, 175, 0.36)",
    tagText: "#e0f2ff",
    highlight: "rgba(56, 189, 248, 0.28)",
  },
  forest: {
    label: "Forest Canopy",
    description: "Emerald gradients with sunlit mist and organic depth.",
    previewGradient: ["#0f766e", "#14532d", "#2dd4bf"],
    gradient: ["#0f766e", "#0f4c3a", "#2dd4bf"],
    accent: "#bbf7d0",
    accentSecondary: "#ecfeff",
    text: "#ecfeff",
    mutedText: "rgba(236, 254, 255, 0.78)",
    tagBackground: "rgba(45, 212, 191, 0.24)",
    tagText: "#ecfeff",
    highlight: "rgba(187, 247, 208, 0.32)",
  },
  aurora: {
    label: "Aurora Wave",
    description: "Cool violets blending into luminous mint and cyan.",
    previewGradient: ["#4f46e5", "#7c3aed", "#2dd4bf"],
    gradient: ["#4338ca", "#7c3aed", "#2dd4bf"],
    accent: "#ede9fe",
    accentSecondary: "#cffafe",
    text: "#f5f3ff",
    mutedText: "rgba(245, 243, 255, 0.78)",
    tagBackground: "rgba(192, 132, 252, 0.24)",
    tagText: "#f5f3ff",
    highlight: "rgba(207, 250, 254, 0.32)",
  },
} satisfies Record<string, PaletteConfig>;

export type CoverStyle = CoverStyleId;

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

function withAlpha(hex: string, alpha: number): string {
  if (hex.startsWith("rgba")) {
    return hex;
  }
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke?: string,
  shadow?: { color: string; blur: number; offsetX?: number; offsetY?: number }
) {
  ctx.save();
  if (shadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offsetX ?? 0;
    ctx.shadowOffsetY = shadow.offsetY ?? 4;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.restore();
}

function addTexture(ctx: CanvasRenderingContext2D, color: string) {
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = color;
  for (let i = 0; i < 2200; i += 1) {
    const size = Math.random() * 2 + 0.4;
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.trim().split(/\s+/);
  if (!words.length) return;
  let line = "";
  let lineCount = 0;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i];
      lineCount += 1;
      y += lineHeight;
      if (lineCount === maxLines - 1) {
        const remaining = words.slice(i + 1).join(" ");
        const finalLine = remaining ? `${line}…` : line;
        ctx.fillText(finalLine, x, y);
        return;
      }
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, y);
  }
}

function drawAuroraWaves(ctx: CanvasRenderingContext2D, palette: PaletteConfig) {
  ctx.save();
  ctx.globalAlpha = 0.38;
  const amplitude = 120;
  const baseY = CANVAS_HEIGHT * 0.65;
  const colors = [palette.accentSecondary, palette.highlight];

  colors.forEach((color, index) => {
    ctx.beginPath();
    ctx.moveTo(0, baseY + index * 30);
    for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
      const angle = (x / CANVAS_WIDTH) * Math.PI * 2;
      const y = baseY + Math.sin(angle * 1.5 + index) * amplitude;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineTo(0, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fillStyle = withAlpha(color, 0.32);
    ctx.fill();
  });
  ctx.restore();
}

function drawRadialGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  const gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
  gradient.addColorStop(0, withAlpha(color, 0.45));
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();
}

export async function generateEventCoverImage(options: GenerateCoverOptions): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Event cover generation requires a browser environment");
  }

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to access canvas context for cover generation");
  }

  const style = options.style ?? "sunset";
  const palette = COVER_STYLE_CONFIG[style];

  const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const stops = palette.gradient.length - 1;
  palette.gradient.forEach((color, index) => {
    gradient.addColorStop(index / Math.max(stops, 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRadialGlow(ctx, CANVAS_WIDTH * 0.8, CANVAS_HEIGHT * 0.25, CANVAS_WIDTH * 0.6, palette.highlight);
  drawRadialGlow(ctx, CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.2, CANVAS_WIDTH * 0.45, palette.accentSecondary);

  if (style === "aurora") {
    drawAuroraWaves(ctx, palette);
  }

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = withAlpha(palette.accentSecondary, 0.4);
  for (let i = 0; i < 4; i += 1) {
    const ellipseX = CANVAS_WIDTH * (0.15 + i * 0.18);
    const ellipseY = CANVAS_HEIGHT * (0.3 + (i % 2) * 0.15);
    const radiusX = CANVAS_WIDTH * (0.18 - i * 0.02);
    const radiusY = CANVAS_HEIGHT * (0.32 - i * 0.03);
    ctx.beginPath();
    ctx.ellipse(ellipseX, ellipseY, radiusX, radiusY, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  drawRoundedRect(
    ctx,
    CANVAS_WIDTH * 0.06,
    CANVAS_HEIGHT * 0.14,
    CANVAS_WIDTH * 0.25,
    CANVAS_HEIGHT * 0.18,
    36,
    withAlpha(palette.tagBackground, 0.9),
    withAlpha(palette.tagBackground, 0.45),
    { color: withAlpha(palette.accentSecondary, 0.35), blur: 28, offsetY: 12 }
  );

  ctx.save();
  ctx.font = "600 22px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = palette.tagText;
  ctx.textBaseline = "top";
  ctx.fillText(options.subtitle ?? "Signature Hosted Experience", CANVAS_WIDTH * 0.085, CANVAS_HEIGHT * 0.18);

  ctx.font = "400 16px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = withAlpha(palette.tagText, 0.72);
  ctx.fillText("Connective Experiences", CANVAS_WIDTH * 0.085, CANVAS_HEIGHT * 0.18 + 34);
  ctx.restore();

  ctx.save();
  ctx.font = "700 72px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = palette.text;
  ctx.textBaseline = "top";
  wrapText(
    ctx,
    options.title,
    CANVAS_WIDTH * 0.085,
    CANVAS_HEIGHT * 0.38,
    CANVAS_WIDTH * 0.6,
    82,
    3
  );

  if (options.mood) {
    ctx.font = "400 28px 'Inter', 'Segoe UI', sans-serif";
    ctx.fillStyle = palette.mutedText;
    wrapText(
      ctx,
      options.mood,
      CANVAS_WIDTH * 0.085,
      CANVAS_HEIGHT * 0.38 + 220,
      CANVAS_WIDTH * 0.55,
      40,
      3
    );
  }

  ctx.restore();

  const keywordPills = options.keywords?.filter(Boolean).slice(0, 3) ?? [];
  if (keywordPills.length) {
    ctx.save();
    ctx.font = "500 24px 'Inter', 'Segoe UI', sans-serif";
    ctx.textBaseline = "middle";
    let pillX = CANVAS_WIDTH * 0.085;
    const pillY = CANVAS_HEIGHT * 0.78;
    const pillHeight = 48;
    keywordPills.forEach((keyword) => {
      const textWidth = ctx.measureText(keyword).width;
      const pillWidth = textWidth + 48;
      drawRoundedRect(
        ctx,
        pillX,
        pillY,
        pillWidth,
        pillHeight,
        24,
        withAlpha(palette.tagBackground, 0.85),
        withAlpha(palette.highlight, 0.65)
      );
      ctx.fillStyle = palette.tagText;
      ctx.fillText(keyword, pillX + 24, pillY + pillHeight / 2);
      pillX += pillWidth + 16;
    });
    ctx.restore();
  }

  drawRoundedRect(
    ctx,
    CANVAS_WIDTH * 0.7,
    CANVAS_HEIGHT * 0.72,
    CANVAS_WIDTH * 0.22,
    CANVAS_HEIGHT * 0.16,
    28,
    withAlpha(palette.tagBackground, 0.75),
    withAlpha(palette.tagBackground, 0.4)
  );

  ctx.save();
  ctx.font = "600 24px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = palette.text;
  ctx.fillText("Hosted with Connective", CANVAS_WIDTH * 0.72, CANVAS_HEIGHT * 0.78);
  ctx.font = "400 18px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = withAlpha(palette.text, 0.78);
  ctx.fillText("Curated guests · Premium hospitality", CANVAS_WIDTH * 0.72, CANVAS_HEIGHT * 0.78 + 32);
  ctx.restore();

  addTexture(ctx, withAlpha(palette.accent, 0.8));

  return canvas.toDataURL("image/png", 0.92);
}

