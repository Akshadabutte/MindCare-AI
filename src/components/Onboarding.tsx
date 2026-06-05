import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, AgeGroup } from '../types';
import { User, Shield, Compass, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('');
  const [ageRaw, setAgeRaw] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [profession, setProfession] = useState('');
  const [language, setLanguage] = useState('English');
  const [step, setStep] = useState(1);

  const determineAgeGroup = (ageNum: number): AgeGroup => {
    if (ageNum >= 13 && ageNum <= 18) return 'teen';
    if (ageNum >= 19 && ageNum <= 25) return 'young';
    if (ageNum >= 26 && ageNum <= 35) return 'professional';
    return 'mature';
  };

  const concernsList = [
    'Academic stress & exams',
    'Career anxiety & stagnation',
    'Social pressure & self-esteem',
    'Postural fatigue & laptop huncing',
    'Digital burnout & overload',
    'Insomnia & sleep disruptions',
    'Family caregiving & relationships',
    'Finding life peace & legacy',
    'Anxiety & mood fluctuations'
  ];

  const handleNext = () => {
    if (step === 1 && (!name || !ageRaw)) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleToggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(ageRaw) || 25;
    const resolvedAgeGroup = determineAgeGroup(ageNum);

    const profile: UserProfile = {
      name,
      age: ageNum,
      ageGroup: resolvedAgeGroup,
      concerns: selectedConcerns,
      profession: resolvedAgeGroup === 'teen' ? 'Student' : profession,
      language,
      onboarded: true,
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full flex">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">MindCare AI</h1>
              <p className="text-xs text-slate-500 font-mono">Indian Knowledge & Modern Clinical Support</p>
            </div>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Svasthya (Well-being)</h2>
              <p className="text-slate-600 mb-6">
                Let's customize your healing dashboard. Tell us briefly about yourself to load matching yoga, Ayurvedic insights, and clinical guides.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-500" />
                    How should we call you?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                    <input
                      type="number"
                      value={ageRaw}
                      onChange={(e) => setAgeRaw(e.target.value)}
                      placeholder="e.g. 28"
                      min="13"
                      max="110"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-850 bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Marathi">मराठी (Marathi)</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Bengali">বাংলা (Bengali)</option>
                    </select>
                  </div>
                </div>

                {parseInt(ageRaw) >= 19 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Profession / Lifestage</label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="e.g. Software Engineer, Homemaker, Senior Student"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-850"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!name || !ageRaw}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">What is on your mind?</h2>
              <p className="text-slate-600 mb-6">
                Select your primary mental, physical, or academic challenges. These trigger customized routines and support modules.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {concernsList.map((concern) => {
                  const isSelected = selectedConcerns.includes(concern);
                  return (
                    <button
                      type="button"
                      key={concern}
                      onClick={() => handleToggleConcern(concern)}
                      className={`text-left p-3 rounded-xl border transition ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-sm line-clamp-1">{concern}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedConcerns.length === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Private & Encrypted</h2>
                <p className="text-slate-600">
                  Your journaling, scores, and personal reflections are stored securely in local storage. Clinical chatbot proxies ensure complete medical privacy.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-3 text-sm text-slate-600">
                <div className="flex gap-2">
                  <span className="text-indigo-500">✔</span>
                  <p><strong>Strict clinical safety</strong>: A persistent SOS alarm is always reachable on any module.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-indigo-500">✔</span>
                  <p><strong>IKS integration</strong>: Seamlessly access curated yogic scripts & Ayurvedic lifestyles.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-indigo-500">✔</span>
                  <p><strong>Clinical checks</strong>: PHQ-9 & GAD-7 assessments automatically map progress levels with exports to professionals.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-650 hover:bg-emerald-705 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  Enter MindCare AI
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
