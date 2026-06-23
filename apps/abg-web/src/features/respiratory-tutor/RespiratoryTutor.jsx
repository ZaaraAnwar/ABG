import React, { useState } from 'react';
import './RespiratoryTutor.css';
import ABGTab from './tabs/ABGTab';
import GasEqTab from './tabs/GasEqTab';
import RQTab from './tabs/RQTab';
import AltitudeTab from './tabs/AltitudeTab';
import SpirometryTab from './tabs/SpirometryTab';
import CasesTab from './tabs/CasesTab';
import WeaningTab from './tabs/WeaningTab';
import QuizTab from './tabs/QuizTab';

const TITLES = [
  'ABG Interpretation',
  'Gas Equation',
  'RQ Explorer',
  'Altitude Physiology',
  'Spirometry',
  'Clinical Cases',
  'Ventilator Weaning',
  'Quiz'
];

export default function RespiratoryTutor() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="respiratory-tutor-container">
      <div className="topbar">
        <div className="nav-title">{TITLES[activeTab]}</div>
        <div className="tabrow">
          <button className={activeTab === 0 ? 'on' : ''} onClick={() => setActiveTab(0)}>ABG</button>
          <button className={activeTab === 1 ? 'on' : ''} onClick={() => setActiveTab(1)}>Gas Eq.</button>
          <button className={activeTab === 2 ? 'on' : ''} onClick={() => setActiveTab(2)}>RQ</button>
          <button className={activeTab === 3 ? 'on' : ''} onClick={() => setActiveTab(3)}>Altitude</button>
          <button className={activeTab === 4 ? 'on' : ''} onClick={() => setActiveTab(4)}>Spirom.</button>
          <button className={activeTab === 5 ? 'on' : ''} onClick={() => setActiveTab(5)}>Cases</button>
          <button className={activeTab === 6 ? 'on' : ''} onClick={() => setActiveTab(6)}>Weaning</button>
          <button className={activeTab === 7 ? 'on' : ''} onClick={() => setActiveTab(7)}>Quiz</button>
        </div>
      </div>

      <div className="page on">
        {activeTab === 0 && <ABGTab />}
        {activeTab === 1 && <GasEqTab />}
        {activeTab === 2 && <RQTab />}
        {activeTab === 3 && <AltitudeTab />}
        {activeTab === 4 && <SpirometryTab />}
        {activeTab === 5 && <CasesTab />}
        {activeTab === 6 && <WeaningTab />}
        {activeTab === 7 && <QuizTab />}
      </div>
    </div>
  );
}
