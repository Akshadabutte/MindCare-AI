import { useState } from 'react';
import { motion } from 'motion/react';
import { HealthMetric } from '../types';
import { Activity, Beaker, Moon, Smartphone, Footprints, AlertTriangle, CheckCircle, BarChart3, Plus, ShieldCheck } from 'lucide-react';
import { t } from '../utils/translations';

interface MetricProps {
  metricsList: HealthMetric[];
  onAddMetric: (met: HealthMetric) => void;
  language: string;
}

export default function HealthTracker({ metricsList, onAddMetric, language }: MetricProps) {
  // Current Day Log State
  const [sleep, setSleep] = useState(7);
  const [water, setWater] = useState(1500); // in ml
  const [screen, setScreen] = useState(240); // in mins
  const [steps, setSteps] = useState(6000);
  const [activeMins, setActiveMins] = useState(25);
  const [stress, setStress] = useState(5); // 1 to 10
  const [painArea, setPainArea] = useState<'None' | 'Headache' | 'Neck Hunch' | 'Lower Back Tension' | 'Wrist Soreness'>('None');
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSaveMetrics = () => {
    const data: HealthMetric = {
      date: new Date().toLocaleDateString(),
      sleepHours: sleep,
      waterIntake: water,
      screenTime: screen,
      stepCount: steps,
      activeMinutes: activeMins,
      stressLevel: stress
    };

    onAddMetric(data);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
    }, 4000);

    // If screen limits or sleep hours are extreme, trigger warning banner!
    if (screen > 450 || sleep < 5.5) {
      setAlertOpen(true);
    } else {
      setAlertOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Visual Form Inputs */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-1.5">
            <Activity className="w-5.5 h-5.5 text-indigo-650" /> {t('habit.tracker_title', language) || 'Wellness & Physical Tracker'}
          </h2>
          <p className="text-xs text-slate-500">{t('habit.tracker_subtitle', language) || 'Log core physiological metrics to correlate physical habits with mental stress cycles.'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sleep hours */}
          <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-455 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-purple-600" /> {t('habit.sleep', language) || 'Sleep Hours'}
            </label>
            <div className="flex items-center justify-between">
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-2/3 h-1.5 accent-indigo-600"
              />
              <span className="font-mono font-extrabold text-sm text-slate-800">{sleep} {t('yoga.hours', language) || 'Hrs'}</span>
            </div>
          </div>

          {/* Water Intake */}
          <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-455 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Beaker className="w-4 h-4 text-sky-600" /> {t('habit.water', language) || 'Hydration Intake'}
            </label>
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setWater(Math.max(250, water - 250))}
                  className="w-8 h-8 rounded bg-slate-200 text-xs font-bold hover:bg-slate-300"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setWater(water + 250)}
                  className="w-8 h-8 rounded bg-slate-200 text-xs font-bold hover:bg-slate-300"
                >
                  +
                </button>
              </div>
              <span className="font-mono font-extrabold text-sm text-slate-800">{water} ml</span>
            </div>
          </div>

          {/* Screen Time Limit */}
          <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-455 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-rose-500" /> {t('habit.screen', language) || 'Computer Screen Time'}
            </label>
            <div className="flex items-center justify-between">
              <input
                type="range"
                min="30"
                max="720"
                step="30"
                value={screen}
                onChange={(e) => setScreen(parseInt(e.target.value))}
                className="w-2/3 h-1.5 accent-indigo-600"
              />
              <span className="font-mono font-extrabold text-sm text-slate-800">{Math.floor(screen / 60)}h {screen % 60}m</span>
            </div>
          </div>

          {/* Step Count */}
          <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-455 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-600" /> {t('habit.steps', language) || 'Step Counter'}
            </label>
            <div className="flex items-center justify-between gap-2">
              <input
                type="number"
                value={steps}
                step="500"
                onChange={(e) => setSteps(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-2/3 px-2 py-1 bg-white border text-xs rounded font-mono font-bold text-slate-800"
              />
              <span className="font-mono text-slate-400 text-xs shrink-0">{t('dashboard.counter_steps', language) || 'Steps'}</span>
            </div>
          </div>
        </div>

        {/* Postural Pain map */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-455 uppercase font-mono tracking-wider flex items-center gap-1">📍 {t('habit.pain_area', language) || 'Postural Tension Hotspots'}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(['None', 'Headache', 'Neck Hunch', 'Lower Back Tension', 'Wrist Soreness'] as const).map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setPainArea(area)}
                className={`p-2.5 rounded-xl border text-xs text-left font-semibold focus:outline-none transition ${
                  painArea === area
                    ? 'bg-rose-50 border-rose-455 text-rose-900 shadow-sm'
                    : 'bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {area === 'None' ? (t('habit.none', language) || 'No Pain / Fluid Flow') : area}
              </button>
            ))}
          </div>
        </div>

        {/* Realtime Stress Level slider */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between items-center text-xs font-bold">
            <label className="text-slate-455 uppercase font-mono tracking-wider">{t('habit.stress_level', language) || 'Current Daily Stress Rating'}</label>
            <span className="text-indigo-850 font-mono font-extrabold text-sm">{stress} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={stress}
            onChange={(e) => setStress(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-650"
          />
          <div className="flex justify-between font-mono text-[9px] text-slate-400 uppercase">
            <span>{t('habit.stress_low', language) || 'Absolute Serenity'}</span>
            <span>{t('habit.stress_med', language) || 'Balanced Space'}</span>
            <span>{t('habit.stress_high', language) || 'Overwhelming Crisis'}</span>
          </div>
        </div>

        <button
          onClick={handleSaveMetrics}
          className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 animate-pulse" /> {t('habit.save_log', language) || 'Log Daily Metrics'}
        </button>

        {successSaved && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-150 rounded-xl text-center text-xs text-emerald-850 font-medium flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> {t('habit.saved_ok', language) || "Day's wellness metrics logged perfectly to dashboard charts!"}
          </div>
        )}
      </div>

      {/* Physiological alerts and logs */}
      <div className="lg:col-span-5 space-y-6">
        {/* Dynamic Alerts */}
        {alertOpen && (
          <div className="bg-amber-50 border border-amber-250 p-5 rounded-2xl shadow-sm text-amber-955 space-y-1">
            <div className="flex gap-2 items-start text-amber-600 font-extrabold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-xs uppercase font-extrabold font-mono tracking-wider mt-0.5">{t('habit.somatic_alert', language) || 'Physical Safety Nudge'}</h4>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed pt-2">
              {t('habit.warning_screening', language) || 'Our physiological engine notices heavy desk screen-exposure durations paired with restricted sleep pools. This triggers cumulative cortisol spikes.'}
            </p>
          </div>
        )}

        {/* Charting Snapshot */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2">
            <BarChart3 className="w-4.5 h-4.5 text-indigo-650" /> {t('habit.historical_logs', language) || 'Wellness Log Summary'} ({metricsList.length})
          </h3>

          {metricsList.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-10 h-10 text-slate-350 mx-auto mb-2" />
              <p className="text-xs text-slate-455 font-medium">{t('habit.no_logs', language) || 'Daily log summary is vacant.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase text-slate-400 font-extrabold tracking-wider">Historical Logs Trajectory:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {metricsList.slice().reverse().map((met, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-black font-mono text-[10px] text-slate-400">{met.date}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Water: {met.waterIntake}ml • Steps: {met.stepCount}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-rose-700">Stress: {met.stressLevel}/10</span>
                        <p className="text-[10px] text-slate-650 mt-0.5 font-medium">Sleep: {met.sleepHours}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border rounded-xl text-[11px] text-indigo-900 leading-normal flex gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Health Correlation Engine</strong>: High water levels ({water}ml) generally neutralize tension headache alerts, and regular post-lunch step blocks release professional workspace anxiety loops.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
