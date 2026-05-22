import { interpret } from './src/utils/abgMath.js';

const tests = [
  { ph: 7.72, paco2: 60, note: "Metabolic Alkalosis" },
  { ph: 7.73, paco2: 60, note: "Met Alkalosis and Resp Alkalosis" },
  { ph: 7.39, paco2: 60, note: "Resp Acidosis and Met Alkalosis" },
  { ph: 7.33, paco2: 60, note: "Chronic Resp Acidosis" },
  { ph: 7.26, paco2: 60, note: "Partially Comp Resp Acidosis" },
  { ph: 6.99, paco2: 60, note: "Acute Resp Acidosis" },
  { ph: 6.92, paco2: 60, note: "Resp Acidosis and Met Acidosis" }
];

for (let t of tests) {
  console.log(`pH: ${t.ph.toFixed(2)}, PaCO2: ${t.paco2.toFixed(1)} => Expected: ${t.note} | Actual: ${interpret(t.ph, t.paco2)}`);
}
