import React, { useState, useMemo } from 'react';
import { PH2O, HILL } from '../utils';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DIETS = [
  { max: .72, l: 'Pure fat metabolism', bg: '#BA7517' },
  { max: .78, l: 'Fat-predominant / fasting', bg: '#BA7517' },
  { max: .83, l: 'Mixed diet (normal)', bg: '#007AFF' },
  { max: .88, l: 'Mixed / protein-predominant', bg: '#007AFF' },
  { max: .95, l: 'Carbohydrate-predominant', bg: '#34C759' },
  { max: 1.01, l: 'Pure carbohydrate', bg: '#34C759' },
  { max: 9, l: '⚠️ Overfeeding (RQ > 1)', bg: '#FF3B30' }
];

const DS = {
  0.70: 'Pure fat',
  0.75: 'Fat↑',
  0.80: 'Mixed',
  0.85: 'Prot/Mix',
  0.90: 'Carbs↑',
  0.95: 'Carbs↑',
  1.00: 'Pure carbs',
  1.05: 'Overfeed'
};

export default function RQTab() {
  const [rq, setRq] = useState(0.80);
  const [pat, setPat] = useState(760);
  const [fi, setFi] = useState(21);
  const [pc, setPc] = useState(40);
  const [pm, setPm] = useState(90);

  const resetValues = () => {
    setRq(0.80);
    setPat(760);
    setFi(21);
    setPc(40);
    setPm(90);
  };

  const d = DIETS.find(x => rq <= x.max) || DIETS[DIETS.length - 1];
  
  const pio = (pat - PH2O) * (fi / 100);
  const cc = pc / rq;
  const pa = pio - cc;
  const aa = pa - pm;
  const sp = HILL(pm);

  let msg, cls;
  if (rq > 1.0) {
    msg = 'RQ > 1.0 — overfeeding. ↑ CO₂ → ↑ PaCO₂ → ↓ PAO₂. Reduce carbohydrate load.';
    cls = 'danger';
  } else if (pa < 40) {
    msg = 'Severe hypoxia — PAO₂ < 40 mmHg.';
    cls = 'danger';
  } else if (pa < 60) {
    msg = 'Significant hypoxia. Supplemental O₂ advised.';
    cls = 'warn';
  } else if (rq < 0.72) {
    msg = `Very low RQ — fat/fasting/DKA. CO₂ correction = ${cc.toFixed(1)} mmHg.`;
    cls = 'warn';
  } else {
    msg = `All parameters within range at RQ ${rq.toFixed(2)}.`;
    cls = 'ok';
  }

  const rv = [0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.05];
  const ps = rv.map(r => Math.max(pio - pc / r, 0));
  const cl = rv.map((r, i) => Math.abs(r - rq) < .005 ? '#007AFF' : ps[i] < 40 ? '#FF3B30' : ps[i] < 60 ? '#FF9500' : 'rgba(0,122,255,.28)');

  const chartData = useMemo(() => {
    return {
      labels: rv.map(r => r.toFixed(2)),
      datasets: [
        {
          data: ps.map(v => +v.toFixed(1)),
          backgroundColor: cl,
          borderRadius: 4
        }
      ]
    };
  }, [rq, pat, fi, pc]);

  return (
    <div>
      <div className="card" style={{ border: '1.5px solid #007AFF' }}>
        <div className="hd">RQ = VCO₂ ÷ VO₂ — drag the slider</div>
        <div style={{ textAlign: 'center', marginBottom: '6px' }}><span style={{ fontSize: '56px', fontWeight: 300, color: '#007AFF' }}>{rq.toFixed(2)}</span></div>
        <div className="dietb" style={{ background: d.bg }}>{d.l}</div>
        <div className="row"><label>RQ</label><input type="range" min="0.70" max="1.05" step="0.01" value={rq} onChange={e => setRq(parseFloat(e.target.value))} /><span className="rv">{rq.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#aaa', marginTop: '-3px' }}><span>0.70 fat</span><span>0.80 mixed</span><span>1.00 carbs</span><span>1.05+</span></div>
      </div>

      <div className="card">
        <div className="hd">Patient conditions</div>
        <div className="row"><label>Pₐₜₘ (mmHg)</label><input type="range" min="300" max="760" step="1" value={pat} onChange={e => setPat(parseFloat(e.target.value))} /><span className="rv">{pat}</span></div>
        <div className="row"><label>FiO₂ (%)</label><input type="range" min="21" max="100" step="1" value={fi} onChange={e => setFi(parseFloat(e.target.value))} /><span className="rv">{fi}%</span></div>
        <div className="row"><label>PaCO₂ (mmHg)</label><input type="range" min="15" max="80" step="1" value={pc} onChange={e => setPc(parseFloat(e.target.value))} /><span className="rv">{pc}</span></div>
        <div className="row"><label>PaO₂ meas.</label><input type="range" min="20" max="120" step="1" value={pm} onChange={e => setPm(parseFloat(e.target.value))} /><span className="rv">{pm}</span></div>
        <button onClick={resetValues} style={{ width: '100%', marginTop: '8px', padding: '10px', border: 'none', borderRadius: '10px', background: '#e5e5ea', color: '#333', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>&#8634; Reset to defaults</button>
      </div>

      <div className="eq">
        {`PAO₂ = (${Math.round(pat)}−47)×${Math.round(fi)}% − ${Math.round(pc)}÷${rq.toFixed(2)}\n     = ${pio.toFixed(1)} − ${cc.toFixed(1)} = ${pa.toFixed(1)} mmHg`}
      </div>

      <div className="g2">
        <div className="box"><div className="bl">CO₂ correction</div><div className="bv" style={{ color: cc > 55 ? '#FF9500' : '#111' }}>{cc.toFixed(1)}</div><div className="bu">mmHg</div></div>
        <div className="box"><div className="bl">PAO₂</div><div className="bv" style={{ color: pa < 60 ? '#FF3B30' : '#111' }}>{pa.toFixed(1)}</div><div className="bu">mmHg</div></div>
      </div>

      <div className="g3">
        <div className="box"><div className="bl">PIO₂</div><div className="bv" style={{ fontSize: '15px' }}>{pio.toFixed(1)}</div><div className="bu">mmHg</div></div>
        <div className="box"><div className="bl">A-a</div><div className="bv" style={{ fontSize: '15px', color: aa > 19 ? '#FF9500' : '#111' }}>{aa.toFixed(1)}</div><div className="bu">mmHg</div></div>
        <div className="box"><div className="bl">SpO₂</div><div className="bv" style={{ fontSize: '15px', color: sp < 90 ? '#FF3B30' : '#111' }}>{sp.toFixed(1)}</div><div className="bu">%</div></div>
      </div>

      <div className={cls}>{msg}</div>

      <div className="card">
        <div className="hd">PAO₂ across all RQ values</div>
        <div style={{ position: 'relative', height: '170px' }}>
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { font: { size: 9 } } },
                y: { min: 0, title: { display: true, text: 'PAO₂ (mmHg)', font: { size: 9 } } }
              }
            }} 
          />
        </div>
      </div>

      <div className="card">
        <div className="hd">Sensitivity table</div>
        <table className="sens">
          <thead><tr><th>RQ</th><th>Diet</th><th>CO₂ corr.</th><th>PAO₂</th><th>SpO₂</th></tr></thead>
          <tbody>
            {rv.map((r) => {
              const c2 = pc / r;
              const p2 = Math.max(pio - c2, 0);
              const s2 = HILL(p2);
              const isHi = Math.abs(r - rq) < .005;
              return (
                <tr key={r} className={isHi ? 'hi' : ''}>
                  <td>{r.toFixed(2)}</td>
                  <td style={{ fontSize: '9px' }}>{DS[parseFloat(r.toFixed(2))] || ''}</td>
                  <td>{c2.toFixed(1)}</td>
                  <td>{p2.toFixed(1)}</td>
                  <td>{s2.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="hd">Clinical pearls</div>
        <div style={{ marginBottom: '10px' }}><div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>⛔ ICU overfeeding (RQ &gt; 1.0)</div><div style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>Excess carbs → lipogenesis → more CO₂ than O₂ → ↑ PaCO₂ → ↓ PAO₂. Hidden weaning failure cause.</div></div>
        <div style={{ marginBottom: '10px' }}><div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>🟨 Fat feeds / propofol (RQ ≈ 0.70)</div><div style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>Less CO₂ produced. CO₂ correction is maximal. May aid weaning.</div></div>
        <div style={{ marginBottom: '10px' }}><div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>🟩 The arithmetic at PaCO₂ = 40</div><div style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>RQ 0.70 → 57.1 mmHg. RQ 1.00 → 40 mmHg. <strong>17 mmHg PAO₂ difference</strong> from diet alone.</div></div>
        <div><div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>🔵 Exercise &amp; CPET</div><div style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>At anaerobic threshold, RER transiently &gt; 1.0 — basis for AT identification on CPET.</div></div>
      </div>
    </div>
  );
}
