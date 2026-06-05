import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, MoodEntry, JournalEntry, HealthMetric, AssessmentResult } from './types';
import { t } from './utils/translations';

// Importing components
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import Journal from './components/Journal';
import AssessmentScreening from './components/AssessmentScreening';
import YogaStudio from './components/YogaStudio';
import MeditationLibrary from './components/MeditationLibrary';
import TherapistDirectory from './components/TherapistDirectory';
import CrisisSupport from './components/CrisisSupport';
import ProgressCenter from './components/ProgressCenter';
import HealthTracker from './components/HealthTracker';
import ResourcesHub from './components/ResourcesHub';

// Icons
import { 
  Heart, Home, MessageSquare, BookOpen, Clipboard, Activity, Compass, 
  Users, AlertOctagon, Trophy, Settings, LogOut, ShieldAlert, HeartPulse 
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Histories log state
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);

  // Badges & Streaks
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['init-onboard']);
  const [totalMeditationMins, setTotalMeditationMins] = useState<number>(0);
  const [streaks, setStreaks] = useState({
    mood: 0,
    meditation: 0,
    yoga: 0,
    journal: 0
  });

  // Local Storage Synchronization on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mindcare_profile');
    if (savedUser) {
      try {
        setProfile(JSON.parse(savedUser));
      } catch (e) {
        console.error("Local profile corrupted", e);
      }
    }

    const savedMoods = localStorage.getItem('mindcare_moods');
    if (savedMoods) setMoodHistory(JSON.parse(savedMoods));

    const savedJournals = localStorage.getItem('mindcare_journals');
    if (savedJournals) setJournalEntries(JSON.parse(savedJournals));

    const savedHealth = localStorage.getItem('mindcare_health');
    if (savedHealth) setHealthMetrics(JSON.parse(savedHealth));

    const savedAssess = localStorage.getItem('mindcare_assessments');
    if (savedAssess) setAssessmentResults(JSON.parse(savedAssess));

    const savedBadges = localStorage.getItem('mindcare_badges');
    if (savedBadges) setUnlockedBadges(JSON.parse(savedBadges));

    const savedMins = localStorage.getItem('mindcare_med_mins');
    if (savedMins) setTotalMeditationMins(parseInt(savedMins) || 0);

    const savedStreaks = localStorage.getItem('mindcare_streaks');
    if (savedStreaks) setStreaks(JSON.parse(savedStreaks));
  }, []);

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('mindcare_profile', JSON.stringify(newProfile));
  };

  const handleAddMood = (entry: MoodEntry) => {
    const updated = [...moodHistory, entry];
    setMoodHistory(updated);
    localStorage.setItem('mindcare_moods', JSON.stringify(updated));
  };

  const handleAddJournal = (entry: JournalEntry) => {
    const updated = [...journalEntries, entry];
    setJournalEntries(updated);
    localStorage.setItem('mindcare_journals', JSON.stringify(updated));

    // Handle unlocking badge for first journal
    if (!unlockedBadges.includes('journal-first')) {
      handleUnlockBadge('journal-first');
    }

    // Increase journal streak
    setStreaks(prev => {
      const next = { ...prev, journal: prev.journal + 1 };
      localStorage.setItem('mindcare_streaks', JSON.stringify(next));
      return next;
    });
  };

  const handleAddHealth = (met: HealthMetric) => {
    const updated = [...healthMetrics, met];
    setHealthMetrics(updated);
    localStorage.setItem('mindcare_health', JSON.stringify(updated));
  };

  const handleAddAssessment = (res: AssessmentResult) => {
    const updated = [...assessmentResults, res];
    setAssessmentResults(updated);
    localStorage.setItem('mindcare_assessments', JSON.stringify(updated));

    // Suicidal warning triggers alert redirect to SOS support automatically!
    if (res.riskLevel === 'Severe') {
      setActiveTab('crisis');
      // Unlock emergency anchor badge
      if (!unlockedBadges.includes('SOS-survivor')) {
        handleUnlockBadge('SOS-survivor');
      }
    }
  };

  const handleUnlockBadge = (badgeCode: string) => {
    if (!unlockedBadges.includes(badgeCode)) {
      const updated = [...unlockedBadges, badgeCode];
      setUnlockedBadges(updated);
      localStorage.setItem('mindcare_badges', JSON.stringify(updated));
    }
  };

  const handleAddMinutes = (mins: number) => {
    const total = totalMeditationMins + mins;
    setTotalMeditationMins(total);
    localStorage.setItem('mindcare_med_mins', total.toString());
  };

  const handleIncrementMeditationStreak = () => {
    setStreaks(prev => {
      const next = { ...prev, meditation: prev.meditation + 1 };
      localStorage.setItem('mindcare_streaks', JSON.stringify(next));
      return next;
    });
    if (!unlockedBadges.includes('med-first')) {
      handleUnlockBadge('med-first');
    }
  };

  const handleIncrementYogaStreak = () => {
    setStreaks(prev => {
      const next = { ...prev, yoga: prev.yoga + 1 };
      localStorage.setItem('mindcare_streaks', JSON.stringify(next));
      return next;
    });
    if (!unlockedBadges.includes('yoga-first')) {
      handleUnlockBadge('yoga-first');
    }
  };

  const handleUpdateMoodStreak = () => {
    setStreaks(prev => {
      const next = { ...prev, mood: prev.mood + 1 };
      localStorage.setItem('mindcare_streaks', JSON.stringify(next));
      return next;
    });
  };

  const handleLogoutOnboarding = () => {
    setShowResetConfirm(true);
  };

  const confirmLogoutOnboarding = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("Storage clearing restricted in sandboxed Frame:", e);
    }
    setProfile(null);
    setMoodHistory([]);
    setJournalEntries([]);
    setHealthMetrics([]);
    setAssessmentResults([]);
    setUnlockedBadges(['init-onboard']);
    setStreaks({ mood: 0, meditation: 0, yoga: 0, journal: 0 });
    setTotalMeditationMins(0);
    setActiveTab('dashboard');
    setShowResetConfirm(false);
  };

  // Safe navigation mapping
  const onNavigateToCrisis = () => {
    setActiveTab('crisis');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Onboarding onComplete={handleCompleteOnboarding} />
      </div>
    );
  }

  // Dashboard Nav Links
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard', profile.language), icon: Home },
    { id: 'chat', label: t('nav.chat', profile.language), icon: MessageSquare },
    { id: 'journal', label: t('nav.journal', profile.language), icon: BookOpen },
    { id: 'assessment', label: t('nav.assessment', profile.language), icon: Clipboard },
    { id: 'yoga', label: t('nav.yoga', profile.language), icon: Activity },
    { id: 'meditation', label: t('nav.meditation', profile.language), icon: Compass },
    { id: 'therapists', label: t('nav.therapists', profile.language), icon: Users },
    { id: 'health', label: t('nav.health', profile.language), icon: HeartPulse },
    { id: 'resources', label: t('nav.resources', profile.language), icon: Trophy },
    { id: 'progress', label: t('nav.progress', profile.language), icon: Trophy },
    { id: 'crisis', label: t('nav.crisis', profile.language), icon: AlertOctagon, urgent: true }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D312E] flex flex-col lg:flex-row">
      
      {/* Visual Navigation Sidebar */}
      <aside className="w-full lg:w-72 bg-[#F2EDE4] border-r border-[#E5E0D5] shrink-0 flex flex-col justify-between">
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#4A5D4E] rounded-xl text-white shadow-sm">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2D312E] font-serif tracking-tight leading-tight">MindCare AI</h1>
              <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-[#4A5D4E] bg-white/60 border border-[#E5E0D5]/50 px-1.5 py-0.5 rounded-full">
                {profile.language} {t('nav.edition', profile.language)}
              </span>
            </div>
          </div>

          {/* Quick Profile Overview */}
          <div className="p-3 bg-white/50 rounded-2xl border border-[#E5E0D5] flex items-center justify-between text-xs font-medium">
            <div className="space-y-0.5">
              <p className="font-bold text-[#2D312E] leading-none">{profile.name}</p>
              <p className="text-[10px] text-[#5A605B] capitalize font-mono">{profile.ageGroup} {t('nav.profile', profile.language)}</p>
            </div>
            <button
               id="btn-trigger-reset"
              onClick={handleLogoutOnboarding}
              className="p-1.5 hover:bg-[#EAE4D9] rounded text-[#5A605B]"
              title="Reset Profile"
            >
              <LogOut className="w-4 h-4 text-[#5A605B] hover:text-[#E57373]" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition focus:outline-none ${
                    active
                      ? item.urgent 
                        ? 'bg-[#E57373] font-bold text-white shadow-md shadow-red-200/50' 
                        : 'bg-[#4A5D4E] font-medium text-white shadow-sm'
                      : item.urgent 
                        ? 'text-[#E57373] bg-red-50/50 hover:bg-[#E57373] hover:text-white border border-[#E57373]/20 font-bold' 
                        : 'text-[#5A605B] hover:bg-[#EAE4D9]/80 hover:text-[#2D312E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.urgent && !active && (
                    <span className="h-2 w-2 bg-[#E57373] rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Client-Side Security indicator */}
        <div className="p-4 px-6 border-t border-[#E5E0D5] font-mono text-[9px] text-[#5A605B]/70 space-y-1">
          <p className="flex items-center gap-1">{t('nav.security', profile.language)}</p>
          <p>{t('nav.copyright', profile.language)}</p>
        </div>
      </aside>

      {/* Main Display Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full bg-[#FDFBF7]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.16 }}
            className="space-y-6"
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                profile={profile}
                moodHistory={moodHistory}
                onAddMood={handleAddMood}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onUpdateStreaks={handleUpdateMoodStreak}
                language={profile.language}
              />
            )}

            {activeTab === 'chat' && (
              <Chatbot
                ageGroup={profile.ageGroup}
                userName={profile.name}
                language={profile.language}
                onNavigateToSOS={onNavigateToCrisis}
              />
            )}

            {activeTab === 'journal' && (
              <Journal
                ageGroup={profile.ageGroup}
                entries={journalEntries}
                onAddEntry={handleAddJournal}
                language={profile.language}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentScreening
                results={assessmentResults}
                onAddResult={handleAddAssessment}
                onNavigateToSOS={onNavigateToCrisis}
                language={profile.language}
              />
            )}

            {activeTab === 'yoga' && (
              <YogaStudio
                ageGroup={profile.ageGroup}
                onUnlockBadge={handleUnlockBadge}
                onAddMinutes={handleAddMinutes}
                language={profile.language}
              />
            )}

            {activeTab === 'meditation' && (
              <MeditationLibrary
                ageGroup={profile.ageGroup}
                onAddMinutes={handleAddMinutes}
                onIncrementMedStreak={handleIncrementMeditationStreak}
                language={profile.language}
              />
            )}

            {activeTab === 'therapists' && (
              <TherapistDirectory
                onBookConfirmed={(tn, sl) => alert(`Consultation scheduled with ${tn} on ${sl}. Link is generated and stored.`)}
                resultsSharedCount={assessmentResults.length}
                language={profile.language}
              />
            )}

            {activeTab === 'health' && (
              <HealthTracker
                metricsList={healthMetrics}
                onAddMetric={handleAddHealth}
                language={profile.language}
              />
            )}

            {activeTab === 'resources' && (
              <ResourcesHub
                ageGroup={profile.ageGroup}
                language={profile.language}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressCenter
                streaks={streaks}
                totalMins={totalMeditationMins}
                unlockedBadges={unlockedBadges}
                language={profile.language}
              />
            )}

            {activeTab === 'crisis' && (
              <CrisisSupport language={profile.language} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern, state-based, non-blocking Profile Reset Dialogue Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              id="logout-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl border border-[#E5E0D5] relative z-10 space-y-6"
              id="logout-modal-content"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-500 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 font-serif" id="logout-modal-title">
                    {t('nav.signout_title', profile.language)}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal" id="logout-modal-description">
                    {t('nav.signout_desc', profile.language)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  id="btn-cancel-logout"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition"
                >
                  {t('nav.signout_cancel', profile.language)}
                </button>
                <button
                  type="button"
                  id="btn-confirm-logout"
                  onClick={confirmLogoutOnboarding}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200 text-center transition"
                >
                  {t('nav.signout_confirm', profile.language)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
