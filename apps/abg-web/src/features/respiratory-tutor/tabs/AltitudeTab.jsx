import React, { useState } from 'react';
import { PH2O, ISAP, ISAT, HILL } from '../utils';

export default function AltitudeTab() {
  const [ft, setFt] = useState(0);
  const [fi, setFi] = useState(21);
  const [pc, setPc] = useState(40);

  const resetValues = () => {
    setFt(0);
    setFi(21);
    setPc(40);
  };

  const p = ISAP(ft);
  const t = ISAT(ft);
  const pa = (p - PH2O) * (fi / 100) - pc / 0.8;
  const sp = HILL(Math.max(pa, 1));

  let msg, cls;
  if (pa < 40) {
    msg = 'Severe hypoxia. Supplemental O₂ essential. Descent strongly advised.';
    cls = 'danger';
  } else if (pa < 60) {
    msg = 'Significant hypoxia. Supplemental O₂ recommended.';
    cls = 'warn';
  } else {
    msg = 'PAO₂ adequate at this altitude.';
    cls = 'ok';
  }

  const lmks = [
    { n: 'Sea level', f: 0 },
    { n: 'Denver', f: 5280 },
    { n: 'Machu Picchu', f: 8200 },
    { n: 'Leh', f: 11500 },
    { n: 'Everest BC', f: 17598 },
    { n: 'Death Zone', f: 26247 },
    { n: 'Everest', f: 29032 }
  ];

  return (
    <div>
      <div className="card">
        <div className="hd">Altitude &amp; O₂ supplement</div>
        <div className="row"><label>Altitude (ft)</label><input type="range" min="0" max="29032" step="100" value={ft} onChange={e => setFt(parseFloat(e.target.value))} /><span className="rv">{Math.round(ft).toLocaleString()} ft</span></div>
        <select value={ft} onChange={e => setFt(parseFloat(e.target.value))}>
          <option value="0">Sea level (0 ft)</option>
          <option value="5280">Denver, CO (5,280 ft)</option>
          <option value="8200">Machu Picchu (8,200 ft)</option>
          <option value="11500">Leh, Ladakh (11,500 ft)</option>
          <option value="17598">Everest Base Camp (17,598 ft)</option>
          <option value="26247">Death Zone (26,247 ft)</option>
          <option value="29032">Everest summit (29,032 ft)</option>
        </select>
        <div className="row"><label>FiO₂ (%)</label><input type="range" min="21" max="100" step="1" value={fi} onChange={e => setFi(parseFloat(e.target.value))} /><span className="rv">{fi}%</span></div>
        <div className="row"><label>PaCO₂ (mmHg)</label><input type="range" min="15" max="45" step="1" value={pc} onChange={e => setPc(parseFloat(e.target.value))} /><span className="rv">{pc}</span></div>
        <button onClick={resetValues} style={{ width: '100%', marginTop: '8px', padding: '10px', border: 'none', borderRadius: '10px', background: '#e5e5ea', color: '#333', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>&#8634; Reset to defaults</button>
      </div>

      <div className="g2">
        <div className="box"><div className="bl">Pₐₜₘ</div><div className="bv">{p.toFixed(1)}</div><div className="bu">mmHg</div></div>
        <div className="box"><div className="bl">Temp (ISA)</div><div className="bv">{t.toFixed(1)}</div><div className="bu">°C</div></div>
      </div>
      <div className="g2">
        <div className="box"><div className="bl">PAO₂</div><div className="bv" style={{ color: pa < 60 ? '#FF3B30' : '#111' }}>{pa.toFixed(1)}</div><div className="bu">mmHg</div></div>
        <div className="box"><div className="bl">Est. SpO₂</div><div className="bv" style={{ color: sp < 90 ? '#FF3B30' : '#111' }}>{sp.toFixed(1)}</div><div className="bu">%</div></div>
      </div>

      <div className={cls}>{msg}</div>

      <div className="card">
        <div className="hd">Key landmarks</div>
        <div>
          {lmks.map(l => {
            const lp = ISAP(l.f);
            const lp2 = (lp - PH2O) * 0.21 - 40 / 0.8;
            const ls = HILL(Math.max(lp2, 1));
            const c = lp2 < 40 ? '#FF3B30' : lp2 < 60 ? '#FF9500' : '#34C759';
            return (
              <div key={l.n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '.5px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{l.n}</div>
                  <div style={{ fontSize: '10px', color: '#aaa' }}>{l.f.toLocaleString()} ft</div>
                </div>
                <span className="badge" style={{ background: c }}>{Math.max(lp2, 0).toFixed(0)} mmHg &middot; {ls.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
