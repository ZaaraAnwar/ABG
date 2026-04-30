import {
  P50_NORMAL,
  P50_LEFT,
  P50_RIGHT,
  HILL_N,
  PAD_L,
  PAD_T,
  CW,
  CH,
} from "./constants";

export const hillSat = (po2, p50 = P50_NORMAL) =>
  po2 <= 0
    ? 0
    : (Math.pow(po2, HILL_N) /
        (Math.pow(p50, HILL_N) + Math.pow(po2, HILL_N))) *
      100;

export const getP50 = (shiftDir) =>
  shiftDir === "left" ? P50_LEFT : shiftDir === "right" ? P50_RIGHT : P50_NORMAL;

export const po2ToX = (po2) => PAD_L + (po2 / 100) * CW;

export const satToY = (sat) => PAD_T + (1 - sat / 100) * CH;

export const xToPo2 = (cx) =>
  Math.max(0, Math.min(100, ((cx - PAD_L) / CW) * 100));