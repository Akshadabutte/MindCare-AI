import { useState } from 'react';
import { motion } from 'motion/react';
import { ARTICLES } from '../data';
import { Article, AgeGroup } from '../types';
import { BookOpen, Search, Sparkles, Compass, AlertTriangle, CheckCircle, Lightbulb, GraduationCap } from 'lucide-react';
import { t } from '../utils/translations';

interface ResourcesProps {
  ageGroup: AgeGroup;
  language: string;
}

export default function ResourcesHub({ ageGroup, language }: ResourcesProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'gunaCalculator'>('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Guna Assessment States
  const [gunaAnswers, setGunaAnswers] = useState<Record<string, 's' | 'r' | 't'>>({
    drive: 's', sleep: 's', stress: 's', nutrition: 's'
  });
  const [gunaScoreCard, setGunaScoreCard] = useState<any | null>(null);

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = art.ageGroups.includes(ageGroup) || art.isIKS;
    return matchesSearch && matchesAge;
  });

  const runGunaEvaluation = () => {
    let s = 0, r = 0, t = 0;
    Object.values(gunaAnswers).forEach(val => {
      if (val === 's') s++;
      if (val === 'r') r++;
      if (val === 't') t++;
    });

    let primary = 'Sattva';
    let label = 'Harmonious Presence (Sattva)';
    let summary = 'Your mind is predominating in light, clarity, and peace. You process daily stresses from a center of peaceful presence.';
    let recommendations = [
      'Engage in selfless service (Seva) or assist peer support circles.',
      'Maintain pure fresh whole grains and hydration to feeds your Sattva reserve.',
      'Practice deep meditation at first light (Brahma Muhurta).'
    ];

    if (r > s && r >= t) {
      primary = 'Rajas';
      label = 'Overactive Passion & Restlessness (Rajas)';
      summary = 'Your energy is high but fragmented by competitive anxiety, ambition, or overthinking. The mind experiences rapid fluctuations.';
      recommendations = [
        'Engage in physical chest-opening postures like Warrior flows to ground restless currents.',
        'Halt computer messaging and screens after 8 PM to regulate cortisol levels.',
        'Incorporate soothing alternate-nostril breathing (Nadi Shodhana) at lunchtime.'
      ];
    } else if (t > s && t > r) {
      primary = 'Tamas';
      label = 'Lethargy, Apathy & Stagnation (Tamas)';
      summary = 'Your nervous system feels fatigued, sluggish, or emotionally depleted. You may experience procrastination or low-mood stagnation.';
      recommendations = [
        'Engage in energizing morning exercises (e.g., dynamic Sun Salutations) to wake muscles.',
        'Avoid heavy, canned, fermented, or left-over meals.',
        'Practice daily journaling prompts to release accumulated heavy thoughts without judgment.'
      ];
    }

    setGunaScoreCard({ s, r, t, primary, label, summary, recommendations });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Horizontal Nav Bar */}
      <div className="lg:col-span-12 flex gap-3 border-b border-slate-150 pb-3">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition ${
            activeTab === 'articles'
              ? 'bg-indigo-650 text-white shadow-sm'
              : 'bg-white border hover:bg-slate-50 text-slate-700'
          }`}
        >
          📖 {t('vault.tab_articles', language) || 'Expert IKS Library'}
        </button>
        <button
          onClick={() => setActiveTab('gunaCalculator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition ${
            activeTab === 'gunaCalculator'
              ? 'bg-indigo-650 text-white shadow-sm'
              : 'bg-white border hover:bg-slate-50 text-slate-705'
          }`}
        >
          🕉️ {t('vault.tab_guna', language) || 'Vedic Guna Analyzer (IKS)'}
        </button>
      </div>

      {activeTab === 'articles' && (
        <div className="lg:col-span-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-1.5">
                <BookOpen className="w-5.5 h-5.5 text-indigo-650" /> {t('vault.title', language) || 'Indian Knowledge & Clinical Hub'}
              </h2>
              <p className="text-xs text-slate-500">{t('vault.search', language) || 'Search library topics...'}</p>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('vault.search', language) || 'Search library topics...'}
              className="px-4 py-2 bg-white border rounded-xl text-xs w-full sm:w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white border hover:border-indigo-200 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:shadow-sm transition cursor-pointer"
              >
                <div className="space-y-3">
                  <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider font-mono font-bold rounded ${
                    art.isIKS ? 'bg-indigo-50 border border-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {art.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-650 transition text-sm leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{art.summary}</p>
                </div>

                <div className="flex items-center justify-between border-t mt-4 pt-3.5 text-[10px] text-slate-455">
                  <span className="font-semibold">{art.author.name}</span>
                  <span className="font-mono">{art.readTime} reading</span>
                </div>
              </div>
            ))}
          </div>

          {/* Expand Article Overlay */}
          {selectedArticle && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border p-6 md:p-8 space-y-6 text-slate-800 shadow-2xl"
              >
                <div className="flex justify-between items-start gap-4">
                  <span className="px-2.5 py-1 text-[9px] uppercase font-bold bg-indigo-50 border text-indigo-700 rounded-lg shrink-0">
                    {selectedArticle.category} Library
                  </span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-50 border h-8 w-8 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-950 leading-snug">{selectedArticle.title}</h3>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs bg-slate-100 border px-2 py-0.5 rounded-lg font-medium text-slate-650 flex items-center gap-1">
                      🎓 Verified Author: {selectedArticle.author.name} ({selectedArticle.author.role})
                    </span>
                  </div>
                </div>

                <div className="text-slate-750 text-sm leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-5 font-light">
                  {selectedArticle.content}
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full mt-2 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-xs transition"
                >
                  Close Educational Guide
                </button>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'gunaCalculator' && (
        <div className="lg:col-span-12 bg-white rounded-2xl border p-6 md:p-8 space-y-8 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-950 mb-1 flex items-center gap-1.5">
              🕉️ Ayurvedic mental constitution (Guna Analyzer)
            </h3>
            <p className="text-xs text-slate-455">Ancient Sanskrit texts identify three primary forces shaping brain stress. Self-diagnose your Guna ratio.</p>
          </div>

          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-3 pb-6 border-b">
              <p className="text-xs font-mono uppercase font-bold text-indigo-805">1. What motivates your typical morning workflow?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, drive: 's' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.drive === 's' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Santosha (Contentment)</strong>: I feel stable and carry out tasks with presence.
                </button>
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, drive: 'r' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.drive === 'r' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Asha (Ambitious drive)</strong>: Competitiveness, pressure, or fear of lagging behind.
                </button>
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, drive: 't' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.drive === 't' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Procrastination (Apathy)</strong>: Exhausted, sluggish, or searching to evade tasks.
                </button>
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-3 pb-6 border-b">
              <p className="text-xs font-mono uppercase font-bold text-indigo-805">2. How is your sleep cycle and night recovery?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, sleep: 's' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.sleep === 's' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-105 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Deep Rest</strong>: Refreshed, falling asleep naturally without overthinking.
                </button>
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, sleep: 'r' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.sleep === 'r' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-105 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Foggy / Overthinking</strong>: I wake up frequently rehearsing plans or task list targets.
                </button>
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, sleep: 't' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.sleep === 't' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-105 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Heaviness</strong>: I sleep 9+ hours but still wake up extremely lethargic or sluggish.
                </button>
              </div>
            </div>

            {/* Question 3 */}
            <div className="space-y-3 pb-6">
              <p className="text-xs font-mono uppercase font-bold text-indigo-805">3. What is your reaction to unexpected workspace complications?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, stress: 's' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.stress === 's' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-105 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Acceptance</strong>: Calm analysis. I adjust boundaries and act.
                </button>
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, stress: 'r' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.stress === 'r' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-105 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Agitation / Rush</strong>: Frustration, irritation, rapid breath patterns.
                </button>
                <button
                  onClick={() => setGunaAnswers({ ...gunaAnswers, stress: 't' })}
                  className={`p-3 text-xs text-left border rounded-xl transition focus:outline-none ${
                    gunaAnswers.stress === 't' ? 'bg-indigo-50 border-indigo-550 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-105 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <strong>Shutdown</strong>: Feeling overwhelmed. I ignore notifications and seek escapism.
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={runGunaEvaluation}
            className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-xs transition"
          >
            Calculate Predominant Guna & Correction Remedies
          </button>

          {/* Score evaluation output */}
          {gunaScoreCard && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-slate-50 border rounded-2xl space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold tracking-wider font-mono text-slate-400">Predominant Mental state evaluated:</span>
                <h4 className="font-extrabold text-indigo-950 text-base flex items-center gap-2">
                  <span>🕉️</span> {gunaScoreCard.label}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed italic mt-2">
                  "{gunaScoreCard.summary}"
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-extrabold tracking-wider font-mono text-slate-400 flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Curated Lifestyle Remedies:</span>
                <ul className="text-xs text-slate-805 space-y-1.5 pt-1 pl-4 list-decimal">
                  {gunaScoreCard.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="leading-relaxed font-medium">{rec}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
