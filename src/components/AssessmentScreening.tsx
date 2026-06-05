import { useState } from 'react';
import { motion } from 'motion/react';
import { DIAGNOSTIC_SCHEMES } from '../data';
import { AssessmentResult } from '../types';
import { BrainCircuit, Book, ShieldAlert, Sparkles, Activity, Download, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { t } from '../utils/translations';

interface AssessmentProps {
  results: AssessmentResult[];
  onAddResult: (res: AssessmentResult) => void;
  onNavigateToSOS: () => void;
  language: string;
}

export default function AssessmentScreening({ results, onAddResult, onNavigateToSOS, language }: AssessmentProps) {
  const ANSWER_SCALES = [
    { score: 0, text: t('screening.scale_0', language) || 'Not at all' },
    { score: 1, text: t('screening.scale_1', language) || 'Several days' },
    { score: 2, text: t('screening.scale_2', language) || 'More than half the days' },
    { score: 3, text: t('screening.scale_3', language) || 'Nearly every day' }
  ];

  const [activeSchemaKey, setActiveSchemaKey] = useState<'PHQ-9' | 'GAD-7' | 'Work-Stress' | 'Academic-Anxiety'>('PHQ-9');
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number>>({});
  const [activeScreen, setActiveScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [latestAssessmentResult, setLatestAssessmentResult] = useState<AssessmentResult | null>(null);

  const activeScheme = DIAGNOSTIC_SCHEMES[activeSchemaKey];
  const questionsList = activeScheme.questions;

  const handleStart = () => {
    setCurrentAnswers({});
    setActiveScreen('quiz');
    setLatestAssessmentResult(null);
  };

  const handleOptionSelect = (questionId: number, score: number) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const calculateAssessmentResult = () => {
    let totalScore = 0;
    questionsList.forEach(q => {
      totalScore += (currentAnswers[q.id] || 0);
    });

    const maxPoints = questionsList.length * 3;
    const scorePct = (totalScore / maxPoints) * 100;

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
    let interpretation = '';
    let recommendations: string[] = [];

    // Custom clinical evaluations by selected category
    if (activeSchemaKey === 'PHQ-9') {
      if (totalScore <= 4) {
        riskLevel = 'Low';
        interpretation = 'Minimal depression signals. Your mood pathways are generally healthy and centered.';
        recommendations = ['Maintain Sattvik light pure food choices.', 'Practice 10 minutes of journaling daily.', 'Gentle evening strolls.'];
      } else if (totalScore <= 9) {
        riskLevel = 'Moderate';
        interpretation = 'Mild depression markers detected. Daily stress and mood imbalances are occurring.';
        recommendations = ['Nadi Shodhana breathing at noon.', 'Gentle chest-opening yoga like Cobra.', 'Increase your social connections with close family.'];
      } else if (totalScore <= 14) {
        riskLevel = 'High';
        interpretation = 'Moderate to severe low-mood flags. Emotional depletion is felt frequently.';
        recommendations = ['Book a licensed psychologist consultation.', 'Include 15 minutes of guided Yoga Nidra deep rest.', 'Set definitive social boundaries.'];
      } else {
        riskLevel = 'Severe';
        interpretation = 'Critical level risk. You are experiencing exhausting physical and mental depression loops.';
        recommendations = ['Immediate clinical care matches recommended strategy.', 'Call our prominent SOS helpline.', 'Notify a trusted family companion.'];
      }

      // Check suicidal safety (question 9 > 0)
      if (currentAnswers[9] && currentAnswers[9] > 0) {
        riskLevel = 'Severe';
        interpretation = 'CRITICAL: Suicidal ideation or self-harm triggers were reported. Your health is extremely precious to us. Please halt testing and consult crisis care.';
      }
    } else if (activeSchemaKey === 'GAD-7') {
      if (totalScore <= 4) {
        riskLevel = 'Low';
        interpretation = 'Minimal anxiety patterns. Stable vagal tone in control.';
        recommendations = ['Deep diaphragmatic breaths during stress.', 'Mindful morning walk intervals.', 'Pure water nourishment.'];
      } else if (totalScore <= 9) {
        riskLevel = 'Moderate';
        interpretation = 'Mild generalized anxiety indicators. Prana (energy) channels are agitated (Rajasic state).';
        recommendations = ['Grounding Tree Pose practice daily.', 'Avoid black tea or high caffeine after 2 PM.', 'Commit to writing a gratitude journal before sleep.'];
      } else {
        riskLevel = 'Severe';
        interpretation = 'Severe high anxiety. Fight-or-flight loops are hyperactive. Immediate parasympathetic cooling is required.';
        recommendations = ['Guided abdominal body scans twice daily.', 'Professional CBT assessment recommendation.', 'Incorporate cooling Pranayama like Sheetali.'];
      }
    } else {
      // Work or Academic Stress Scales
      if (totalScore <= 5) {
        riskLevel = 'Low';
        interpretation = 'Healthy boundaries maintained. Career or study stressors are managed with resilience.';
        recommendations = ['Daily posture check on desk stretches.', 'Maintain active weekend technology detox.'];
      } else if (totalScore <= 10) {
        riskLevel = 'Moderate';
        interpretation = 'Moderate burnout signals. Chronic occupational fatigue is challenging your focus.';
        recommendations = ['Limit screen time after 8 PM with appcurfews.', 'Practice Legs-Up-The-Wall pose before bed.', 'Schedule structured task lists to offset overwork.'];
      } else {
        riskLevel = 'Severe';
        interpretation = 'High acute burnout. Your capacity to recuperate is highly strained (Rajas/Tamas depletion).';
        recommendations = ['Schedule professional therapist sessions.', 'Evaluate workload adjustments with school counselor/HR.', 'Structured 15-minute lunchtime meditation.'];
      }
    }

    const compiled: AssessmentResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      type: activeSchemaKey,
      score: totalScore,
      maxScore: maxPoints,
      riskLevel,
      interpretation,
      recommendations
    };

    onAddResult(compiled);
    setLatestAssessmentResult(compiled);
    setActiveScreen('result');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Severe': return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'High': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Moderate': return 'bg-yellow-50 border-yellow-250 text-yellow-800';
      default: return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    }
  };

  const exportPDFReportSim = () => {
    if (!latestAssessmentResult) return;
    const content = `---- MindCare AI - Health screening report ----
Assessment Category: ${latestAssessmentResult.type}
Date: ${latestAssessmentResult.date}
Safety Score: ${latestAssessmentResult.score} / ${latestAssessmentResult.maxScore}
Evaluation Risk: ${latestAssessmentResult.riskLevel}

Diagnostic Summary:
"${latestAssessmentResult.interpretation}"

Mitra Recommends:
${latestAssessmentResult.recommendations.map(r => `* ${r}`).join('\n')}

Notice: This report is a screening baseline and does not substitute a specialized clinical psychiatric evaluation. Consider sharing this document with your counselor.
--------------------------------------------`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `MindCare_Screening_${latestAssessmentResult.type}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isAllAnswered = questionsList.every(q => currentAnswers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto p-1 font-sans text-slate-800">
      {/* Tab Buttons */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-150 pb-3 mb-8">
        {(['PHQ-9', 'GAD-7', 'Work-Stress', 'Academic-Anxiety'] as const).map((key) => (
          <button
            key={key}
            onClick={() => {
              setActiveSchemaKey(key);
              setActiveScreen('intro');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition focus:outline-none ${
              activeSchemaKey === key
                ? 'bg-indigo-650 text-white shadow-sm'
                : 'bg-white border text-slate-700 hover:bg-slate-50'
            }`}
          >
            {key === 'PHQ-9' && (t('screening.phq9_tab', language) || 'Depression (PHQ-9)')}
            {key === 'GAD-7' && (t('screening.gad7_tab', language) || 'Anxiety (GAD-7)')}
            {key === 'Work-Stress' && (t('screening.work_tab', language) || 'Work Stress')}
            {key === 'Academic-Anxiety' && (t('screening.acad_tab', language) || 'Academic Stresses')}
          </button>
        ))}
      </div>

      {activeScreen === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950 mb-1.5">{activeScheme.title}</h2>
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase mb-4">{t('screening.medical_cap', language) || 'Standardized Medical Assessment'}</p>
          <p className="text-slate-650 max-w-2xl mx-auto mb-8 text-sm leading-relaxed">
            {activeScheme.description} {t('screening.audit_subtitle', language)}
          </p>

          <button
            onClick={handleStart}
            className="px-8 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition"
          >
            {t('screening.new_check', language)}
          </button>
        </motion.div>
      )}

      {activeScreen === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{activeScheme.title}</h3>
            <p className="text-xs text-slate-500">{t('screening.audit_subtitle', language)}</p>
          </div>

          <div className="space-y-6">
            {questionsList.map((q, index) => {
              const selectedValue = currentAnswers[q.id];
              return (
                <div key={q.id} className="pb-6 border-b border-slate-100 space-y-3.5">
                  <div className="flex gap-3">
                    <span className="font-mono text-xs text-slate-400 font-semibold">{index + 1}.</span>
                    <p className="text-sm font-medium text-slate-800">{q.text}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-6">
                    {ANSWER_SCALES.map((opt) => (
                      <button
                        key={opt.score}
                        onClick={() => handleOptionSelect(q.id, opt.score)}
                        className={`p-2.5 text-xs text-left border rounded-lg transition focus:outline-none ${
                          selectedValue === opt.score
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block font-bold">{opt.score}</span>
                        <span className="block text-[11px] font-normal leading-tight">{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setActiveScreen('intro')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              {t('screening.back', language)}
            </button>
            <button
              onClick={calculateAssessmentResult}
              disabled={!isAllAnswered}
              className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition"
            >
              {t('screening.submit', language)}
            </button>
          </div>
        </div>
      )}

      {activeScreen === 'result' && latestAssessmentResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Main output card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="text-center mb-6">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">My Medical Tally</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-1 mb-4">{latestAssessmentResult.type} Assessment</h2>
              
              <div className="inline-flex items-center justify-center p-6 bg-slate-50 border rounded-full font-mono mb-4">
                <span className="text-4xl font-extrabold text-indigo-700 leading-none">{latestAssessmentResult.score}</span>
                <span className="text-slate-400 text-lg font-normal ml-1">/ {latestAssessmentResult.maxScore}</span>
              </div>

              <div className={`mx-auto max-w-sm p-2.5 rounded-xl border text-xs font-extrabold tracking-wide uppercase ${getRiskColor(latestAssessmentResult.riskLevel)}`}>
                Risk Level: {latestAssessmentResult.riskLevel}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm leading-relaxed text-slate-700 max-w-2xl mx-auto italic mb-8">
              "{latestAssessmentResult.interpretation}"
            </div>

            {/* If suicidal or severe, display urgent SOS warning */}
            {latestAssessmentResult.riskLevel === 'Severe' && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl max-w-2xl mx-auto flex items-start gap-3.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-rose-955 font-bold text-sm">Crisis Intervention Activated</h4>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                    Our safety mechanism detects critical stress patterns. Your immediate physiological health is our top priority. Please access our SOS directory for direct chat and helpline counselors.
                  </p>
                  <button
                    onClick={onNavigateToSOS}
                    className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition"
                  >
                    Launch Emergency Grounding Platform
                  </button>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="font-semibold text-slate-950 text-sm uppercase font-mono tracking-wider flex items-center gap-1.5 border-b pb-2">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Curated Wellness Actions
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {latestAssessmentResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-indigo-500 font-bold font-mono">✔</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-10 pt-6 border-t">
              <button
                onClick={exportPDFReportSim}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs leading-none flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Download Report for Therapist
              </button>
              <button
                onClick={() => setActiveScreen('intro')}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs leading-none flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Test
              </button>
            </div>
          </div>

          {/* Historical Results Ticker */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-indigo-500" /> Historic Test Logs ({results.length})
            </h3>

            {results.length === 0 ? (
              <p className="text-xs text-slate-400">No historically completed assessments.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.slice().reverse().map((res) => (
                  <div key={res.id} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-slate-800 font-mono text-[10px] uppercase">{res.type}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{res.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black font-mono text-indigo-850 leading-none">{res.score} <span className="font-normal text-[10px] text-slate-400">/ {res.maxScore}</span></p>
                      <span className="text-[9px] font-extrabold mt-1 inline-block capitalize font-mono text-slate-500">{res.riskLevel} Risk</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
