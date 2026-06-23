import React, { useState } from 'react';

export default function WeaningTab() {
  const [activeTab, setActiveTab] = useState(0);
  
  const [wc, setWc] = useState(Array(8).fill(false));
  const [fc, setFc] = useState(Array(8).fill(false));
  const [ec, setEc] = useState(Array(8).fill(false));

  const [rr, setRr] = useState(18);
  const [tv, setTv] = useState(450);

  const renderReadiness = () => {
    const items = [
      ['Cause resolved', 'Primary diagnosis treated'],
      ['Adequate oxygenation', 'PaO₂ >60 on FiO₂ ≤40%, PEEP ≤8'],
      ['Haemodynamic stability', 'No or minimal vasopressors'],
      ['Conscious & cooperative', 'Follows commands, GCS ≥8'],
      ['Adequate respiratory effort', 'RR <35/min, pH >7.25'],
      ['Airway reflexes intact', 'Effective cough'],
      ['Neuromuscular function OK', 'No residual paralysis'],
      ['Metabolic status OK', 'Electrolytes corrected']
    ];
    const n = wc.filter(Boolean).length;
    return (
      <>
        <div className="g2">
          <div className="box">
            <div className="bl">Criteria met</div>
            <div className="bv" style={{ color: n >= 7 ? '#34C759' : n >= 5 ? '#FF9500' : '#FF3B30' }}>{n}/8</div>
          </div>
          <div className="box">
            <div className="bl">Status</div>
            <div className="bv" style={{ fontSize: '13px', color: n >= 7 ? '#34C759' : n >= 5 ? '#FF9500' : '#FF3B30' }}>
              {n >= 7 ? 'Ready' : n >= 5 ? 'Almost' : 'Not ready'}
            </div>
          </div>
        </div>
        {n >= 7 ? <div className="ok">Ready for SBT — all criteria met.</div> : 
         n >= 5 ? <div className="warn">{8 - n} criteria outstanding.</div> : 
         <div className="danger">{8 - n} criteria unmet.</div>}
        <div className="card">
          <div className="hd">Readiness checklist</div>
          {items.map((it, j) => (
            <div className="chk" key={j}>
              <input type="checkbox" checked={wc[j]} onChange={e => {
                const newWc = [...wc];
                newWc[j] = e.target.checked;
                setWc(newWc);
              }} />
              <div>
                <div className="ct">{it[0]}</div>
                <div className="cd">{it[1]}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderRSBI = () => {
    const r = rr / (tv / 1000);
    let res, cls, msg, msgCls;
    if (r < 80) {
      res = 'Favourable';
      cls = '#34C759';
      msg = 'RSBI < 80 — proceed to SBT.';
      msgCls = 'ok';
    } else if (r <= 105) {
      res = 'Borderline';
      cls = '#FF9500';
      msg = 'Borderline — use full clinical picture.';
      msgCls = 'warn';
    } else {
      res = 'Unfavourable';
      cls = '#FF3B30';
      msg = 'RSBI > 105 — high failure risk. Do not proceed.';
      msgCls = 'danger';
    }

    return (
      <>
        <div className="card">
          <div className="hd">Rapid Shallow Breathing Index (RSBI)</div>
          <div style={{ fontSize: '11px', color: '#8e8e93', marginBottom: '10px' }}>RR ÷ Tidal volume (L)</div>
          <div className="row">
            <label>RR (/min)</label>
            <input type="range" min="5" max="50" step="1" value={rr} onChange={e => setRr(parseFloat(e.target.value))} />
            <span className="rv">{rr}</span>
          </div>
          <div className="row">
            <label>Tidal vol (mL)</label>
            <input type="range" min="100" max="800" step="10" value={tv} onChange={e => setTv(parseFloat(e.target.value))} />
            <span className="rv">{tv}</span>
          </div>
        </div>
        <div className="g2">
          <div className="box">
            <div className="bl">RSBI</div>
            <div className="bv">{r.toFixed(0)}</div>
            <div className="bu">br/min/L</div>
          </div>
          <div className="box">
            <div className="bl">Result</div>
            <div className="bv" style={{ fontSize: '13px', color: cls }}>{res}</div>
          </div>
        </div>
        <div className={msgCls}>{msg}</div>
        <div className="card">
          <div className="hd">Thresholds</div>
          <div className="ir"><span style={{ color: '#34C759' }}>&lt; 80</span><span>Favourable — proceed to SBT</span></div>
          <div className="ir"><span style={{ color: '#FF9500' }}>80–105</span><span>Borderline — clinical judgement</span></div>
          <div className="ir"><span style={{ color: '#FF3B30' }}>&gt; 105</span><span>Unfavourable — not ready</span></div>
        </div>
      </>
    );
  };

  const renderSBT = () => {
    const steps = [
      ['Oxygenation', 'SpO₂ ≥90%. FiO₂ unchanged.'],
      ['Breathing', 'RR <35. TV >5 mL/kg.'],
      ['Haemodynamics', 'HR change <20%. SBP 90–180.'],
      ['Comfort', 'No agitation or diaphoresis.'],
      ['ABG', 'pH >7.32. PaCO₂ rise <10 mmHg.']
    ];
    return (
      <>
        <div className="card">
          <div className="hd">Spontaneous Breathing Trial (SBT)</div>
          <div style={{ fontSize: '11px', color: '#8e8e93', marginBottom: '10px' }}>Methods</div>
          <div className="ir"><span>T-piece</span><span style={{ color: '#007AFF' }}>Gold standard</span></div>
          <div className="ir"><span>Low PS (5/5 cmH₂O)</span><span style={{ color: '#007AFF' }}>Most commonly used</span></div>
          <div className="ir"><span>CPAP (0 PS)</span><span style={{ color: '#007AFF' }}>Monitoring maintained</span></div>
        </div>
        <div className="card">
          <div className="hd">Monitor every 5–15 minutes</div>
          {steps.map((s, j) => (
            <div className="step" key={j}>
              <div className="snum">{j + 1}</div>
              <div>
                <div className="stitle">{s[0]}</div>
                <div className="sdesc">{s[1]}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderFailure = () => {
    const crit = [
      ['SpO₂ < 90% or PaO₂ < 60 mmHg', 'Oxygenation failure'],
      ['RR > 35/min > 5 minutes', 'Ventilatory insufficiency'],
      ['HR > 140 or change > 20%', 'Cardiovascular stress'],
      ['SBP > 180 or < 90 mmHg', 'Haemodynamic instability'],
      ['Agitation or diaphoresis', 'Subjective distress'],
      ['Altered consciousness', 'Neurological deterioration'],
      ['Paradoxical breathing', 'Respiratory muscle fatigue'],
      ['pH < 7.32 or PaCO₂ rise > 10', 'Acute respiratory acidosis']
    ];
    const n = fc.filter(Boolean).length;
    return (
      <>
        {n === 0 ? <div className="info">No failure criteria. Continue monitoring.</div> :
         n === 1 ? <div className="warn">1 criterion — if persists &gt; 5 min → stop SBT.</div> :
         <div className="danger">{n} criteria — STOP SBT immediately.</div>}
        <div className="card">
          <div className="hd">Stop SBT if any present</div>
          {crit.map((c, j) => (
            <div className="chk" key={j}>
              <input type="checkbox" checked={fc[j]} onChange={e => {
                const newFc = [...fc];
                newFc[j] = e.target.checked;
                setFc(newFc);
              }} />
              <div>
                <div className="ct">{c[0]}</div>
                <div className="cd">{c[1]}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderExtub = () => {
    const items = [
      ['SBT passed (30–120 min)', 'Tolerated without failure'],
      ['Strong cough', 'Peak cough flow > 60 L/min'],
      ['Secretions manageable', 'Suctioning < 2-hourly'],
      ['Cuff leak present', 'Reduces stridor risk'],
      ['Alert & cooperative', 'GCS ≥10–12'],
      ['Haemodynamically stable', 'No escalating vasopressors ×6 hrs'],
      ['Team & equipment ready', 'Re-intubation kit at bedside'],
      ['Aspiration risk considered', 'Dysphagia screen planned']
    ];
    const n = ec.filter(Boolean).length;
    return (
      <>
        {n >= 7 ? <div className="ok">Proceed to extubation — plan post-extubation O₂ strategy.</div> :
         n >= 5 ? <div className="warn">{8 - n} items outstanding.</div> :
         <div className="danger">Extubation not advised — {8 - n} criteria unmet.</div>}
        <div className="card">
          <div className="hd">Extubation checklist</div>
          {items.map((it, j) => (
            <div className="chk" key={j}>
              <input type="checkbox" checked={ec[j]} onChange={e => {
                const newEc = [...ec];
                newEc[j] = e.target.checked;
                setEc(newEc);
              }} />
              <div>
                <div className="ct">{it[0]}</div>
                <div className="cd">{it[1]}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="hd">Post-extubation support</div>
          <div className="ir"><span>HFNC</span><span>1st choice — hypoxaemic patients</span></div>
          <div className="ir"><span>NIV / BiPAP</span><span>COPD / hypercapnic patients</span></div>
          <div className="ir"><span>Re-intubate if</span><span>SpO₂ &lt;90%, RR &gt;35, instability</span></div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="wseg">
        <button className={activeTab === 0 ? 'on' : ''} onClick={() => setActiveTab(0)}>Readiness</button>
        <button className={activeTab === 1 ? 'on' : ''} onClick={() => setActiveTab(1)}>RSBI</button>
        <button className={activeTab === 2 ? 'on' : ''} onClick={() => setActiveTab(2)}>SBT</button>
        <button className={activeTab === 3 ? 'on' : ''} onClick={() => setActiveTab(3)}>Failure</button>
        <button className={activeTab === 4 ? 'on' : ''} onClick={() => setActiveTab(4)}>Extub.</button>
      </div>
      <div>
        {activeTab === 0 && renderReadiness()}
        {activeTab === 1 && renderRSBI()}
        {activeTab === 2 && renderSBT()}
        {activeTab === 3 && renderFailure()}
        {activeTab === 4 && renderExtub()}
      </div>
    </div>
  );
}
