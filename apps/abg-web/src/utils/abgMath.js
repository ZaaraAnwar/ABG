/**
 * Core ABG Mathematics and Interpretation Logic
 * ── Ported from Android ABG Tutor (Formula.java + Diagnosis.java + Helper.java) ──
 */

export const SVG_W = 750;
export const SVG_H = 600;
export const PH_MIN = 6.8;
export const PH_MAX = 7.85;
export const PCO2_MIN = 0;
export const PCO2_MAX = 160;

/* ═══════════════════════════════════════════════════════════════════════════════
   Helper utilities (from Helper.java)
   ═══════════════════════════════════════════════════════════════════════════════ */

export function round1Digit(input) {
  return Math.round(input * 10) / 10;
}

export function round2Digit(input) {
  return Math.round(input * 100) / 100;
}

/**
 * Round to N decimal places using HALF_UP rounding (BigDecimal equivalent).
 */
export function roundN(value, numberOfDigitsAfterDecimalPoint) {
  const factor = Math.pow(10, numberOfDigitsAfterDecimalPoint);
  return Math.round(value * factor) / factor;
}

export function format1D(input) {
  return input.toFixed(1);
}

export function format2D(input) {
  return input.toFixed(2);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Formula functions (from Formula.java — exact port)
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * H+ = 10^(9 - pH)
 */
export function calculateHPlus(pHVal) {
  return Math.pow(10, 9 - pHVal);
}

/**
 * Calculated HCO3 = round1Digit( (PaCO2 × 24) / H+ )
 * This is the PRIMARY HCO3 calculation used by the Android app.
 */
export function calculateCalculatedHCO3FromPH(pHVal, PaCO2) {
  return round1Digit((PaCO2 * 24) / calculateHPlus(pHVal));
}

/**
 * Overload: Calculated HCO3 from pre-computed H+
 */
export function calculateCalculatedHCO3FromHPlus(calculateHPlusVal, PaCO2) {
  return round1Digit((PaCO2 * 24) / calculateHPlusVal);
}

/**
 * DeltaHCO3 = |24 - calculatedHCO3| / 24   (rounded to 4 digits)
 */
export function calculateDeltaHCO3(pHVal, PaCO2) {
  const result = (24.0 - calculateCalculatedHCO3FromPH(pHVal, PaCO2)) / 24.0;
  return roundN(Math.abs(result), 4);
}

export function calculateDeltaHCO3FromHCO3(calculatedHCO3) {
  return Math.abs((24.0 - calculatedHCO3) / 24.0);
}

/**
 * DeltaPaCO2 = |40 - PaCO2| / 40   (rounded to 4 digits)
 */
export function calculateDeltaPaCO2(PaCO2) {
  const result = (40 - PaCO2) / 40.0;
  return roundN(Math.abs(result), 4);
}

/**
 * Winter's Formula (Metabolic Acidosis):
 *   ExpectedPCO2 = 1.5 × calculatedHCO3 + 8
 */
export function calculateExpectedPCO2(pHVal, PaCO2) {
  return round2Digit(1.5 * calculateCalculatedHCO3FromPH(pHVal, PaCO2) + 8.0);
}

export function calculateExpectedPCO2FromHCO3(calculatedHCO3) {
  return round2Digit(1.5 * calculatedHCO3 + 8.0);
}

/**
 * Metabolic Alkalosis expected PCO2:
 *   ExpectedPCO2 = 0.7 × (calculatedHCO3 - 24) + 40
 */
export function calculateExpectedPCO2Alkalosis(pHVal, PaCO2) {
  return round2Digit(0.7 * (calculateCalculatedHCO3FromPH(pHVal, PaCO2) - 24.0) + 40.0);
}

export function calculateExpectedPCO2AlkalosisFromHCO3(calculatedHCO3) {
  return round2Digit(0.7 * (calculatedHCO3 - 24.0) + 40.0);
}

/**
 * For Respiratory Acidosis sub-classification:
 *   HCO3 change per 10 mmHg PaCO2 change = (calculatedHCO3 - 24) × 10 / (PaCO2 - 40)
 */
export function HCO3ChangePerChangeInPaco2ForAcidosis(pHVal, PaCO2) {
  if (PaCO2 === 40) return 0.0;
  const result = (calculateCalculatedHCO3FromPH(pHVal, PaCO2) - 24.0) * 10.0 / (PaCO2 - 40.0);
  return result;
}

/**
 * For Respiratory Alkalosis sub-classification:
 *   HCO3 change per 10 mmHg PaCO2 change = (24 - calculatedHCO3) × 10 / (40 - PaCO2)
 */
export function HCO3ChangePerChangeInPaco2ForAlkalosis(pHVal, PaCO2) {
  if (PaCO2 === 40) return 0.0;
  const result = (24.0 - calculateCalculatedHCO3FromPH(pHVal, PaCO2)) * 10.0 / (40.0 - PaCO2);
  return result;
}

/**
 * A-a Gradient = (FiO2 × 713) - (PaCO2 / 0.8) - PaO2
 */
export function calculateAaDO2Gradient(FiO2, PaCO2, PaO2) {
  return (713.0 * FiO2) - (PaCO2 / 0.8) - PaO2;
}

/**
 * Anion Gap = Na - Cl - calculatedHCO3
 */
export function calculateAnionGap(NA, CL, calculatedHCO3) {
  return NA - CL - calculatedHCO3;
}

/**
 * Corrected Anion Gap for Albumin:
 *   If albumin < 3.5: AG + (3.5 - albumin) × 2.5
 *   Else: AG unchanged
 */
export function calculateCorrectedAnionGap4Albumin(anionGapValue, serumAlbumin) {
  if (serumAlbumin < 3.5) {
    return anionGapValue + (3.5 - serumAlbumin) * 2.5;
  }
  return anionGapValue;
}

/**
 * Osmolar Gap = measuredOsmolality - (2×Na + glucose/18 + bun/2.8)
 */
export function calculationOsmolarGap(NA, glucose, bun, measuredOsmolality) {
  return measuredOsmolality - ((2.0 * NA) + (glucose / 18.0) + (bun / 2.8));
}

/**
 * Osmolar Gap Result:
 *   "Toxic Alcohol" only if BOTH osmolarGap > 10 AND correctedAG > 12
 *   Otherwise "Within normal limit"
 */
export function getOsmolarGapResult(osmolarGap, correctAnionGap) {
  if (osmolarGap > 10 && correctAnionGap > 12) {
    return "Toxic Alcohol";
  }
  return "Within normal limit";
}

/**
 * Delta-Delta (difference-based):
 *   (correctedAG - 12) - (24 - calculatedHCO3)
 */
export function calculationDeltadelta(correctAnionGap, calculatedHCO3) {
  return (correctAnionGap - 12.0) - (24.0 - calculatedHCO3);
}

/**
 * Delta-Delta interpretation (Android exact thresholds):
 */
export function getDeltadeltaResult(deltaDelta, correctAnionGap) {
  if (deltaDelta > 5.0 && correctAnionGap > 12.0) {
    return "High Anion Gap Acidosis with Metabolic Alkalosis";
  }
  if (deltaDelta < -5.0 && correctAnionGap > 12.0) {
    return "High Anion Gap Metabolic Acidosis as well as Normal Anion Gap Metabolic Acidosis";
  }
  if (deltaDelta >= -5.0 && deltaDelta <= 5.0 && correctAnionGap > 12.0) {
    return "High Anion Gap Metabolic Acidosis";
  }
  return "Normal Anion Gap";
}

/**
 * Urinary Anion Gap = (Na + K) - Cl
 */
export function calculationUrinaryAnionGap(urinaryNA, urinaryCl, urinaryK) {
  return (urinaryNA + urinaryK) - urinaryCl;
}

/**
 * Urinary Anion Gap interpretation (uses correctedAG range 8-12):
 */
export function getUrinaryAnionGapResult(urinaryAnionGap, correctAnionGap) {
  if (urinaryAnionGap < 0 && correctAnionGap >= 8 && correctAnionGap <= 12) {
    return "Evaluate for Proximal RTA OR GI Loss";
  }
  if (urinaryAnionGap > 0 && correctAnionGap >= 8 && correctAnionGap <= 12) {
    return "RTA type I or type IV";
  }
  return "NA";
}

/**
 * Low Anion Gap Result
 */
export function getLowyAnionGapResult(correctAnionGap) {
  if (correctAnionGap >= 8) return "NA";
  return "Laboratory error, lithium, bromide or iodide intoxication, polyclonal gammopathy, hypercalcemia, hypermagnesemia, polymyxin b";
}

/**
 * Negative Urinary Anion Gap Result
 */
export function getNegativeUrinaryAnionGapResult(correctAnionGap) {
  if (correctAnionGap >= 0) return "NA";
  return "Laboratory error, Bromide or iodide intoxication, Multiple myeloma";
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Diagnosis (from Diagnosis.java — exact 3-step port)
   ═══════════════════════════════════════════════════════════════════════════════ */

// String constants matching R.string.* used by Android app
const STR_METABOLIC_ACIDOSIS = "Metabolic Acidosis";
const STR_RESPIRATORY_ACIDOSIS = "Respiratory Acidosis";
const STR_METABOLIC_ALKALOSIS = "Metabolic Alkalosis";
const STR_RESPIRATORY_ALKALOSIS = "Respiratory Alkalosis";

/**
 * Step 1: Primary disorder classification
 * Uses exact Android thresholds: HCO3 at 22/24/26, PaCO2 at 38/40/41/42
 */
function diagnosisStep1(pH, HCO3, PaCO2) {
  if (pH < 7.35) {
    if ((HCO3 < 22.0 && PaCO2 <= 42.0) || (HCO3 < 24.0 && PaCO2 < 41)) {
      return STR_METABOLIC_ACIDOSIS;
    }
    if ((HCO3 >= 22.0 && PaCO2 > 42.0) || (HCO3 > 23.0 && PaCO2 > 40)) {
      return STR_RESPIRATORY_ACIDOSIS;
    }
    if ((HCO3 < 22.0 && PaCO2 > 42.0) || (HCO3 < 24.0 && PaCO2 > 40)) {
      return "Metabolic Acidosis and Respiratory Acidosis";
    }
  } else if (pH > 7.45) {
    if ((HCO3 > 26.0 && PaCO2 >= 38.0) || (HCO3 > 24.0 && PaCO2 > 39)) {
      return STR_METABOLIC_ALKALOSIS;
    }
    if ((HCO3 <= 26.0 && PaCO2 < 38.0) || (HCO3 < 25.0 && PaCO2 < 40)) {
      return STR_RESPIRATORY_ALKALOSIS;
    }
    if ((HCO3 > 26.0 && PaCO2 < 38.0) || (HCO3 > 24.0 && PaCO2 < 40)) {
      return "Metabolic Alkalosis and Respiratory Alkalosis";
    }
  }

  // Normal range check
  if (pH >= 7.35 && pH <= 7.45 && PaCO2 >= 38.0 && PaCO2 <= 42.0 && HCO3 >= 22.0 && HCO3 <= 26.0) {
    return "Normal";
  }

  // Falls through to step 2
  const deltaHCO3 = calculateDeltaHCO3(pH, PaCO2);
  const deltaPaCO2 = calculateDeltaPaCO2(PaCO2);
  return diagnosisStep2(pH, HCO3, PaCO2, deltaHCO3, deltaPaCO2);
}

/**
 * Step 2: Compensated and mixed states
 * Uses deltaHCO3 vs deltaPaCO2 comparison
 */
function diagnosisStep2(pH, HCO3, PaCO2, deltaHCO3, deltaPaCO2) {
  if (HCO3 >= 22.0 && HCO3 <= 26.0 && PaCO2 > 42.0) {
    return "Compensated Respiratory Acidosis";
  }
  if (HCO3 > 26.0 && HCO3 <= 35.0 && PaCO2 > 42.0 && deltaHCO3 <= deltaPaCO2) {
    return "Compensated Respiratory Acidosis";
  }
  if (HCO3 > 35.0 && PaCO2 > 42.0 && deltaHCO3 <= deltaPaCO2) {
    return "Respiratory Acidosis with Metabolic Alkalosis";
  }
  if (HCO3 >= 22.0 && HCO3 <= 26.0 && PaCO2 < 38.0) {
    return "Compensated Respiratory Alkalosis";
  }
  if (HCO3 < 22.0 && HCO3 >= 10.0 && PaCO2 < 38.0 && deltaHCO3 <= deltaPaCO2) {
    return "Compensated Respiratory Alkalosis";
  }
  if (HCO3 < 10.0 && PaCO2 < 38.0 && deltaHCO3 <= deltaPaCO2) {
    return "Respiratory Alkalosis and Metabolic Acidosis";
  }
  if (HCO3 < 22.0 && PaCO2 >= 38.0 && PaCO2 <= 42.0) {
    return "Compensated Metabolic Acidosis";
  }
  if (HCO3 < 22.0 && PaCO2 < 38.0 && PaCO2 >= 10 && deltaHCO3 > deltaPaCO2) {
    return "Compensated Metabolic Acidosis";
  }
  if (HCO3 < 22.0 && PaCO2 < 10 && deltaHCO3 > deltaPaCO2) {
    return "Metabolic Acidosis and Respiratory Alkalosis";
  }
  if (HCO3 > 26.0 && PaCO2 >= 38.0 && PaCO2 <= 42.0) {
    return "Compensated Metabolic Alkalosis";
  }
  if (HCO3 > 26.0 && PaCO2 > 42.0 && PaCO2 <= 60 && deltaHCO3 > deltaPaCO2) {
    return "Compensated Metabolic Alkalosis";
  }
  if (HCO3 > 26.0 && PaCO2 > 60 && deltaHCO3 > deltaPaCO2) {
    return "Metabolic Alkalosis with Respiratory Acidosis";
  }
  return "";
}

/**
 * Step 3: Respiratory sub-classification (Acute/Chronic/Partial)
 * Runs ONLY when step1 returns a pure respiratory or metabolic primary
 */
function diagnosisStep3(step1Result, pH, PaCO2) {
  if (step1Result === STR_METABOLIC_ALKALOSIS) {
    const expectedPaCO2 = calculateExpectedPCO2Alkalosis(pH, PaCO2);
    if (PaCO2 < expectedPaCO2 - 2.0 && PaCO2 < 2.0 + expectedPaCO2) {
      return "Metabolic Alkalosis and Respiratory Alkalosis";
    }
    if (PaCO2 > expectedPaCO2 - 2.0 && PaCO2 > 2.0 + expectedPaCO2) {
      return "Metabolic Alkalosis and Respiratory Acidosis";
    }
    return "";
  }

  if (step1Result === STR_METABOLIC_ACIDOSIS) {
    const expectedPaCO2 = calculateExpectedPCO2(pH, PaCO2);
    if (PaCO2 < expectedPaCO2 - 2.0 && PaCO2 < 2.0 + expectedPaCO2) {
      return "Metabolic Acidosis and Respiratory Alkalosis";
    }
    if (PaCO2 > 2.0 + expectedPaCO2 && PaCO2 > expectedPaCO2 - 2.0) {
      return "Metabolic Acidosis and Respiratory Acidosis";
    }
    return "";
  }

  if (step1Result === STR_RESPIRATORY_ALKALOSIS) {
    const result = HCO3ChangePerChangeInPaco2ForAlkalosis(pH, PaCO2);
    if (result <= 1.9) return "Respiratory Alkalosis and Metabolic Alkalosis";
    if (result > 1.9 && result <= 2.4) return "Acute Respiratory Alkalosis";
    if (result > 2.4 && result < 4.0) return "Partially Compensated Respiratory Alkalosis";
    if (result >= 4.0 && result <= 5.0) return "Chronic Respiratory Alkalosis";
    if (result > 5.0) return "Respiratory Alkalosis and Metabolic Acidosis";
    return "";
  }

  if (step1Result === STR_RESPIRATORY_ACIDOSIS) {
    const result = HCO3ChangePerChangeInPaco2ForAcidosis(pH, PaCO2);
    if (result <= 0.9) return "Respiratory Acidosis and Metabolic Acidosis";
    if (result > 0.9 && result <= 1.4) return "Acute Respiratory Acidosis";
    if (result > 1.4 && result < 4.0) return "Partially Compensated Respiratory Acidosis";
    if (result >= 4.0 && result <= 5.0) return "Chronic Respiratory Acidosis";
    if (result > 5.0) return "Respiratory Acidosis and Metabolic Alkalosis";
    return "";
  }

  return "";
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Public API — interpret() is the main entry point used by components
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Main interpretation function — exact port of Android's doCalculation() flow:
 *   1. Calculate H+ and HCO3 from pH + PaCO2
 *   2. Run step1 → get primary diagnosis
 *   3. Run step3 → get sub-classification
 *   4. If step3 returns a result, use it; otherwise use step1
 */
export function interpret(ph, paco2, _hco3Input = null) {
  // Calculate HCO3 using Android formula (H+ method)
  const calculatedHCO3 = calculateCalculatedHCO3FromPH(ph, paco2);

  // Step 1: Primary classification
  const step1Result = diagnosisStep1(ph, calculatedHCO3, paco2);

  // Step 3: Sub-classification (runs on primary disorders)
  const step3Result = diagnosisStep3(step1Result, ph, paco2);

  // Android logic: use step3 if non-empty, otherwise step1
  if (step3Result && step3Result.length > 0) {
    return step3Result;
  }
  return step1Result;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Legacy / Graph utilities (kept for visualization — NOT changed)
   ═══════════════════════════════════════════════════════════════════════════════ */

export function calculatePh(hco3, pco2) {
  if (pco2 <= 0) pco2 = 0.001; // prevent log(0)
  return 6.1 + Math.log10(hco3 / (0.03 * pco2));
}

/**
 * HCO3 from pH & PaCO2 using Henderson-Hasselbalch
 * (kept for graph region building — the interpret() function uses the H+ method instead)
 */
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
