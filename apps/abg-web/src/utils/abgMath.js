/**
 * Core ABG Mathematics and Interpretation Logic
 */

export const SVG_W = 750;
export const SVG_H = 600;
export const PH_MIN = 6.8;
export const PH_MAX = 7.85;
export const PCO2_MIN = 0;
export const PCO2_MAX = 160;

export function calculatePh(hco3, pco2) {
  if (pco2 <= 0) pco2 = 0.001; // prevent log(0)
  return 6.1 + Math.log10(hco3 / (0.03 * pco2));
}

export function hco3FromPhPco2(ph, pco2) {
  if (pco2 === 0) return 0;
  return 0.0307 * pco2 * Math.pow(10, ph - 6.1);
}

export function mapX(ph) {
  return ((ph - PH_MIN) / (PH_MAX - PH_MIN)) * SVG_W;
}

export function mapY(pco2) {
  return SVG_H - ((pco2 - PCO2_MIN) / (PCO2_MAX - PCO2_MIN)) * SVG_H;
}

// export function interpret(ph, paco2) {
//   const hco3     = hco3FromPhPco2(ph, paco2);
//   const acidemia  = ph < 7.35;
//   const alkalemia = ph > 7.45;
//   const highPCO2  = paco2 > 45;
//   const lowPCO2   = paco2 < 35;
//   const highHCO3  = hco3 > 26;
//   const lowHCO3   = hco3 < 22;

//   if (!acidemia && !alkalemia)             return "Normal";
//   if (acidemia  && highPCO2 && lowHCO3)   return "Metabolic Acidosis and\nRespiratory Acidosis";
//   if (acidemia  && highPCO2)              return "Respiratory Acidosis";
//   if (acidemia  && lowHCO3)              return "Metabolic Acidosis";
//   if (alkalemia && lowPCO2  && highHCO3)  return "Metabolic Alkalosis and\nRespiratory Alkalosis";
//   if (alkalemia && lowPCO2)              return "Respiratory Alkalosis";
//   if (alkalemia && highHCO3)             return "Metabolic Alkalosis";
//   return "Mixed Disorder";
// }

export function interpret(ph, paco2, hco3Input = null) {
  const hco3 = hco3Input ?? hco3FromPhPco2(ph, paco2);

  const acidemia = ph < 7.35;
  const alkalemia = ph > 7.45;
  const normalPh = !acidemia && !alkalemia;

  const lowCO2 = paco2 < 35;
  const highCO2 = paco2 > 45;
  const normalCO2 = !lowCO2 && !highCO2;

  const lowHCO3 = hco3 < 22;
  const highHCO3 = hco3 > 26;
  const normalHCO3 = !lowHCO3 && !highHCO3;

  if (normalPh) {
    if (hco3 <= 22 && paco2 <= 40) {
      return "Compensated Metabolic Acidosis";
    }

    if (hco3 >= 26 && paco2 >= 40) {
      return "Compensated Metabolic Alkalosis";
    }

    if (paco2 > 40 && normalHCO3) {
      return "Compensated Respiratory Acidosis";
    }

    if (paco2 < 40 && normalHCO3) {
      return "Compensated Respiratory Alkalosis";
    }

    if (normalCO2 && normalHCO3) {
      return "Normal";
    }

    if (lowCO2) {
      return "Compensated Respiratory Alkalosis";
    }

    if (highCO2 && highHCO3) {
      return "Metabolic Alkalosis and\nRespiratory Acidosis";
    }

    if (highCO2 && normalHCO3) {
      return "Compensated Respiratory Acidosis";
    }

    return "Mixed Disorder";
  }
  if (acidemia) {
    if (highCO2 && highHCO3) {
      const expectedAcuteHCO3 = 24 + ((paco2 - 40) / 10) * 1;

      if (hco3 < expectedAcuteHCO3 - 1) {
        return "Respiratory Acidosis and\nMetabolic Acidosis";
      }

      return "Acute Respiratory Acidosis";
    }

    if (highCO2 && lowHCO3) {
      return "Respiratory Acidosis and\nMetabolic Acidosis";
    }

    if (highCO2 && normalHCO3) {
      const expectedAcuteHCO3 = 24 + ((paco2 - 40) / 10) * 1;

      if (hco3 < expectedAcuteHCO3) {
        return "Respiratory Acidosis and\nMetabolic Acidosis";
      }

      return "Respiratory Acidosis";
    }

    if (normalCO2) {
      return "Metabolic Acidosis";
    }

    if (lowCO2 && lowHCO3) {
      const expectedPaco2 = 1.5 * hco3 + 8;

      if (paco2 < expectedPaco2 - 2) {
        return "Metabolic Acidosis and\nRespiratory Alkalosis";
      }

      return "Metabolic Acidosis";
    }

    if (lowCO2) {
      return "Partially Compensated Metabolic Acidosis";
    }

    return "Mixed Disorder";
  }

  if (alkalemia) {
    if (lowCO2 && lowHCO3) {
      const expectedChronicHCO3 = 24 - ((40 - paco2) / 10) * 5;

      if (hco3 <= expectedChronicHCO3) {
        return "Respiratory Alkalosis and\nMetabolic Acidosis";
      }

      return "Partially Compensated Respiratory Alkalosis";
    }

    if (highHCO3) {
      const expectedPaco2 = 0.7 * hco3 + 20;

      if (paco2 < expectedPaco2 - 3) {
        return "Metabolic Alkalosis and\nRespiratory Alkalosis";
      }

      if (paco2 > expectedPaco2 + 5) {
        return "Metabolic Alkalosis and\nRespiratory Acidosis";
      }

      return "Metabolic Alkalosis";
    }

    if (lowCO2) {
      return "Respiratory Alkalosis";
    }

    if (normalCO2) {
      return "Metabolic Alkalosis";
    }

    if (highCO2) {
      return "Metabolic Alkalosis and\nRespiratory Acidosis";
    }

    return "Mixed Disorder";
  }

  return "Mixed Disorder";
}
export function buildRegions() {
  const regions = [];
  const addPts = (pts, color) => regions.push({ color, points: pts });

  // Normal Box (Blue)
  let normal = [];
  for (let hco3 = 22; hco3 <= 26; hco3 += 0.5) {
    for (let pco2 = 35; pco2 <= 45; pco2 += 1.5) {
      if (Math.abs(hco3 - 24) < 2.5 && Math.abs(pco2 - 40) < 5.5) {
        normal.push({ ph: calculatePh(hco3, pco2), pco2 });
      }
    }
  }
  addPts(normal, "#81afd4");

  // Metabolic Acidosis
  let ma = [];
  for (let hco3 = 1; hco3 <= 21; hco3 += 0.4) {
    const centerPco2 = 1.5 * hco3 + 8;
    for (let d = -2; d <= 2; d += 0.8) {
      const p = centerPco2 + d;
      if (p > 5) ma.push({ ph: calculatePh(hco3, p), pco2: p });
    }
  }
  addPts(ma, "#d6a6a1");

  // Metabolic Alkalosis
  let mAlk = [];
  for (let hco3 = 26; hco3 <= 200; hco3 += 0.8) {
    const centerPco2 = 0.7 * hco3 + 21;
    for (let d = -2; d <= 2; d += 0.8) {
      mAlk.push({
        ph: calculatePh(hco3, centerPco2 + d),
        pco2: centerPco2 + d,
      });
    }
  }
  addPts(mAlk, "#bad098");

  // Acute Respiratory Acidosis
  let ara = [];
  for (let pco2 = 46; pco2 <= 160; pco2 += 1.5) {
    const centerHco3 = 24 + 0.1 * (pco2 - 40);
    for (let d = -2; d <= 2; d += 0.8) {
      ara.push({ ph: calculatePh(centerHco3 + d, pco2), pco2 });
    }
  }
  addPts(ara, "#aba0c5");

  // Chronic Respiratory Acidosis
  let cra = [];
  for (let pco2 = 46; pco2 <= 160; pco2 += 1.5) {
    const centerHco3 = 24 + 0.4 * (pco2 - 40);
    for (let d = -2; d <= 2; d += 0.8) {
      cra.push({ ph: calculatePh(centerHco3 + d, pco2), pco2 });
    }
  }
  addPts(cra, "#88bacd");

  // Acute Respiratory Alkalosis
  let aralk = [];
  for (let pco2 = 5; pco2 <= 34; pco2 += 0.8) {
    const centerHco3 = 24 - 0.2 * (40 - pco2);
    for (let d = -2; d <= 2; d += 0.8) {
      aralk.push({ ph: calculatePh(centerHco3 + d, pco2), pco2 });
    }
  }
  addPts(aralk, "#f2ccaa");

  // Chronic Respiratory Alkalosis
  let cralk = [];
  for (let pco2 = 5; pco2 <= 34; pco2 += 0.8) {
    const centerHco3 = 24 - 0.5 * (40 - pco2);
    for (let d = -2; d <= 2; d += 0.8) {
      cralk.push({ ph: calculatePh(centerHco3 + d, pco2), pco2 });
    }
  }
  addPts(cralk, "#9aaeb9");

  return regions;
}

export function calculateAcuteChronic(paco2) {
  const isAcidosis = paco2 > 40;
  const isAlkalosis = paco2 < 40;

  const deltaCO2 = Math.abs(paco2 - 40);
  const units = deltaCO2 / 10;

  // Acidosis: +1 for acute, +4 for chronic per 10 mmHg
  const acuteAcidosisHCO3 = 24 + 1 * units;
  const chronicAcidosisHCO3 = 24 + 4 * units;

  // Alkalosis: -2 for acute, -5 for chronic per 10 mmHg
  const acuteAlkalosisHCO3 = 24 - 2 * units;
  const chronicAlkalosisHCO3 = 24 - 5 * units;

  return {
    isAcidosis,
    isAlkalosis,
    acuteAcidosisHCO3,
    chronicAcidosisHCO3,
    acuteAlkalosisHCO3,
    chronicAlkalosisHCO3,
  };
}

export function calcPco2(hco3, ph) {
  return hco3 / (0.0307 * Math.pow(10, ph - 6.1));
}

export function calcHco3(ph, pco2) {
  if (pco2 === 0) return 0;
  return 0.0307 * pco2 * Math.pow(10, ph - 6.1);
}

export function phToH(ph) {
  return Math.pow(10, 9 - ph);
}

export function hToPh(h) {
  if (h <= 0) return 9; // Avoid log(0)
  return 9 - Math.log10(h);
}
