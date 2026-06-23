export const PH2O = 47;

export function HILL(p) {
  return Math.pow(Math.max(p, 0.1), 2.7) / (Math.pow(26.8, 2.7) + Math.pow(Math.max(p, 0.1), 2.7)) * 100;
}

export function ISAP(ft) {
  const h = ft * 0.3048;
  return ft <= 36089 
    ? 760 * Math.pow(1 - 6.5e-3 * h / 288.15, 5.2561) 
    : ISAP(36089) * Math.exp(-9.80665 * (h - 11000) / (287.058 * 216.65));
}

export function ISAT(ft) {
  return ft <= 36089 ? 15 - 6.5 * ft * 0.3048 / 1e3 : -56.5;
}
