import React, { useState } from 'react';

const CASES = [
  { t: 'Altitude hypoxia', tag: 'Altitude', tc: '#007AFF', v: '28-year-old trekker at Everest Base Camp. SpO₂ 82%, RR 22/min, room air.', abg: { 'PaO₂': '42', 'PaCO₂': '28', 'pH': '7.48', 'HCO₃⁻': '21' }, calc: 'PAO₂ = (380−47)×0.21 − 28/0.8 = 34.9 mmHg', aag: 'A-a = 34.9 − 42 = −7 mmHg (normal)', mech: 'Low PIO₂ from reduced Pₐₜₘ. Hyperventilation compensates. Normal A-a = intact gas exchange.', mgmt: 'Supplemental O₂, descend if symptomatic, acetazolamide.' },
  { t: 'Opioid hypoventilation', tag: 'High acuity', tc: '#FF3B30', v: '55-year-old, day 1 post-laparotomy, drowsy on morphine PCA. RR 8/min, SpO₂ 88%.', abg: { 'PaO₂': '52', 'PaCO₂': '68', 'pH': '7.28', 'HCO₃⁻': '24' }, calc: 'PAO₂ = (760−47)×0.21 − 68/0.8 = 64.7 mmHg', aag: 'A-a = 64.7 − 52 = 12.7 mmHg (normal)', mech: 'Opioid CNS depression → hypoventilation. Normal A-a = no lung pathology.', mgmt: 'Reduce opioid, naloxone if obtunded, supplemental O₂.' },
  { t: 'Pulmonary embolism', tag: 'High acuity', tc: '#FF3B30', v: '42-year-old, day 3 post knee replacement. Pleuritic pain, dyspnoea. SpO₂ 90% on 4L O₂.', abg: { 'PaO₂': '61', 'PaCO₂': '30', 'pH': '7.49', 'HCO₃⁻': '22' }, calc: 'PAO₂ on FiO₂ 36%: (760−47)×0.36 − 30/0.8 = 219 mmHg', aag: 'A-a = 219 − 61 = 158 mmHg — massively elevated', mech: 'V/Q mismatch from PE. Dead space from embolised segments.', mgmt: 'LMWH anticoagulation, CT-PA, thrombolysis if unstable.' },
  { t: 'Pulmonary fibrosis', tag: 'Moderate', tc: '#FF9500', v: '64-year-old. Progressive exertional dyspnoea. SpO₂ 94% rest, 87% on exertion.', abg: { 'PaO₂': '65', 'PaCO₂': '35', 'pH': '7.44', 'HCO₃⁻': '23' }, calc: 'PAO₂ = (760−47)×0.21 − 35/0.8 = 106.2 mmHg', aag: 'A-a = 106 − 65 = 41 mmHg — raised', mech: 'Diffusion impairment + V/Q mismatch. A-a raised despite near-normal PaCO₂.', mgmt: 'HRCT, PFTs, antifibrotics, exertional O₂.' },
  { t: 'Acute asthma', tag: 'High acuity', tc: '#FF3B30', v: '24-year-old, severe asthma attack. Initially hyperventilating, now tiring. SpO₂ 89%.', abg: { 'PaO₂': '58', 'PaCO₂': '44', 'pH': '7.34', 'HCO₃⁻': '23' }, calc: 'PAO₂ = (760−47)×0.21 − 44/0.8 = 94.7 mmHg', aag: 'A-a = 94.7 − 58 = 37 mmHg — raised', mech: 'A “normalising” PaCO₂ in acute asthma signals fatigue — ominous, not reassuring.', mgmt: 'Bronchodilators, steroids, magnesium; prepare for ventilatory support.' },
  { t: 'Salicylate toxicity', tag: 'Moderate', tc: '#FF9500', v: '30-year-old after aspirin overdose. Tachypnoea, tinnitus, vomiting.', abg: { 'PaO₂': '98', 'PaCO₂': '24', 'pH': '7.46', 'HCO₃⁻': '17' }, calc: 'PAO₂ = (760−47)×0.21 − 24/0.8 = 119.7 mmHg', aag: 'A-a = 119.7 − 98 = 22 mmHg', mech: 'Direct respiratory-centre stimulation drives a respiratory alkalosis, with a co-existing metabolic acidosis.', mgmt: 'Urinary alkalinisation, fluids, glucose; haemodialysis if severe.' }
];

export default function CasesTab() {
  const [ci, setCi] = useState(0);

  const step = (d) => {
    setCi(prev => Math.max(0, Math.min(CASES.length - 1, prev + d)));
  };

  const c = CASES[ci];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={() => step(-1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#e5e5e5', fontSize: '18px', cursor: 'pointer' }}>&lsaquo;</button>
        <span style={{ fontSize: '13px', color: '#8e8e93' }}>Case {ci + 1} of {CASES.length}</span>
        <button onClick={() => step(1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#e5e5e5', fontSize: '18px', cursor: 'pointer' }}>&rsaquo;</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, flex: 1 }}>{c.t}</span>
        <span className="badge" style={{ background: c.tc }}>{c.tag}</span>
      </div>
      <div className="info" style={{ marginBottom: '10px' }}>{c.v}</div>
      <div className="card">
        <div className="hd">ABG</div>
        <div className="g2">
          {Object.entries(c.abg).map(([k, v]) => (
            <div className="box" key={k}>
              <div className="bl">{k}</div>
              <div className="bv" style={{ fontSize: '18px' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="eq">{c.calc}</div>
      <div className="eq">{c.aag}</div>
      <div className="card">
        <div className="hd">Mechanism</div>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.65 }}>{c.mech}</p>
      </div>
      <div className="card">
        <div className="hd">Management</div>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.65 }}>{c.mgmt}</p>
      </div>
    </div>
  );
}
