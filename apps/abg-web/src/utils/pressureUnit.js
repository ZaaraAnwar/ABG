export function kpaToMmhg(value) {
  return value * 7.5;
}

export function mmhgToKpa(value) {
  return value / 7.5;
}

export function getCO2Factor(unit) {
  return unit === "kPa" ? 0.23 : 0.03;
}

export function getPaco2Range(unit) {
  return unit === "kPa"
    ? { min: 0, max: 21 }
    : { min: 0, max: 160 };
}

export function getNormalPaco2(unit) {
  return unit === "kPa" ? 5.3 : 40.0;
}