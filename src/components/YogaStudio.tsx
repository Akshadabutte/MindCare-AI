import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { YOGA_POSES } from '../data';
import { YogaPose, AgeGroup } from '../types';
import { Flame, Play, Pause, RotateCcw, Award, CheckCircle, ShieldAlert, SlidersHorizontal, BookOpen } from 'lucide-react';
import { t } from '../utils/translations';

interface YogaProps {
  ageGroup: AgeGroup;
  onUnlockBadge: (badgeCode: string) => void;
  onAddMinutes: (mins: number) => void;
  language: string;
}

export default function YogaStudio({ ageGroup, onUnlockBadge, onAddMinutes, language }: YogaProps) {
  const [activePose, setActivePose] = useState<YogaPose | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  
  // Timer States
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Filter to matching postures
  const defaultGroupPoses = YOGA_POSES.filter((pose) => {
    // If we want to show all but prioritize, let's filter by the target ID tags
    if (ageGroup === 'teen') return pose.id.startsWith('teen');
    if (ageGroup === 'young') return pose.id.startsWith('young');
    if (ageGroup === 'professional') return pose.id.startsWith('prof');
    return pose.id.startsWith('mature');
  });

  const filteredPoses = defaultGroupPoses.filter((pose) => {
    if (difficultyFilter === 'All') return true;
    return pose.difficulty === difficultyFilter;
  });

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      setSessionCompleted(true);
      if (activePose) {
        onAddMinutes(activePose.duration);
        // Unlock badge based on pose type
        onUnlockBadge(`yoga-${activePose.id}`);
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining, activePose]);

  const handleStartTimer = (pose: YogaPose) => {
    setActivePose(pose);
    setSecondsRemaining(pose.duration * 60); // Convert mins to absolute seconds
    setTimerRunning(true);
    setSessionCompleted(false);
  };

  const handlePause = () => setTimerRunning(false);
  const handleResume = () => setTimerRunning(true);
  const handleReset = () => {
    setTimerRunning(false);
    if (activePose) {
      setSecondsRemaining(activePose.duration * 60);
    }
  };

  const formatTime = (secs: number) => {
    const minStr = Math.floor(secs / 60).toString().padStart(2, '0');
    const secStr = (secs % 60).toString().padStart(2, '0');
    return `${minStr}:${secStr}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Catalog view */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <span>🧘‍♀️</span> {t('yoga.title', language) || 'Age-Smart Yoga Studio'}
            </h2>
            <p className="text-xs text-slate-500">{t('yoga.subtitle', language)}: <span className="font-bold text-slate-700 capitalize">{ageGroup}</span></p>
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Beginner', 'Intermediate'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficultyFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none transition ${
                  difficultyFilter === lvl
                    ? 'bg-white shadow-sm text-indigo-750'
                    : 'text-slate-600 hover:text-slate-850'
                }`}
              >
                {lvl === 'All' ? 'All' : lvl === 'Beginner' ? (t('yoga.difficulty_beginner', language) || 'Beginner') : (t('yoga.difficulty_inter', language) || 'Intermediate')}
              </button>
            ))}
          </div>
        </div>

        {/* Poses list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPoses.map((pose) => (
            <div key={pose.id} className="bg-white border rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-2xl mb-3 block">{pose.imagePlaceholder.split(' ')[0]}</span>
                <h3 className="font-bold text-slate-900 leading-snug">{pose.title}</h3>
                <p className="text-xs italic text-slate-500 font-serif mb-3">{t('yoga.sansk', language)}: {pose.sanskritName}</p>

                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-indigo-50 text-indigo-800 rounded font-mono">
                    {pose.duration} {t('yoga.duration', language) || 'mins'}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-slate-150 text-slate-700 rounded font-mono">
                    {t('yoga.difficulty', language) || 'Difficulty'}: {pose.difficulty}
                  </span>
                </div>

                <ul className="text-xs text-slate-600 space-y-1 mb-4">
                  {pose.benefits.slice(0, 2).map((b, idx) => (
                    <li key={idx} className="flex gap-1.5 list-none">
                      <span className="text-indigo-500 font-bold shrink-0">✔</span>
                      <span className="line-clamp-1">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStartTimer(pose)}
                  className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> {t('yoga.start_pose', language)}
                </button>
                <button
                  onClick={() => {
                    setActivePose(pose);
                    setSessionCompleted(false);
                    setTimerRunning(false);
                  }}
                  className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-750 rounded-xl transition text-xs font-semibold"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Session & Guides panel */}
      <div className="lg:col-span-5 space-y-6">
        {activePose ? (
          <div className="bg-white border rounded-2xl p-6 shadow-sm relative overflow-hidden">
            {/* Background timer graphic */}
            <div className="text-center pb-6 border-b">
              <span className="text-4xl block mb-2">{activePose.imagePlaceholder.split(' ')[0]}</span>
              <p className="text-xs uppercase font-extrabold text-slate-400 font-mono tracking-wider">{activePose.title}</p>
              
              {/* Timer graphic */}
              <div className="my-6 text-5xl font-black font-mono tracking-tight text-indigo-950">
                {formatTime(secondsRemaining)}
              </div>

              {/* Timer controls */}
              <div className="flex justify-center gap-3">
                {timerRunning ? (
                  <button
                    onClick={handlePause}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-750 rounded-full transition"
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    disabled={sessionCompleted}
                    className="p-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-full transition disabled:opacity-50"
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-full transition"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {sessionCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-center space-y-3"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-emerald-950 text-sm">Session Complete! +{activePose.duration} mins</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Congratulations! You aligned with nature's rhythm. Badge unlocked and logged to your progress dashboard.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-800">
                  <Award className="w-4 h-4" /> Badge Unlocked: {activePose.title}
                </div>
              </motion.div>
            ) : (
              <div className="mt-6 space-y-5">
                {/* Steps */}
                <div>
                  <h4 className="font-semibold text-slate-950 text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" /> Pose Guidelines
                  </h4>
                  <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-1.5">
                    {activePose.instructions.map((stepStr, i) => (
                      <li key={i} className="leading-relaxed">{stepStr}</li>
                    ))}
                  </ol>
                </div>

                {/* Injury Modifications */}
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-2.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-amber-955">Prudent Modification</h5>
                    <ul className="list-disc pl-4 text-[11px] text-amber-800 leading-relaxed space-y-0.5 mt-1">
                      {activePose.modifications.map((mod, i) => (
                        <li key={i}>{mod}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-8 shadow-sm text-center border-dashed">
            <BookOpen className="w-10 h-10 text-slate-350 mx-auto mb-3" />
            <p className="text-xs font-medium text-slate-500">No active pose selected.</p>
            <p className="text-[10px] text-slate-400 mt-1">Select "Start Practice" or check its catalog details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
