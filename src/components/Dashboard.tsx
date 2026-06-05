import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MoodEntry, AgeGroup, UserProfile } from '../types';
import { Sparkles, Calendar, Smile, AlertTriangle, Zap, Play, ArrowRight, Brain, Footprints } from 'lucide-react';
import { t } from '../utils/translations';

interface DashboardProps {
  profile: UserProfile;
  moodHistory: MoodEntry[];
  onAddMood: (entry: MoodEntry) => void;
  onNavigateTab: (tabId: string) => void;
  onUpdateStreaks: () => void;
  language: string;
}

export default function Dashboard({ profile, moodHistory, onAddMood, onNavigateTab, onUpdateStreaks, language }: DashboardProps) {
  // Mood Log States
  const [moodVal, setMoodVal] = useState(4); // 1-5
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [checkInNote, setCheckInNote] = useState('');
  const [loggedToday, setLoggedToday] = useState(false);

  // Recommendations state
  const [aiRecData, setAiRecData] = useState<any | null>(null);
  const [loadingRec, setLoadingRec] = useState(false);

  const quoteByAge = {
    teen: "Santosha (contentment) begins where search for other’s validation ends. Focus on your effort (Swadharma), not the rankings.",
    young: "You are the master of your intellect. Direct your energy like a focused arrow toward Swadharma, avoiding comparisons.",
    professional: "Pure productivity is a calm mind (Sattva). Do not trade presence for hurry. Take brief back-open postures today.",
    mature: "Contentment is the absolute wealth. Harmonize with nature’s cycles and breath (Prana), keeping relationships centered."
  };

  const triggerOptions = [
    'Academic pressures', 'Work overload', 'Relationship strain', 'Screen saturation', 'Family caregiving', 'Health concerns', 'Loneliness'
  ];

  const activityOptions = [
    'Yoga posture', 'Guided Meditation', 'Pranayama breathing', 'Pure hydration', 'Healthy meal', 'Outdoor stroll', 'Consistent Rest'
  ];

  // Check if logged today
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString();
    const hasLog = moodHistory.some(m => m.date === todayStr);
    setLoggedToday(hasLog);
  }, [moodHistory]);

  const handleToggleTrigger = (trig: string) => {
    if (selectedTriggers.includes(trig)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trig));
    } else {
      setSelectedTriggers([...selectedTriggers, trig]);
    }
  };

  const handleToggleActivity = (act: string) => {
    if (selectedActivities.includes(act)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== act));
    } else {
      setSelectedActivities([...selectedActivities, act]);
    }
  };

  const handleSaveMood = () => {
    const data: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      score: moodVal,
      note: checkInNote,
      triggers: selectedTriggers,
      activities: selectedActivities
    };

    onAddMood(data);
    onUpdateStreaks();
    setLoggedToday(true);
    setCheckInNote('');
    setSelectedActivities([]);
    setSelectedTriggers([]);

    // Auto load AI Recommendation on logging mood!
    triggerAiRecommendations(data);
  };

  const triggerAiRecommendations = async (customEntry?: MoodEntry) => {
    setLoadingRec(true);
    const entryToUse = customEntry || (moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: entryToUse ? entryToUse.score : 4,
          triggers: entryToUse ? entryToUse.triggers : [],
          activities: entryToUse ? entryToUse.activities : [],
          ageGroup: profile.ageGroup,
          language: language
        })
      });

      const data = await response.json();
      if (response.ok) {
        setAiRecData(data);
      } else {
        throw new Error();
      }
    } catch {
      // Offline robust fallback recommender values based on age-group!
      const fallbacksByAge = {
        teen: {
          dominantGuna: 'Rajas' as const,
          vibeNote: 'Slight academic agitation detected. Let us center your energy pathways.',
          recommendations: [
            { type: 'Breathing Exercise', title: '5-min Exam Anxiety Escape', description: 'Box breathing equal ratio (Sama Vritti) focuses the prefrontal cortex.', benefit: 'Instills focus and offsets fear', durationMins: 5 },
            { type: 'Yoga Pose', title: 'Confidence Warrior', description: 'Perform Warrior II standing widely, gazing at fingertips.', benefit: 'Builds secure core stance', durationMins: 15 }
          ]
        },
        young: {
          dominantGuna: 'Rajas' as const,
          vibeNote: 'Career direction overthinking detected. Balanced breath and Swadharma focus is suggested.',
          recommendations: [
            { type: 'Breathing Exercise', title: 'Swara Alternate Breath', description: 'Alternate nostril pranayama brings right-left brain hemisphere synergy.', benefit: 'Clears fuzzy doubts', durationMins: 10 },
            { type: 'Yoga Pose', title: 'Tree Pose Balance', description: 'Stand tall resting foot sole against inner calf or thigh.', benefit: 'Grounds emotional instability', durationMins: 10 }
          ]
        },
        professional: {
          dominantGuna: 'Tamas' as const,
          vibeNote: 'Occupational computer screen burnout. Parasympathetic postural soothing is required.',
          recommendations: [
            { type: 'Yoga Pose', title: 'Laptop Posture Backbend', description: 'Lying cobra backbends to offset screen hunch neck fatigue.', benefit: 'Relieves cervical spine pressure', durationMins: 10 },
            { type: 'Ayurvedic Habit', title: 'Digital Boundaries Detox', description: 'Shut down work communications and write stickies of tomorrow’s tasks.', benefit: 'Neutralizes racing mind sleep fogs', durationMins: 5 }
          ]
        },
        mature: {
          dominantGuna: 'Sattva' as const,
          vibeNote: 'Mild physical or joint stiffness. Gentle Santosha contentment is advised.',
          recommendations: [
            { type: 'Yoga Pose', title: 'Joint Mobility Nectar', description: 'Warm rotation of fingers, wrists, neck, and shoulder sockets.', benefit: 'Lubricates joints fluid flow', durationMins: 15 },
            { type: 'Breathing Exercise', title: 'Gratitude Reflection Scanning', description: 'Warm breathing scans aligning calm air into each body organ.', benefit: 'Neutralizes health anxiety', durationMins: 20 }
          ]
        }
      };

      setAiRecData(fallbacksByAge[profile.ageGroup]);
    } finally {
      setLoadingRec(false);
    }
  };

  const getEmojiForRating = (score: number) => {
    switch (score) {
      case 5: return '😇 Excellent';
      case 4: return '😊 Good';
      case 3: return '😐 Okay';
      case 2: return '😟 Bad';
      default: return '😭 Awful';
    }
  };

  // Pre-load default recs upon mounting if not loaded
  useEffect(() => {
    if (!aiRecData && !loadingRec) {
      triggerAiRecommendations();
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Greetings & Quotes Row */}
      <div className="lg:col-span-12 flex flex-col md:flex-row gap-6 md:items-center justify-between bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t('dash.namaste', language)}, <span className="text-indigo-650">{profile.name}</span>
          </h2>
          <p className="text-xs text-slate-455">
            {t('dash.target_vibe', language)}: <span className="font-bold underline text-slate-650 uppercase font-mono tracking-wide">{profile.ageGroup}</span> • {t('dash.focus', language)}: {profile.concerns.slice(0, 2).map(c => c.split(' & ')[0]).join(', ')}
          </p>
        </div>

        <div className="flex-1 max-w-xl md:border-l pl-0 md:pl-6 border-slate-150 py-1">
          <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">{t('dash.wise_quote', language)}</p>
          <p className="text-xs text-slate-650 italic leading-relaxed mt-1">
            "{quoteByAge[profile.ageGroup]}"
          </p>
        </div>
      </div>

      {/* Mood Entry Column */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Smile className="w-4.5 h-4.5 text-indigo-600" /> {t('dash.mood_checkin', language)}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {t('dash.today', language)}: {new Date().toLocaleDateString()}
            </span>
          </div>

          {loggedToday ? (
            <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🙏</span>
              <h4 className="font-bold text-indigo-950 text-sm">{t('dash.already_logged', language)}</h4>
              <p className="text-xs text-indigo-800 leading-normal max-w-sm mx-auto">
                {t('dash.presence_note', language)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Score rating slides */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-705">
                  <p>{t('dash.rate_emotion', language)}</p>
                  <span className="font-mono text-indigo-850 px-2.5 py-1 bg-indigo-50 border rounded-lg">{getEmojiForRating(moodVal)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={moodVal}
                  onChange={(e) => setMoodVal(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              {/* Stress triggers */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">{t('dash.select_triggers', language)}</label>
                <div className="flex flex-wrap gap-1.5">
                  {triggerOptions.map((trig) => {
                    const active = selectedTriggers.includes(trig);
                    return (
                      <button
                        key={trig}
                        type="button"
                        onClick={() => handleToggleTrigger(trig)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border focus:outline-none transition ${
                          active
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {trig}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity checked */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">{t('dash.select_activities', language)}</label>
                <div className="flex flex-wrap gap-1.5">
                  {activityOptions.map((act) => {
                    const active = selectedActivities.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleToggleActivity(act)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border focus:outline-none transition ${
                          active
                            ? 'bg-emerald-50 border-emerald-550 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-750'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                value={checkInNote}
                onChange={(e) => setCheckInNote(e.target.value)}
                placeholder={t('dash.brief_notes', language)}
                className="w-full px-3 py-2 border rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <button
                onClick={handleSaveMood}
                className="w-full mt-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition"
              >
                {t('dash.log_mood', language)}
              </button>
            </div>
          )}
        </div>

        {/* Weekly Mood SVG visual trends */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-4">{t('dash.mood_trends', language)}</h3>
          {moodHistory.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">{t('dash.no_trends', language)}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-end justify-between h-24 gap-3 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                {moodHistory.slice(-7).map((entry, i) => {
                  const barHeightPct = (entry.score / 5) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className="w-full bg-indigo-650 rounded transition-all duration-300 minimum-h-2"
                        style={{ height: `${barHeightPct}%` }}
                        title={`Score: ${entry.score}`}
                      />
                      <span className="font-mono text-[9px] text-slate-400 font-bold">{entry.date.split('/')[1] || i}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl text-[11px] text-indigo-900 leading-normal flex gap-2">
                <Brain className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  <strong>{t('dash.ai_prediction', language)}</strong>: {t('dash.ai_prediction_desc', language)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendation Carousel Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-indigo-605" /> {t('dash.personal_recs', language)}
            </h3>
            <button
              onClick={() => triggerAiRecommendations()}
              disabled={loadingRec}
              className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded focus:outline-none"
            >
              {loadingRec ? t('dash.generating', language) : t('dash.refresh_ai', language)}
            </button>
          </div>

          {loadingRec ? (
            <div className="py-24 text-center space-y-3">
              <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs text-slate-455 font-medium">{t('dash.generating', language)}</p>
            </div>
          ) : aiRecData ? (
            <div className="space-y-4">
              {/* Evaluated Guna */}
              <div className="p-3.5 bg-indigo-50 border border-indigo-150 rounded-2xl">
                <span className="text-[9px] uppercase font-extrabold tracking-wider font-mono text-indigo-805">{t('dash.dominant_guna', language)}</span>
                <p className="font-black text-xs text-indigo-950 mt-1 flex items-center gap-1 leading-none">
                  🕉️ {aiRecData.dominantGuna || 'Sattva state'}
                </p>
                <p className="text-[11px] text-indigo-900 mt-2 leading-relaxed">
                  "{aiRecData.vibeNote || 'Mental clarity and breath streams look aligned.'}"
                </p>
              </div>

              {/* Suggestions items matching schema */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">{t('dash.action_list', language)}</p>
                {aiRecData.recommendations?.map((item: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 border rounded-2xl flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">
                      {item.type === 'Yoga Pose' ? '🧘‍♀️' : item.type === 'Breathing Exercise' ? '💨' : '🍃'}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[9px] font-mono tracking-wide uppercase font-bold text-slate-400">{item.type}</span>
                        <span className="text-[9px] font-bold text-slate-455 font-mono">{item.durationMins}m</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-normal">{item.description}</p>
                      <p className="text-[9px] text-slate-455 pt-1.5 italic">Benefit: {item.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-455 text-center py-10">No recommendations. Please check in mood trends.</p>
          )}
        </div>

        {/* Rapid action trigger card */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-150 p-6 rounded-3xl space-y-3.5 shadow-sm text-slate-905">
          <h4 className="font-extrabold text-indigo-955 text-sm uppercase font-mono tracking-wider">{t('dash.workspace', language)}</h4>
          <p className="text-xs text-indigo-855 leading-relaxed">
            {t('dash.workspace_desc', language)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigateTab('chat')}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-lg text-[10px] uppercase leading-none transition"
            >
              {t('nav.chat', language)}
            </button>
            <button
              onClick={() => onNavigateTab('crisis')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-lg text-[10px] uppercase leading-none transition"
            >
              {t('nav.crisis', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
