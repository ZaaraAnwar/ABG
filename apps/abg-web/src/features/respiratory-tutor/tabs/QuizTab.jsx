import React, { useState } from 'react';

const QS = [
  {q:'pH 7.28, PaCO₂ 62, HCO₃⁻ 27. Primary disorder?',opts:['Metabolic acidosis','Respiratory acidosis','Metabolic alkalosis','Respiratory alkalosis'],ans:1,exp:'pH < 7.35 = acidaemia. Elevated PaCO₂ = respiratory cause. Raised HCO₃⁻ = partial compensation.'},
  {q:'FEV₁/FVC = 60%, TLC = 8.5 L, RV/TLC = 52%. Pattern?',opts:['Restrictive','Obstructive + air trapping','Normal','Mixed'],ans:1,exp:'FEV₁/FVC < 70% = obstructive. Elevated TLC and RV/TLC = severe gas trapping.'},
  {q:'At Everest BC (Pₐₜₘ 380 mmHg), PaCO₂ 28. PAO₂ = ?',opts:['~9 mmHg','~35 mmHg','~60 mmHg','~100 mmHg'],ans:1,exp:'PAO₂ = (380−47)×0.21 − 28/0.8 = 35 mmHg. Hyperventilation partially compensates.'},
  {q:'RQ > 1.0 in a ventilated ICU patient indicates:',opts:['Pure fat metabolism','Adequate nutrition','Carbohydrate overfeeding','Starvation'],ans:2,exp:'RQ > 1.0 = lipogenesis — more CO₂ than O₂ → ↑ PaCO₂. Hidden weaning failure cause.'},
  {q:'Plateau pressure 36 cmH₂O. Best immediate step?',opts:['Increase PEEP','Reduce tidal volume','Increase RR','Add prone positioning'],ans:1,exp:'Plateau > 30 = VILI risk. Reduce TV to 6 mL/kg IBW immediately.'},
  {q:'Which hypoxaemia cause does NOT respond to 100% O₂?',opts:['V/Q mismatch','Hypoventilation','Intracardiac shunt','Diffusion impairment'],ans:2,exp:'Shunt bypasses ventilated alveoli — FiO₂ cannot oxygenate shunted blood.'},
  {q:'Normal A-a gradient for a 60-year-old on room air?',opts:['4 mmHg','15–19 mmHg','30 mmHg','40 mmHg'],ans:1,exp:'Normal A-a ≈ 4 + Age/4 = 4 + 15 = 19 mmHg for a 60-year-old.'},
  {q:'Acidosis causes which O₂-Hb curve shift?',opts:['Left, ↑ O₂ affinity','Right, easier O₂ release to tissues','Right, ↑ O₂ affinity','No shift'],ans:1,exp:'Bohr effect: acidosis → right shift → Hb releases O₂ more readily to tissues.'},
  {q:'RSBI > 105 breaths/min/L indicates:',opts:['Ready for extubation','Favourable SBT','High SBT failure risk','Normal breathing'],ans:2,exp:'RSBI > 105 = unfavourable. Cannot sustain independent ventilation.'},
  {q:'RQ from 1.0 to 0.70 at PaCO₂ 40 changes PAO₂ by:',opts:['2 mmHg','5 mmHg','10 mmHg','17 mmHg'],ans:3,exp:'RQ 1.0 → correction 40 mmHg. RQ 0.70 → 57 mmHg. 17 mmHg difference from diet alone.'},
  {q:'P/F ratio 85 on FiO₂ 0.7, PEEP 10. Berlin ARDS?',opts:['Mild (200–300)','Moderate (100–200)','Severe (< 100)','Not ARDS'],ans:2,exp:'P/F < 100 on PEEP ≥5 = severe ARDS. Lung-protective ventilation + prone positioning.'},
  {q:'Which electrolyte deficiency most causes respiratory muscle failure?',opts:['Sodium','Phosphate','Chloride','Bicarbonate'],ans:1,exp:'Hypophosphataemia → diaphragm weakness. Replace to > 1.0 mmol/L before SBT.'}
];

export default function QuizTab() {
  const [qi, setQi] = useState(0);
  const [qsc, setQsc] = useState(0);
  const [ansIdx, setAnsIdx] = useState(null);

  if (qi >= QS.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '52px', fontWeight: 300, color: '#007AFF', marginBottom: '10px' }}>{qsc}/{QS.length}</div>
        <p style={{ color: '#8e8e93', marginBottom: '20px' }}>
          {qsc >= 10 ? 'Excellent!' : qsc >= 8 ? 'Great — review missed areas.' : qsc >= 6 ? 'Good — keep studying.' : 'Work through each module carefully.'}
        </p>
        <button className="ibtn" onClick={() => { setQi(0); setQsc(0); setAnsIdx(null); }}>Restart quiz</button>
      </div>
    );
  }

  const q = QS[qi];
  
  const handleAns = (i) => {
    if (ansIdx !== null) return;
    setAnsIdx(i);
    if (i === q.ans) setQsc(qsc + 1);
  };

  return (
    <div>
      <div className="prog"><div className="progf" style={{ width: `${(qi / QS.length) * 100}%` }}></div></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8e8e93', marginBottom: '10px' }}>
        <span>Question {qi + 1} of {QS.length}</span><span>Score: {qsc}</span>
      </div>
      <div>
        <div className="card" style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.65 }}>{q.q}</p>
        </div>
        {q.opts.map((o, i) => {
          let cname = "qopt";
          if (ansIdx !== null) {
            if (i === q.ans) cname += " correct";
            else if (i === ansIdx) cname += " wrong";
          }
          return (
            <button key={i} className={cname} disabled={ansIdx !== null} onClick={() => handleAns(i)}>
              {String.fromCharCode(65 + i)}. {o}
            </button>
          );
        })}
        {ansIdx !== null && (
          <>
            <div className={ansIdx === q.ans ? 'ok' : 'danger'} style={{ marginTop: '8px' }}>
              <strong>{ansIdx === q.ans ? 'Correct ✓' : 'Incorrect — answer: ' + String.fromCharCode(65 + q.ans)}</strong><br />
              <span style={{ fontSize: '12px' }}>{q.exp}</span>
            </div>
            <button className="ibtn" onClick={() => { setQi(qi + 1); setAnsIdx(null); }}>
              {qi + 1 < QS.length ? 'Next question →' : 'See results →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
