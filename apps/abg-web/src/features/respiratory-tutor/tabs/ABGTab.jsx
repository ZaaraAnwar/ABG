import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

function abL10(x) {
  return Math.log(x) / Math.LN10;
}

function abPHv(h, p) {
  return 6.1 + abL10(h / (0.03 * p));
}

function abBand(b) {
  const pts = [];
  const st = b.step;
  for (let v = b.lo; (st > 0 ? v <= b.hi : v >= b.hi); v += st) {
    for (let k = 0; k < b.off.length; k++) {
      const o = b.off[k];
      let x, y;
      if (b.by === 'pco2') {
        y = v;
        x = abPHv(b.hco3(v) + o, v);
      } else {
        const pc = b.pco2(v) + o;
        if (pc <= 0) continue;
        y = pc;
        x = abPHv(v, pc);
      }
      if (isFinite(x)) pts.push({ x: +x.toFixed(3), y: y });
    }
  }
  return pts;
}

const defs = [
  { label: 'Normal', color: 'rgba(118,135,170,.58)', by: 'pco2', lo: 35, hi: 45, step: 1, hco3: () => 24, off: [-3, -2, -1, 0, 1, 2, 3] },
  { label: 'Metabolic Acidosis', color: 'rgba(214,82,82,.6)', by: 'hco3', lo: 24, hi: 2, step: -0.5, pco2: (h) => 1.5 * h + 8, off: [-2.5, 0, 2.5] },
  { label: 'Metabolic Alkalosis', color: 'rgba(146,182,72,.6)', by: 'hco3', lo: 24, hi: 190, step: 3, pco2: (h) => 40 + 0.7 * (h - 24), off: [-2.5, 0, 2.5] },
  { label: 'Acute Resp. Acidosis', color: 'rgba(150,100,200,.58)', by: 'pco2', lo: 40, hi: 160, step: 3, hco3: (p) => 24 + 1 * (p - 40) / 10, off: [-1.6, 0, 1.6] },
  { label: 'Chronic Resp. Acidosis', color: 'rgba(72,176,214,.6)', by: 'pco2', lo: 40, hi: 160, step: 3, hco3: (p) => 24 + 4 * (p - 40) / 10, off: [-2.2, 0, 2.2] },
  { label: 'Acute Resp. Alkalosis', color: 'rgba(240,156,78,.62)', by: 'pco2', lo: 12, hi: 40, step: 1, hco3: (p) => 24 - 2 * (40 - p) / 10, off: [-1.3, 0, 1.3] },
  { label: 'Chronic Resp. Alkalosis', color: 'rgba(74,108,122,.65)', by: 'pco2', lo: 12, hi: 40, step: 1, hco3: (p) => 24 - 5 * (40 - p) / 10, off: [-1.6, 0, 1.6] }
];

export default function ABGTab() {
  const [ph, setPh] = useState(7.40);
  const [pc, setPc] = useState(40);
  const [po, setPo] = useState(95);
  const [fi, setFi] = useState(21);
  const [ag, setAg] = useState(40);

  const hc = +(0.03 * pc * Math.pow(10, ph - 6.1)).toFixed(1);
  const be = ((hc - 24) + 1.5 * (ph - 7.4) * 10).toFixed(1);
  const aa = ((713 * (fi / 100)) - (pc / .8) - po).toFixed(1);
  const nA = (4 + ag / 4).toFixed(0);

  let pri = 'Normal';
  let cls = 'ok';
  const steps = [];

  if (ph < 7.35 && pc > 45) {
    const aH = 24 + 1 * (pc - 40) / 10;
    const cH = 24 + 4 * (pc - 40) / 10;
    const phase = Math.abs(hc - aH) <= Math.abs(hc - cH) ? 'Acute' : 'Chronic';
    pri = phase + ' respiratory acidosis';
    cls = 'danger';
    steps.push('pH &lt; 7.35 &rarr; acidaemia &middot; PaCO₂ &gt; 45 &rarr; respiratory cause');
    steps.push(`Expected HCO₃¹¯ — acute ≈ ${aH.toFixed(0)} (+1 per 10), chronic ≈ ${cH.toFixed(0)} (+4 per 10) &middot; measured ${hc} &rarr; **${phase.toLowerCase()}**`);
  } else if (ph > 7.45 && pc < 35) {
    const aA = 24 - 2 * (40 - pc) / 10;
    const cA = 24 - 5 * (40 - pc) / 10;
    const phaseA = Math.abs(hc - aA) <= Math.abs(hc - cA) ? 'Acute' : 'Chronic';
    pri = phaseA + ' respiratory alkalosis';
    cls = 'warn';
    steps.push('pH &gt; 7.45 &rarr; alkalaemia &middot; PaCO₂ &lt; 35 &rarr; respiratory cause');
    steps.push(`Expected HCO₃¹¯ — acute ≈ ${aA.toFixed(0)} (−2 per 10), chronic ≈ ${cA.toFixed(0)} (−5 per 10) &middot; measured ${hc} &rarr; **${phaseA.toLowerCase()}**`);
  } else if (ph < 7.35 && hc < 22) {
    pri = 'Metabolic acidosis';
    cls = 'danger';
    steps.push('pH &lt; 7.35 &rarr; acidaemia &middot; HCO₃¹¯ &lt; 22 &rarr; metabolic cause');
  } else if (ph > 7.45 && hc > 26) {
    pri = 'Metabolic alkalosis';
    cls = 'warn';
    steps.push('pH &gt; 7.45 &middot; HCO₃¹¯ &gt; 26 &rarr; metabolic cause');
  } else {
    steps.push('pH 7.35–7.45 &rarr; normal or fully compensated');
  }

  if (pri === 'Metabolic acidosis') {
    const e = (1.5 * hc + 8).toFixed(0);
    steps.push(`Winters formula: expected PaCO₂ = ${e} &middot; measured = ${pc} &rarr; ${Math.abs(pc - parseFloat(e)) < 3 ? 'adequate compensation' : 'mixed disorder?'}`);
  }

  let mix = '';
  if (pri === 'Metabolic acidosis') {
    const mx1 = 1.5 * hc + 8;
    if (pc > mx1 + 3) mix = 'respiratory acidosis';
    else if (pc < mx1 - 3) mix = 'respiratory alkalosis';
  } else if (pri === 'Metabolic alkalosis') {
    const mx2 = 40 + 0.7 * (hc - 24);
    if (pc > mx2 + 3) mix = 'respiratory acidosis';
    else if (pc < mx2 - 3) mix = 'respiratory alkalosis';
  } else if (pri.includes('respiratory acidosis')) {
    const mxa = 24 + 0.1 * (pc - 40);
    const mxc = 24 + 0.4 * (pc - 40);
    if (hc > mxc + 3) mix = 'metabolic alkalosis';
    else if (hc < mxa - 3) mix = 'metabolic acidosis';
  } else if (pri.includes('respiratory alkalosis')) {
    const mxe = 24 - 0.2 * (40 - pc);
    const mxf = 24 - 0.5 * (40 - pc);
    if (hc > mxe + 3) mix = 'metabolic alkalosis';
    else if (hc < mxf - 3) mix = 'metabolic acidosis';
  }

  if (mix) {
    pri = pri + ' with ' + mix;
    cls = 'danger';
    steps.push(`Compensation falls outside the expected range &rarr; superimposed **${mix}** (mixed disorder)`);
  }

  steps.push(`A-a = ${aa} mmHg (normal &asymp;${nA}) &rarr; ${parseFloat(aa) > parseFloat(nA) + 5 ? 'raised — lung pathology' : 'normal — no intrinsic lung disease'}`);

  const resetValues = () => {
    setPh(7.40);
    setPc(40);
    setPo(95);
    setAg(40);
    setFi(21);
  };

  const chartData = useMemo(() => {
    const datasets = defs.map(b => ({
      label: b.label,
      data: abBand(b),
      backgroundColor: b.color,
      pointRadius: 3.5,
      pointHoverRadius: 3.5,
      borderWidth: 0,
      showLine: false
    }));
    datasets.push({
      label: 'Selected value',
      data: [], 
      backgroundColor: '#FF3B30',
      pointRadius: 6,
      showLine: false
    });
    return { datasets };
  }, []);

  const selDotPlugin = {
    id: 'abSelDot',
    afterDatasetsDraw: (c) => {
      const ctx = c.ctx;
      const xs = c.scales.x;
      const ys = c.scales.y;
      const px = xs.getPixelForValue(ph);
      const py = ys.getPixelForValue(pc);
      if (!isFinite(px) || !isFinite(py)) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, 6.2832);
      ctx.fillStyle = '#FF3B30';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.restore();
    }
  };

  return (
    <div>
      <div className="card">
        <div className="hd">Arterial blood gas values</div>
        <div className="row">
          <label>pH</label>
          <input type="range" min="7.00" max="7.70" step="0.01" value={ph} onChange={e => setPh(parseFloat(e.target.value))} />
          <span className="rv">{ph.toFixed(2)}</span>
        </div>
        <div className="row">
          <label>PaCO₂ (mmHg)</label>
          <input type="range" min="15" max="90" step="1" value={pc} onChange={e => setPc(parseFloat(e.target.value))} />
          <span className="rv">{pc}</span>
        </div>
        <div className="row">
          <label>HCO₃⁻ (calc.)</label>
          <span style={{ flex: 1, fontSize: '11px', color: '#aaa' }}>from pH &amp; PaCO₂ (Henderson–Hasselbalch)</span>
          <span className="rv" style={{ color: '#007AFF', fontWeight: 700 }}>{hc.toFixed(1)}</span>
        </div>
        <div className="row">
          <label>PaO₂ (mmHg)</label>
          <input type="range" min="20" max="120" step="1" value={po} onChange={e => setPo(parseFloat(e.target.value))} />
          <span className="rv">{po}</span>
        </div>
        <div className="row">
          <label>FiO₂ (%)</label>
          <input type="range" min="21" max="100" step="1" value={fi} onChange={e => setFi(parseFloat(e.target.value))} />
          <span className="rv">{fi}%</span>
        </div>
        <div className="row">
          <label>Age (yr)</label>
          <input type="range" min="18" max="90" step="1" value={ag} onChange={e => setAg(parseFloat(e.target.value))} />
          <span className="rv">{ag}</span>
        </div>
        <button onClick={resetValues} style={{ width: '100%', marginTop: '8px', padding: '10px', border: 'none', borderRadius: '10px', background: '#e5e5ea', color: '#333', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          &#8634; Reset to normal values
        </button>
      </div>

      <div className="g2">
        <div className="box">
          <div className="bl">Base excess</div>
          <div className="bv" style={{ color: Math.abs(parseFloat(be)) > 4 ? '#FF9500' : '#111' }}>{be}</div>
          <div className="bu">mmol/L</div>
        </div>
        <div className="box">
          <div className="bl">A-a gradient</div>
          <div className="bv" style={{ color: parseFloat(aa) > parseFloat(nA) + 5 ? '#FF9500' : '#111' }}>{aa}</div>
          <div className="bu">mmHg</div>
        </div>
      </div>

      <div className={cls}>
        <strong style={{ fontSize: '16px' }}>{pri}</strong><br />
        <span style={{ fontSize: '12px' }}>
          A-a gradient {aa} mmHg at FiO₂ {fi}% (room-air normal ≈{nA})
        </span>
      </div>

      <div className="card">
        <div className="hd">Acid–base map (pH vs PaCO₂)</div>
        <div style={{ position: 'relative', height: '340px' }}>
          <Scatter 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: false,
              scales: {
                x: {
                  type: 'linear',
                  min: 6.8,
                  max: 7.85,
                  title: { display: true, text: 'pH', font: { size: 10 } },
                  ticks: { stepSize: 0.2, font: { size: 9 } }
                },
                y: {
                  type: 'linear',
                  min: 0,
                  max: 165,
                  title: { display: true, text: 'PaCO₂ (mmHg)', font: { size: 10 } },
                  ticks: { font: { size: 9 } }
                }
              },
              plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 8.5 }, padding: 5 } },
                tooltip: { enabled: false }
              }
            }} 
            plugins={[selDotPlugin]}
          />
        </div>
      </div>

      <div className="card">
        <div className="hd">Step-by-step interpretation</div>
        <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.9 }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '7px' }}>
              <span style={{ color: '#007AFF', fontWeight: 700, flexShrink: 0 }}>&rarr;</span>
              <span dangerouslySetInnerHTML={{ __html: s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="hd">Acute vs chronic respiratory compensation</div>
        <div className="ir"><span>Acute respiratory acidosis</span><span>HCO₃⁻ ↑ 1 per 10 PaCO₂</span></div>
        <div className="ir"><span>Chronic respiratory acidosis</span><span>HCO₃⁻ ↑ 4 per 10 PaCO₂</span></div>
        <div className="ir"><span>Acute respiratory alkalosis</span><span>HCO₃⁻ ↓ 2 per 10 PaCO₂</span></div>
        <div className="ir"><span>Chronic respiratory alkalosis</span><span>HCO₃⁻ ↓ 5 per 10 PaCO₂</span></div>
      </div>
    </div>
  );
}
