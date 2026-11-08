import { randomInt } from "node:crypto";
import { createToken, readToken, sign, safeEqual } from "./signing";

// 3×5 pixel glyphs, drawn as SVG rectangles so the question never appears as text.
const glyphs: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "011", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "010", "010", "010"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  "+": ["000", "010", "111", "010", "000"],
  "=": ["000", "111", "000", "111", "000"],
  "?": ["111", "001", "011", "000", "010"],
};

const palette = ["#f2b8de", "#a5f3fc", "#c4b5fd", "#bbf7d0", "#fde68a"];
const CELL = 6;
const TTL = 10 * 60 * 1000;

function renderSvg(text: string) {
  const glyphWidth = 4 * CELL;
  const width = text.length * glyphWidth + CELL * 4;
  const height = 5 * CELL + CELL * 6;
  const rects: string[] = [];

  // Background noise pixels.
  for (let i = 0; i < 70; i++) {
    const x = randomInt(0, Math.floor(width / 3)) * 3;
    const y = randomInt(0, Math.floor(height / 3)) * 3;
    rects.push(`<rect x="${x}" y="${y}" width="3" height="3" fill="#ffffff" opacity="0.${randomInt(6, 20)}"/>`);
  }

  [...text].forEach((char, index) => {
    const color = palette[randomInt(0, palette.length)];
    const baseX = CELL * 2 + index * glyphWidth + randomInt(-2, 3);
    const baseY = CELL * 3 + randomInt(-5, 6);
    glyphs[char].forEach((row, y) =>
      [...row].forEach((on, x) => {
        if (on === "1") rects.push(`<rect x="${baseX + x * CELL}" y="${baseY + y * CELL}" width="${CELL}" height="${CELL}" fill="${color}"/>`);
      }),
    );
  });

  // A couple of strike-through lines.
  const lines = Array.from({ length: 2 }, () =>
    `<line x1="0" y1="${randomInt(8, height - 8)}" x2="${width}" y2="${randomInt(8, height - 8)}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>`,
  ).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">${rects.join("")}${lines}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function createChallenge() {
  const a = randomInt(10, 90);
  const b = randomInt(10, 90);
  const nonce = randomInt(0, 2 ** 32).toString(36);
  const exp = Date.now() + TTL;
  const token = createToken({ exp, nonce, answer: sign(`${a + b}:${nonce}`) });
  return { image: renderSvg(`${a}+${b}=?`), token };
}

// Nonces of challenges already answered. Each challenge gets one guess, right or
// wrong, so it can be neither brute-forced nor replayed (a wrong answer gets a new
// challenge). Per server instance, like the rate limiter; entries drop once expired.
const usedNonces = new Map<string, number>();

export function verifyChallenge(token: string | undefined, answer: string) {
  const data = readToken<{ exp: number; nonce: string; answer: string }>(token);
  if (!data || usedNonces.has(data.nonce)) return false;
  const now = Date.now();
  for (const [nonce, exp] of usedNonces) if (exp < now) usedNonces.delete(nonce);
  usedNonces.set(data.nonce, data.exp);
  const cleaned = answer.trim();
  if (!/^\d{1,3}$/.test(cleaned)) return false;
  return safeEqual(data.answer, sign(`${Number(cleaned)}:${data.nonce}`));
}
