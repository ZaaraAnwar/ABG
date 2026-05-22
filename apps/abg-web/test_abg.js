import { interpret } from './src/utils/abgMath.js';

const tests = [
  { ph: 7.40, paco2: 42, note: "5.6 kPa -> Compensated Respiratory Acidosis" },
  { ph: 7.40, paco2: 45, note: "6.0 kPa -> Comp Metabolic Alkalosis" },
  { ph: 7.40, paco2: 37.5, note: "5.0 kPa -> Compensated Respiratory Alkalosis" },
  { ph: 7.40, paco2: 17.25, note: "2.3 kPa -> Resp Alk and Met Acidosis" },
  { ph: 7.40, paco2: 12.75, note: "1.7 kPa -> Comp Metabolic Acidosis" },
  { ph: 7.40, paco2: 13.5, note: "1.8 kPa -> Comp Metabolic Acidosis" },
  { ph: 7.40, paco2: 7.5, note: "1.0 kPa -> Met Acidosis and Resp Alk" },
  { ph: 7.36, paco2: 40, note: "Compensated Metabolic Acidosis" },
  { ph: 7.34, paco2: 40, note: "Metabolic Acidosis" },
  { ph: 7.31, paco2: 40, note: "Met Acidosis and Resp Acidosis" },
  { ph: 7.44, paco2: 40, note: "Compensated Metabolic Alkalosis" },
  { ph: 7.46, paco2: 40, note: "Met Alkalosis and Resp Alkalosis" },
  { ph: 7.72, paco2: 46, note: "Metabolic Alkalosis" },
  { ph: 7.73, paco2: 46, note: "Met Alkalosis and Resp Alkalosis" },
  { ph: 7.39, paco2: 46, note: "Resp Acidosis and Met Alkalosis" },
  { ph: 7.33, paco2: 46, note: "Chronic Resp Acidosis" },
  { ph: 7.26, paco2: 46, note: "Partially Comp Resp Acidosis" },
  { ph: 6.99, paco2: 46, note: "Acute Resp Acidosis" },
  { ph: 6.92, paco2: 46, note: "Resp Acidosis and Met Acidosis" }
];

for (let t of tests) {
  console.log(`pH: ${t.ph.toFixed(2)}, PaCO2: ${t.paco2.toFixed(1)} => Expected: ${t.note} | Actual: ${interpret(t.ph, t.paco2)}`);
}
