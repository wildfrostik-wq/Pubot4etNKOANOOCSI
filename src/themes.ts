import React from "react";

/**
 * Тема оформления самого отчёта (PDF-страниц).
 * Все цвета страниц прокидываются через CSS-переменные --rp-*.
 */
export interface ReportTheme {
  id: string;
  name: string;
  tagline: string;
  /** градиент тёмных страниц (обложка, контакты) */
  dark1: string;
  dark2: string;
  dark3: string;
  /** яркий акцент на тёмном */
  accent: string;
  /** средний акцент: линейки, плашки, диаграммы */
  accentMid: string;
  /** насыщенный акцент для текста на светлой странице */
  accentDeep: string;
  /** фон светлых страниц */
  paper: string;
  /** основной текст на светлом */
  ink: string;
  /** светлый текст на тёмном */
  onDark: string;
  /** зебра таблиц */
  row: string;
  /** заглушка вместо фото (CORS-фолбэк) */
  strip: string;
  /** трек кольцевой диаграммы */
  track: string;
  /** палитра диаграммы расходов */
  donut: string[];
}

export const THEMES: ReportTheme[] = [
  {
    id: "pine",
    name: "Хвоя и золото",
    tagline: "Фирменный стиль платформы",
    dark1: "#06231e",
    dark2: "#0c3b33",
    dark3: "#0d4038",
    accent: "#eebc62",
    accentMid: "#dfa63e",
    accentDeep: "#b9812a",
    paper: "#f7f4ea",
    ink: "#16352e",
    onDark: "#f2f0e6",
    row: "#efe8d6",
    strip: "#e3dcc8",
    track: "#e8e2d0",
    donut: ["#c48a2b", "#0c3b33", "#4f8f80", "#dfa63e", "#8fbcae", "#125147", "#c3d9d0"],
  },
  {
    id: "navy",
    name: "Полночь и медь",
    tagline: "Строгий деловой, глубокий синий",
    dark1: "#0a1a2e",
    dark2: "#16324f",
    dark3: "#1a3a5c",
    accent: "#e2a566",
    accentMid: "#cf8f4e",
    accentDeep: "#a5622a",
    paper: "#f5f4ef",
    ink: "#1c2b3e",
    onDark: "#eef1f6",
    row: "#e8e9e2",
    strip: "#dde0d9",
    track: "#e4e5dd",
    donut: ["#a5622a", "#16324f", "#5b7fa6", "#d9b98a", "#8fa9c6", "#22456e", "#c6d3e2"],
  },
  {
    id: "wine",
    name: "Бордо и шампань",
    tagline: "Торжественный, для юбилейных отчётов",
    dark1: "#2a0d16",
    dark2: "#55172a",
    dark3: "#6b1e35",
    accent: "#e6c98f",
    accentMid: "#d4ab62",
    accentDeep: "#9c6d2a",
    paper: "#f7f3ee",
    ink: "#3c1f28",
    onDark: "#f6f0e7",
    row: "#f0e6dc",
    strip: "#e7dcd1",
    track: "#eae0d4",
    donut: ["#9c6d2a", "#55172a", "#a44a5e", "#d4ab62", "#c98a97", "#7d2440", "#e0cbb9"],
  },
  {
    id: "graphite",
    name: "Графит и янтарь",
    tagline: "Сдержанный монохром с тёплым акцентом",
    dark1: "#15171c",
    dark2: "#2a2f38",
    dark3: "#343a45",
    accent: "#e0a83e",
    accentMid: "#cf9633",
    accentDeep: "#9d6f1c",
    paper: "#f4f4f1",
    ink: "#23262d",
    onDark: "#edefec",
    row: "#e9e9e3",
    strip: "#dededa",
    track: "#e3e3dc",
    donut: ["#9d6f1c", "#2a2f38", "#767d89", "#cf9633", "#a6adb8", "#3d4450", "#c9cdd4"],
  },
  {
    id: "ivory",
    name: "Слоновая кость",
    tagline: "Светлый деловой: изумруд на светлой бумаге",
    dark1: "#07352b",
    dark2: "#0d4d3e",
    dark3: "#12614e",
    accent: "#e3bd63",
    accentMid: "#c9a24a",
    accentDeep: "#0e6b54",
    paper: "#f7f5ee",
    ink: "#1d3a31",
    onDark: "#f1efe3",
    row: "#edeadd",
    strip: "#e2dfd0",
    track: "#e6e3d5",
    donut: ["#0e6b54", "#0d4d3e", "#c9a24a", "#5f8f7d", "#a9c4b4", "#17594a", "#d8d3bd"],
  },
];

export const DEFAULT_THEME_ID = "pine";

export function getTheme(id: string): ReportTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function themeVars(t: ReportTheme): React.CSSProperties {
  return {
    "--rp-dark1": t.dark1,
    "--rp-dark2": t.dark2,
    "--rp-dark3": t.dark3,
    "--rp-accent": t.accent,
    "--rp-accent-mid": t.accentMid,
    "--rp-accent-deep": t.accentDeep,
    "--rp-paper": t.paper,
    "--rp-ink": t.ink,
    "--rp-on-dark": t.onDark,
    "--rp-row": t.row,
    "--rp-strip": t.strip,
    "--rp-track": t.track,
  } as React.CSSProperties;
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16
  );
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
