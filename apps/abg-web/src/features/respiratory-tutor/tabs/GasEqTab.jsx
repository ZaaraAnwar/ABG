import React, { useState } from 'react';
import { PH2O, HILL } from '../utils';

export default function GasEqTab() {
  const [pat, setPat] = useState(760);
  const [fi, setFi] = useState(21);
  const [pc, setPc] = useState(40);
  const [rq, setRq] = useState(0.80);
  const [pm, setPm] = useState(90);
  const [ag, setAg] = useState(40);

  const resetValues = () => {
    setPat(760);
    setFi(21);
    setPc(40);
    setRq(0.80);
    setPm(90);
    setAg(40);
  };

  const pio = (pat - PH2O) * (fi / 100);
  const pa = pio - pc / rq;
  const aa = pa - pm;
  const sp = HILL(pm);
  const nA = 4 + ag / 4;

  let msg, cls;
  if (pa < 40) {
    msg = 'Severe hypoxia — PAO₂ < 40 mmHg';
    cls = 'danger';
  } else if (pa < 60) {
    msg = 'Significant hypoxia — supplemental O₂ advised';
    cls = 'warn';
  } else if (aa > nA + 8) {
    msg = `Raised A-a (${aa.toFixed(1)} mmHg) — V/Q mismatch or shunt?`;
    cls = 'warn';
  } else {
    msg = 'PAO₂ and A-a gradient within normal range';
    cls = 'ok';
  }

  return (
    <div>
      <div className="card">
        <div className="hd">Alveolar gas equation</div>
        <div className="row"><label>Pₐₜₘ (mmHg)</label><input type="range" min="300" max="760" step="1" value={pat} onChange={e => setPat(parseFloat(e.target.value))} /><span className="rv">{pat}</span></div>
        <div className="row"><label>FiO₂ (%)</label><input type="range" min="21" max="100" step="1" value={fi} onChange={e => setFi(parseFloat(e.target.value))} /><span className="rv">{fi}%</span></div>
        <div className="row"><label>PaCO₂ (mmHg)</label><input type="range" min="15" max="80" step="1" value={pc} onChange={e => setPc(parseFloat(e.target.value))} /><span className="rv">{pc}</span></div>
        <div className="row"><label>RQ</label><input type="range" min="0.70" max="1.05" step="0.01" value={rq} onChange={e => setRq(parseFloat(e.target.value))} /><span className="rv">{rq.toFixed(2)}</span></div>
        <div className="row"><label>PaO₂ meas.</label><input type="range" min="20" max="120" step="1" value={pm} onChange={e => setPm(parseFloat(e.target.value))} /><span className="rv">{pm}</span></div>
        <div className="row"><label>Age (yr)</label><input type="range" min="18" max="85" step="1" value={ag} onChange={e => setAg(parseFloat(e.target.value))} /><span className="rv">{ag}</span></div>
        <button onClick={resetValues} style={{ width: '100%', marginTop: '8px', padding: '10px', border: 'none', borderRadius: '10px', background: '#e5e5ea', color: '#333', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>&#8634; Reset to defaults</button>
      </div>

      <div className="eq">
        {`PAO₂ = (${Math.round(pat)}−47)×${Math.round(fi)}% − ${Math.round(pc)}÷${rq.toFixed(2)}\n     = ${pio.toFixed(1)} − ${(pc / rq).toFixed(1)} = ${pa.toFixed(1)} mmHg`}
      </div>

      <div className="g2">
        <div className="box"><div className="bl">PAO₂</div><div className="bv" style={{ color: pa < 60 ? '#FF3B30' : '#111' }}>{pa.toFixed(1)}</div><div className="bu">mmHg</div></div>
        <div className="box"><div className="bl">A-a gradient</div><div className="bv" style={{ color: aa > nA + 8 ? '#FF9500' : '#111' }}>{aa.toFixed(1)}</div><div className="bu">mmHg</div></div>
      </div>
      <div className="g2">
        <div className="box"><div className="bl">PIO₂</div><div className="bv">{pio.toFixed(1)}</div><div className="bu">mmHg</div></div>
        <div className="box"><div className="bl">Est. SpO₂</div><div className="bv" style={{ color: sp < 90 ? '#FF3B30' : '#111' }}>{sp.toFixed(1)}</div><div className="bu">%</div></div>
      </div>

      <div className={cls}>{msg}</div>

      <div className="card">
        <div className="hd">Reference</div>
        <div className="ir"><span>PH₂O at 37°C</span><span>47 mmHg</span></div>
        <div className="ir"><span>Normal A-a (age 40)</span><span>≈ 14 mmHg</span></div>
        <div className="ir"><span>Raised A-a causes</span><span>V/Q mismatch, shunt</span></div>
        <div className="ir"><span>Normal A-a causes</span><span>Hypoventilation, altitude</span></div>
      </div>
    </div>
  );
}
