import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Flame, Trophy, ShieldCheck, CheckCircle } from 'lucide-react';
import { t } from '../utils/translations';

interface ProgressProps {
  streaks: {
    meditation: number;
    yoga: number;
    journal: number;
    mood: number;
  };
  totalMins: number;
  unlockedBadges: string[];
  language: string;
}

export default function ProgressCenter({ streaks, totalMins, unlockedBadges, language }: ProgressProps) {
  const [dailyChecklist, setDailyChecklist] = useState([
    { id: 'mood', text: 'Checked in my daily mood rating', done: true },
    { id: 'breathe', text: 'Completed 5 minutes of Pranayama box breathing', done: false },
    { id: 'active', text: 'Performed physical posture stretching / desk yoga', done: false },
    { id: 'hydration', text: 'Logged 2000ml pure water hydration', done: true },
    { id: 'journal', text: 'Wrote an unfiltered journal entry with AI sentiment analysis', done: false }
  ]);

  const allBadges = [
    { code: 'init-onboard', title: 'Svasthya Entry', desc: 'Successfully onboarded your customized age profile', icon: '🐣', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { code: 'med-first', title: 'Zen Initiate', desc: 'Concluded your first guided meditation breathing session', icon: '🧘‍♀️', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { code: 'yoga-first', title: 'Prana Balance', desc: 'Performed a full lifestage restorative yoga flow', icon: '🔥', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { code: 'journal-first', title: 'Sattva Scholar', desc: 'Saved your first AI structural journal sentiment entry', desc2: 'Unlocked when sentiment score processed', icon: '📝', color: 'bg-emerald-50 border-emerald-250 text-emerald-800' },
    { code: 'SOS-survivor', title: 'Grounding Anchor', desc: 'Completed the 5-4-3-2-1 panic grounding mental pacer', icon: '🛡️', color: 'bg-rose-50 border-rose-220 text-rose-800' }
  ];

  const peerMeditationLeaderboard = [
    { rank: 1, name: 'Sattvik_Seeker (Anon)', mins: 420 },
    { rank: 2, name: 'YogaMitra_88 (Anon)', mins: 380 },
    { rank: 3, name: 'Calm_Inside99 (Anon)', mins: 310 },
    { rank: 4, name: 'Pranayam_Prasad', mins: 280 },
    { rank: 5, name: 'StudentFocus_Teens', mins: 190 }
  ];

  const handleToggleChecklist = (id: string) => {
    setDailyChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const completedChecklistCount = dailyChecklist.filter(c => c.done).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Daily tracker progress */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-indigo-650" />
          <h2 className="text-xl font-bold text-slate-950">{t('progress.title', language) || 'Achievements & Daily Tasks'}</h2>
        </div>

        {/* Streaks counters dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border rounded-2xl p-4 text-center space-y-1 hover:shadow-sm transition">
            <Flame className="w-6.5 h-6.5 text-amber-500 mx-auto" />
            <p className="text-2xl font-black font-mono text-slate-900">{streaks.mood}</p>
            <p className="text-[10px] text-slate-505 font-mono uppercase tracking-wider">{t('progress.streak_mood', language) || 'Mood Checks'}</p>
          </div>
          <div className="bg-white border rounded-2xl p-4 text-center space-y-1 hover:shadow-sm transition">
            <Flame className="w-6.5 h-6.5 text-purple-500 mx-auto" />
            <p className="text-2xl font-black font-mono text-slate-900">{streaks.meditation}</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{t('progress.streak_meditation', language) || 'Meditation Streak'}</p>
          </div>
          <div className="bg-white border rounded-2xl p-4 text-center space-y-1 hover:shadow-sm transition">
            <Flame className="w-6.5 h-6.5 text-indigo-500 mx-auto" />
            <p className="text-2xl font-black font-mono text-slate-900">{streaks.yoga}</p>
            <p className="text-[10px] text-slate-505 font-mono uppercase tracking-wider">{t('progress.streak_yoga', language) || 'Yoga Streak'}</p>
          </div>
          <div className="bg-white border rounded-2xl p-4 text-center space-y-1 hover:shadow-sm transition">
            <Flame className="w-6.5 h-6.5 text-emerald-500 mx-auto" />
            <p className="text-2xl font-black font-mono text-slate-900">{streaks.journal}</p>
            <p className="text-[10px] text-slate-550 font-mono uppercase tracking-wider">{t('progress.streak_journal', language) || 'Diary Streak'}</p>
          </div>
        </div>

        {/* Daily checklist */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle className="w-4.5 h-4.5 text-indigo-505" /> {t('progress.checklist', language) || 'Daily Svasthya Habits Checklist'}
            </h3>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 font-mono px-2 py-0.5 rounded-full">
              {completedChecklistCount} / {dailyChecklist.length} Complete
            </span>
          </div>

          <div className="space-y-2">
            {dailyChecklist.map((item) => (
              <button
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`w-full text-left p-3 border rounded-xl flex items-center gap-3 transition focus:outline-none hover:bg-slate-50 ${
                  item.done ? 'bg-indigo-50/20 border-indigo-200 text-slate-700' : 'bg-white'
                }`}
              >
                <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  item.done ? 'bg-indigo-600 border-indigo-650 text-white font-bold text-xs' : 'bg-slate-50'
                }`}>
                  {item.done ? '✓' : ''}
                </span>
                <span className={`text-xs ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Badges unlock room */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-4">{t('progress.badges', language) || 'Unlocked Badges Catalog'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allBadges.map((bad) => {
              // Simulated unlock condition (e.g. check code or default mock unlocks to show beautiful state!)
              const isUnlocked = unlockedBadges.includes(bad.code) || bad.code === 'init-onboard' || (bad.code === 'med-first' && totalMins > 0);
              return (
                <div
                  key={bad.code}
                  className={`p-4 border rounded-2xl flex items-center gap-4 transition ${
                    isUnlocked ? bad.color : 'bg-slate-50 border-slate-150 opacity-40 grayscale'
                  }`}
                >
                  <span className="text-3xl shrink-0">{bad.icon}</span>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs">{bad.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-normal">{bad.desc}</p>
                    {!isUnlocked && <p className="text-[9px] text-slate-400 font-mono">Not yet unlocked</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mx-auto mb-3 font-bold text-lg">
            🏆
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm uppercase font-mono tracking-wider">{t('progress.leaderboard', language) || 'Collective Meditation Hours'}</h4>
          <p className="text-xs text-slate-455 mt-1.5 max-w-xs mx-auto leading-normal">
            Anonymized weekly meditation minutes showing global community focus minutes.
          </p>

          <div className="space-y-2 mt-6 text-left">
            {peerMeditationLeaderboard.map((peer) => (
              <div key={peer.rank} className="p-2.5 bg-slate-50 border rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 font-bold w-4">#{peer.rank}</span>
                  <span className="font-bold text-slate-800">{peer.name}</span>
                </div>
                <span className="font-bold font-mono text-indigo-700 bg-indigo-100/50 px-2.5 py-0.5 rounded-full text-[10px]">
                  {peer.mins} Mins
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-left mt-5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-900 leading-normal">
              <strong>Complete Privacy</strong>: Your metric details and names are strictly hidden. Leaderboard uses voluntary anonymous handles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
