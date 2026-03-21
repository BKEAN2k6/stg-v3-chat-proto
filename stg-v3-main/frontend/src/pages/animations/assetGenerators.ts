import {type LanguageCode} from '@client/ApiTypes';
import UPNG from 'upng-js';

async function ensureLuckiestGuy() {
  const font = new FontFace(
    'LuckiestGuy-Regular',
    'url(/fonts/LuckiestGuy-Regular.ttf)',
  );
  await font.load();
  document.fonts.add(font);
  await (document as any).fonts.ready;
}

function quantizePng(buffer: ArrayBuffer): ArrayBuffer {
  const img = UPNG.decode(buffer);
  const rgbaFrames = UPNG.toRGBA8(img);
  return UPNG.encode(rgbaFrames, img.width, img.height, 256);
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (para === '') {
      lines.push('');
      continue;
    }

    const words = para.split(' ');
    let currentLine = words.shift() ?? '';
    for (const word of words) {
      const testLine = `${currentLine} ${word}`;
      if (context.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    lines.push(currentLine);
  }

  return lines;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCodePoint(bytes[i]);
  }

  return globalThis.btoa(binary);
}

async function createDataUrl(canvas: HTMLCanvasElement) {
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas toBlob failed'));
      }
    }, 'image/png');
  });
  const raw = await blob.arrayBuffer();
  const compressed = quantizePng(raw);
  const b64 = arrayBufferToBase64(compressed);
  return `data:image/png;base64,${b64}`;
}

// eslint-disable-next-line max-params
function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + w - r, y);
  context.arcTo(x + w, y, x + w, y + r, r);
  context.lineTo(x + w, y + h - r);
  context.arcTo(x + w, y + h, x + w - r, y + h, r);
  context.lineTo(x + r, y + h);
  context.arcTo(x, y + h, x, y + h - r, r);
  context.lineTo(x, y + r);
  context.arcTo(x, y, x + r, y, r);
  context.closePath();
}

// eslint-disable-next-line max-params
function drawInkCenteredText(
  context: CanvasRenderingContext2D,
  lines: string[],
  centerX: number,
  y: number,
  height: number,
  lineHeight: number,
) {
  const metrics = lines.map((line) => context.measureText(line));
  const heights = metrics.map(
    (m) => m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
  );
  const gap = lineHeight - (heights[0] || lineHeight);
  const inkHeight = heights.reduce((sum, h) => sum + h, 0);
  const gapsHeight = gap * (lines.length - 1);
  const blockHeight = inkHeight + gapsHeight;
  let cursorY = y + (height - blockHeight) / 2;
  context.textBaseline = 'alphabetic';

  for (const [i, line] of lines.entries()) {
    const {actualBoundingBoxAscent, actualBoundingBoxDescent} = metrics[i];
    cursorY += actualBoundingBoxAscent;
    context.strokeText(line, centerX, cursorY);
    context.fillText(line, centerX, cursorY);
    cursorY += actualBoundingBoxDescent + gap;
  }
}

export async function generateIntroCard(
  text: string,
  fontSize: number,
  w: number,
  h: number,
): Promise<string> {
  await ensureLuckiestGuy();

  const border = 20;
  const radius = 50;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d')!;
  const x = border / 2;
  const y = border / 2;
  const areaW = w - border;
  const areaH = h - border;

  context.save();
  roundedRect(context, x, y, areaW, areaH, radius);
  context.clip();
  context.fillStyle = '#7754c9';
  context.fillRect(0, 0, w, h);

  context.shadowColor = 'rgba(0,0,0,0.5)';
  context.shadowBlur = 6;
  context.shadowOffsetX = 4;
  context.shadowOffsetY = 4;
  context.fillStyle = '#fff';
  context.strokeStyle = '#000';
  context.lineWidth = 6;
  context.font = `${fontSize}px LuckiestGuy-Regular`;
  context.textAlign = 'center';

  const maxW = w * 0.8;
  const lineH = fontSize * 1.3;
  const lines = wrapText(context, text, maxW);

  drawInkCenteredText(context, lines, w / 2, 0, h, lineH);

  context.restore();

  context.save();
  roundedRect(context, x, y, areaW, areaH, radius);
  context.clip();
  context.shadowColor = 'rgba(0,0,0,0.9)';
  context.shadowBlur = 10;
  context.lineWidth = border;
  context.strokeStyle = '#fff';
  roundedRect(context, x, y, areaW, areaH, radius);
  context.stroke();
  context.restore();

  context.lineWidth = border;
  context.strokeStyle = '#fff';
  roundedRect(context, x, y, areaW, areaH, radius);
  context.stroke();

  return createDataUrl(canvas);
}

export async function generateTaskCard(
  text: string,
  fontSize: number,
  w: number,
  h: number,
): Promise<string> {
  await ensureLuckiestGuy();

  const bt = 20;
  const bl = 20;
  const bb = 20;
  const br = 40;
  const radius = 50;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d')!;
  context.translate(0.5, 0.5);

  context.fillStyle = '#000';
  roundedRect(context, 0, 0, w, h, radius);
  context.fill();

  const ix = bl;
  const iy = bt;
  const iw = w - bl - br;
  const ih = h - bt - bb;
  const ir = radius - bt;
  context.fillStyle = '#fff';
  roundedRect(context, ix, iy, iw, ih, ir);
  context.fill();

  context.shadowColor = 'rgba(0,0,0,0.5)';
  context.shadowBlur = 6;
  context.shadowOffsetX = 4;
  context.shadowOffsetY = 4;
  context.fillStyle = '#fff';
  context.strokeStyle = '#000';
  context.lineWidth = 6;
  context.font = `${fontSize}px LuckiestGuy-Regular`;
  context.textAlign = 'center';

  const lineH = fontSize * 1.3;
  const lines = wrapText(context, text, w * 0.8);

  drawInkCenteredText(context, lines, ix + iw / 2, iy, ih, lineH);

  return createDataUrl(canvas);
}

// eslint-disable-next-line max-params
export async function generateChallengeCard(
  text: string,
  fontSize: number,
  w: number,
  h: number,
  background: {r: number; g: number; b: number; a: number},
): Promise<string> {
  console.log(w);
  await ensureLuckiestGuy();

  const border = 8;
  const radius = 16;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d')!;
  context.translate(0.5, 0.5);

  // Outer border (black)
  context.fillStyle = '#000';
  roundedRect(context, 0, 0, w, h, radius);
  context.fill();

  // Convert RGBA object into CSS rgba() string
  const {r, g, b, a} = background;
  const bgColor = `rgba(${r}, ${g}, ${b}, ${a})`;

  // Inner rectangle
  const ix = border;
  const iy = border;
  const iw = w - border * 2;
  const ih = h - border * 2;
  const ir = Math.max(radius - border, 0);

  context.fillStyle = bgColor;
  roundedRect(context, ix, iy, iw, ih, ir);
  context.fill();

  // Text styling
  context.fillStyle = '#fff';
  context.strokeStyle = '#000';
  context.lineWidth = 4;
  context.font = `${fontSize}px LuckiestGuy-Regular`;
  context.textAlign = 'center';

  // Text wrapping & drawing
  const lineH = fontSize * 1.3;
  const lines = wrapText(context, text, w * 0.8);

  drawInkCenteredText(context, lines, ix + iw / 2, iy, ih, lineH);

  return createDataUrl(canvas);
}

export async function generateTextBanner(
  text: string,
  fontSize: number,
  w: number,
  h: number,
): Promise<string> {
  await ensureLuckiestGuy();

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d')!;

  context.shadowColor = 'rgba(0,0,0,0.5)';
  context.shadowBlur = 6;
  context.shadowOffsetX = 4;
  context.shadowOffsetY = 4;
  context.fillStyle = '#fff';
  context.strokeStyle = '#000';
  context.lineWidth = 6;
  context.font = `${fontSize}px LuckiestGuy-Regular`;
  context.textAlign = 'center';

  const lineH = fontSize * 1.3;
  const lines = wrapText(context, text, w * 0.8);

  drawInkCenteredText(context, lines, w / 2, 0, h, lineH);

  return createDataUrl(canvas);
}

export function generateColor(
  {r, g, b, a}: {r: number; g: number; b: number; a: number},
  width: number,
  height: number,
): string {
  const alpha = Math.round(a * 255);
  const pixelCount = width * height;
  const rgba = new Uint8Array(pixelCount * 4);
  for (let i = 0; i < pixelCount; i++) {
    const off = i * 4;
    rgba[off] = r;
    rgba[off + 1] = g;
    rgba[off + 2] = b;
    rgba[off + 3] = alpha;
  }

  const pngBuffer = UPNG.encode([rgba.buffer], width, height, 0);
  return `data:image/png;base64,${arrayBufferToBase64(pngBuffer)}`;
}

export async function generateButton(
  text: string,
  fontSize: number,
  w: number,
  h: number,
): Promise<string> {
  await ensureLuckiestGuy();

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d')!;

  const radius = h / 2;
  context.fillStyle = '#fff';
  roundedRect(context, 0, 0, w, h, radius);
  context.fill();

  context.fillStyle = '#7754c9';
  context.strokeStyle = '#7754c9';
  context.lineWidth = 0;
  context.font = `${fontSize}px LuckiestGuy-Regular`;
  context.textAlign = 'center';

  const lineH = fontSize * 1.3;
  drawInkCenteredText(context, [text], w / 2, 0, h, lineH);

  return createDataUrl(canvas);
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.addEventListener('error', () => {
      reject(new Error('Failed to read blob'));
    });
    reader.readAsDataURL(blob);
  });
}

export async function generateVoiceOver(
  text: string,
  language: LanguageCode,
): Promise<string | undefined> {
  const payload = {text, language};
  const apiResp = await fetch(`/api/v1/animation-assets/voiceover`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  if (!apiResp.ok) {
    throw new Error(
      `Failed to generate voice-over: ${apiResp.status} ${apiResp.statusText}`,
    );
  }

  const blob = await apiResp.blob();
  return blobToDataUrl(blob);
}
