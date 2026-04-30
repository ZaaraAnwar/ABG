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

export function interpret(ph, paco2) {
  const hco3 = hco3FromPhPco2(ph, paco2);

  const acidemia = ph < 7.35;
  const alkalemia = ph > 7.45;
  const normalPh = !acidemia && !alkalemia;

  const within = (value, low, high) => value >= low && value <= high;
  const near = (value, target, tol) => Math.abs(value - target) <= tol;

  const normalPCO2 = within(paco2, 35, 45);
  const normalHCO3 = within(hco3, 22, 26);

  if (normalPh && normalPCO2 && normalHCO3) {
    return "Normal";
  }

  // Expected compensation formulas
  const expectedWinter = 1.5 * hco3 + 8;         // metabolic acidosis
  const expectedMetAlk = 0.7 * hco3 + 20;        // metabolic alkalosis

  const acuteRespAcidHCO3 = 24 + ((paco2 - 40) / 10) * 1;
  const chronicRespAcidHCO3 = 24 + ((paco2 - 40) / 10) * 4;

  const acuteRespAlkHCO3 = 24 - ((40 - paco2) / 10) * 2;
  const chronicRespAlkHCO3 = 24 - ((40 - paco2) / 10) * 4.5;

  // 1) Abnormal pH: decide primary disorder by direction of pH
  if (acidemia) {
    // Primary respiratory acidosis
    if (paco2 > 45) {
      if (near(hco3, acuteRespAcidHCO3, 2) || near(hco3, chronicRespAcidHCO3, 3)) {
        return "Respiratory Acidosis";
      }
      if (hco3 < acuteRespAcidHCO3 - 2) {
        return "Respiratory Acidosis and\nMetabolic Acidosis";
      }
      return "Respiratory Acidosis";
    }

    // Primary metabolic acidosis
    if (hco3 < 22) {
      if (within(paco2, expectedWinter - 2, expectedWinter + 2)) {
        return "Metabolic Acidosis";
      }
      if (paco2 > expectedWinter + 2) {
        return "Metabolic Acidosis and\nRespiratory Acidosis";
      }
      if (paco2 < expectedWinter - 2) {
        return "Metabolic Acidosis and\nRespiratory Alkalosis";
      }
      return "Metabolic Acidosis";
    }

    return "Mixed Disorder";
  }

  if (alkalemia) {
    // Primary respiratory alkalosis
    if (paco2 < 35) {
      if (near(hco3, acuteRespAlkHCO3, 2) || near(hco3, chronicRespAlkHCO3, 3)) {
        return "Respiratory Alkalosis";
      }
      if (hco3 > acuteRespAlkHCO3 + 2) {
        return "Respiratory Alkalosis and\nMetabolic Alkalosis";
      }
      return "Respiratory Alkalosis";
    }

    // Primary metabolic alkalosis
    if (hco3 > 26) {
      if (within(paco2, expectedMetAlk - 5, expectedMetAlk + 5)) {
        return "Metabolic Alkalosis";
      }
      if (paco2 > expectedMetAlk + 5) {
        return "Metabolic Alkalosis and\nRespiratory Acidosis";
      }
      if (paco2 < expectedMetAlk - 5) {
        return "Metabolic Alkalosis and\nRespiratory Alkalosis";
      }
      return "Metabolic Alkalosis";
    }

    return "Mixed Disorder";
  }

  // 2) Normal pH: likely fully compensated or mixed
  if (normalPh) {
    // Respiratory alkalosis pattern: low PaCO2 + low HCO3
    if (paco2 < 35 && hco3 < 22) {
      const acuteMatch = near(hco3, acuteRespAlkHCO3, 2);
      const chronicMatch = near(hco3, chronicRespAlkHCO3, 3);

      if (acuteMatch || chronicMatch) {
        return "Compensated Respiratory Alkalosis";
      }
      return "Respiratory Alkalosis and\nMetabolic Acidosis";
    }

    // Respiratory acidosis pattern: high PaCO2 + high HCO3
    if (paco2 > 45 && hco3 > 26) {
      const acuteMatch = near(hco3, acuteRespAcidHCO3, 2);
      const chronicMatch = near(hco3, chronicRespAcidHCO3, 3);

      if (acuteMatch || chronicMatch) {
        return "Compensated Respiratory Acidosis";
      }
      return "Metabolic Alkalosis and\nRespiratory Acidosis";
    }

    // If pH is normal but only one arm is abnormal, lean by primary direction
    if (paco2 < 35) return "Compensated Respiratory Alkalosis";
    if (paco2 > 45) return "Compensated Respiratory Acidosis";
    if (hco3 < 22) return "Compensated Metabolic Acidosis";
    if (hco3 > 26) return "Compensated Metabolic Alkalosis";
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
  for (let hco3 = 4; hco3 <= 21; hco3 += 0.4) {
    const centerPco2 = 1.5 * hco3 + 8;
    for (let d = -2; d <= 2; d += 0.8) {
      const p = centerPco2 + d;
      if (p > 5) ma.push({ ph: calculatePh(hco3, p), pco2: p });
    }
  }
  addPts(ma, "#d6a6a1");

  // Metabolic Alkalosis
  let mAlk = [];
  for (let hco3 = 26; hco3 <= 55; hco3 += 0.4) {
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
