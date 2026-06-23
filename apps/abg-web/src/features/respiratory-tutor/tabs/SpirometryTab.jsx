import React, { useState } from 'react';

export default function SpirometryTab() {
  const [fvc, setFvc] = useState(4.8);
  const [fev, setFev] = useState(3.9);
  const [tlc, setTlc] = useState(6.0);
  const [rv, setRv] = useState(1.2);
  const [dl, setDl] = useState(85);

  const resetValues = () => {
    setFvc(4.8);
    setFev(3.9);
    setTlc(6.0);
    setRv(1.2);
    setDl(85);
  };

  const rat = fev / fvc * 100;
  const rvt = rv / tlc * 100;

  let pat, note, cls;
  if (rat < 70 && rvt > 40) {
    pat = 'Obstructive + air trapping';
    note = 'Severe COPD/emphysema — elevated TLC and gas trapping.';
    cls = 'danger';
  } else if (rat < 70) {
    pat = 'Obstructive';
    note = 'COPD, asthma, bronchiectasis. Check bronchodilator response.';
    cls = 'warn';
  } else if (fvc < 3.5 && tlc < 5.5 && dl < 75) {
    pat = 'Restrictive + ↓ DLCO';
    note = 'ILD/IPF — fibrosis impairs volumes and diffusion.';
    cls = 'danger';
  } else if (fvc < 3.5 && tlc < 5.5) {
    pat = 'Restrictive';
    note = 'Fibrosis, pleural disease, neuromuscular, obesity.';
    cls = 'warn';
  } else {
    pat = 'Normal';
    note = 'Spirometry within normal limits.';
    cls = 'ok';
  }

  const cols = ['#007AFF', '#34C759', '#FF9500', '#FF3B30'];
  const vals = [tlc, fvc, fev, rv];
  const labs = ['TLC', 'FVC', 'FEV₁', 'RV'];

  return (
    <div>
      <div className="card">
        <div className="hd">Spirometry values</div>
        <div className="row"><label>FVC (L)</label><input type="range" min="1.0" max="6.0" step="0.1" value={fvc} onChange={e => setFvc(parseFloat(e.target.value))} /><span className="rv">{fvc.toFixed(1)} L</span></div>
        <div className="row"><label>FEV₁ (L)</label><input type="range" min="0.5" max="5.5" step="0.1" value={fev} onChange={e => setFev(parseFloat(e.target.value))} /><span className="rv">{fev.toFixed(1)} L</span></div>
        <div className="row"><label>TLC (L)</label><input type="range" min="3.0" max="10.0" step="0.1" value={tlc} onChange={e => setTlc(parseFloat(e.target.value))} /><span className="rv">{tlc.toFixed(1)} L</span></div>
        <div className="row"><label>RV (L)</label><input type="range" min="0.5" max="5.0" step="0.1" value={rv} onChange={e => setRv(parseFloat(e.target.value))} /><span className="rv">{rv.toFixed(1)} L</span></div>
        <div className="row"><label>DLCO (%pred)</label><input type="range" min="20" max="120" step="1" value={dl} onChange={e => setDl(parseFloat(e.target.value))} /><span className="rv">{dl}%</span></div>
        <button onClick={resetValues} style={{ width: '100%', marginTop: '8px', padding: '10px', border: 'none', borderRadius: '10px', background: '#e5e5ea', color: '#333', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>&#8634; Reset to defaults</button>
      </div>

      <div className="g2">
        <div className="box"><div className="bl">FEV₁/FVC</div><div className="bv" style={{ color: rat < 70 ? '#FF9500' : '#111' }}>{rat.toFixed(0)}%</div></div>
        <div className="box"><div className="bl">RV/TLC</div><div className="bv" style={{ color: rvt > 40 ? '#FF9500' : '#111' }}>{rvt.toFixed(0)}%</div></div>
      </div>

      <div className={cls}><strong>{pat}</strong> — {note}</div>

      <div className="card">
        <div className="hd">Lung volumes</div>
        <div>
          {labs.map((l, i) => (
            <div key={l} className="lbar">
              <div className="lbrow"><span>{l}</span><span>{vals[i].toFixed(1)} L</span></div>
              <div className="lbt"><div className="lbf" style={{ width: Math.min(vals[i] / 10 * 100, 100) + '%', background: cols[i] }}></div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="hd">Pattern guide</div>
        <div className="ir"><span>FEV₁/FVC &lt; 70%</span><span style={{ color: '#007AFF' }}>Obstructive</span></div>
        <div className="ir"><span>FVC↓ TLC↓ ratio normal</span><span style={{ color: '#007AFF' }}>Restrictive</span></div>
        <div className="ir"><span>RV/TLC &gt; 40%</span><span style={{ color: '#FF9500' }}>Air trapping</span></div>
        <div className="ir"><span>DLCO &lt; 60%</span><span style={{ color: '#FF3B30' }}>Diffusion impaired</span></div>
      </div>
    </div>
  );
}
