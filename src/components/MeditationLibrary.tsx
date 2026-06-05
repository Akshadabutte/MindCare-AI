import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MEDITATION_TRACKS } from '../data';
import { MeditationTrack, AgeGroup } from '../types';
import { Volume2, Play, Pause, RotateCcw, Compass, Sun, Moon, Sparkles, Sliders, CheckCircle, Flame, Heart } from 'lucide-react';
import { t } from '../utils/translations';

interface MeditationProps {
  ageGroup: AgeGroup;
  onAddMinutes: (mins: number) => void;
  onIncrementMedStreak: () => void;
  language: string;
}

export default function MeditationLibrary({ ageGroup, onAddMinutes, onIncrementMedStreak, language }: MeditationProps) {
  const [selectedTrack, setSelectedTrack] = useState<MeditationTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [durationDone, setDurationDone] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Sound configs
  const [ambientSound, setAmbientSound] = useState<'None' | 'Vedic Om' | 'Soft Rain' | 'Binaural Beats'>('None');
  const [volume, setVolume] = useState<number>(60);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [isHapticSupported, setIsHapticSupported] = useState<boolean>(false);

  // Breathing pacer states (Pranayama)
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldOut'>('Inhale');
  const [breathSec, setBreathSec] = useState(4);
  const [pacerActive, setPacerActive] = useState(false);
  const [pacerType, setPacerType] = useState<'SamaVritti' | '478'>('SamaVritti');

  // Web Audio Context & Node Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{
    oscillators: OscillatorNode[];
    sources: AudioBufferSourceNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
    lfos: OscillatorNode[];
  }>({
    oscillators: [],
    sources: [],
    gains: [],
    filters: [],
    lfos: []
  });

  // Verify Haptic support status on initial mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      setIsHapticSupported(true);
    }
  }, []);

  const getAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtxClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const stopAllAmbientSounds = () => {
    soundNodesRef.current.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e){}
      try { osc.disconnect(); } catch(e){}
    });
    soundNodesRef.current.sources.forEach(src => {
      try { src.stop(); } catch(e){}
      try { src.disconnect(); } catch(e){}
    });
    soundNodesRef.current.lfos.forEach(lfo => {
      try { lfo.stop(); } catch(e){}
      try { lfo.disconnect(); } catch(e){}
    });
    soundNodesRef.current.gains.forEach(g => {
      try { g.disconnect(); } catch(e){}
    });
    soundNodesRef.current.filters.forEach(f => {
      try { f.disconnect(); } catch(e){}
    });

    soundNodesRef.current = {
      oscillators: [],
      sources: [],
      gains: [],
      filters: [],
      lfos: []
    };
  };

  // 🕉️ "Vedic Om" Synthesis: Programmatic warm hum + spatial sweeping filter
  const playVedicOm = () => {
    const audioCtx = getAudioContext();
    stopAllAmbientSounds();

    const mainGain = audioCtx.createGain();
    const targetVolume = (volume / 100) * 0.45;
    mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
    mainGain.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + 1.2);
    mainGain.connect(audioCtx.destination);
    soundNodesRef.current.gains.push(mainGain);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);
    filter.Q.setValueAtTime(3, audioCtx.currentTime);
    filter.connect(mainGain);
    soundNodesRef.current.filters.push(filter);

    // 68.05 Hz Sub-bass (half of Cosmic Ohm 136.1Hz for grounding hum)
    const oscSub = audioCtx.createOscillator();
    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(68.05, audioCtx.currentTime);
    const gainSub = audioCtx.createGain();
    gainSub.gain.setValueAtTime(0.3, audioCtx.currentTime);
    oscSub.connect(gainSub);
    gainSub.connect(filter);
    oscSub.start(0);
    soundNodesRef.current.oscillators.push(oscSub);
    soundNodesRef.current.gains.push(gainSub);

    // 136.1 Hz Main Ohm frequency (Anahata frequency)
    const oscMain = audioCtx.createOscillator();
    oscMain.type = 'sine';
    oscMain.frequency.setValueAtTime(136.1, audioCtx.currentTime);
    const gainMain = audioCtx.createGain();
    gainMain.gain.setValueAtTime(0.45, audioCtx.currentTime);
    oscMain.connect(gainMain);
    gainMain.connect(filter);
    oscMain.start(0);
    soundNodesRef.current.oscillators.push(oscMain);
    soundNodesRef.current.gains.push(gainMain);

    // 272.2 Hz Harmonic sheen (double of Ohm)
    const oscHarm = audioCtx.createOscillator();
    oscHarm.type = 'sawtooth';
    oscHarm.frequency.setValueAtTime(272.2, audioCtx.currentTime);
    const gainHarm = audioCtx.createGain();
    gainHarm.gain.setValueAtTime(0.04, audioCtx.currentTime);
    oscHarm.connect(gainHarm);
    gainHarm.connect(filter);
    oscHarm.start(0);
    soundNodesRef.current.oscillators.push(oscHarm);
    soundNodesRef.current.gains.push(gainHarm);

    // LFO to sweep filter cutoff back and forth - creating the "waving sound"
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // 0.12Hz slow sweep
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(130, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(0);
    soundNodesRef.current.lfos.push(lfo);
    soundNodesRef.current.gains.push(lfoGain);

    triggerPhysicalVibrationPulse([120, 80, 120]);
  };

  // 🌧️ "Soft Rain" Synthesis: White noise + modulated low-pass filter to simulate wind/water waves
  const playSoftRain = () => {
    const audioCtx = getAudioContext();
    stopAllAmbientSounds();

    const mainGain = audioCtx.createGain();
    const targetVolume = (volume / 100) * 0.35;
    mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
    mainGain.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + 1.2);
    mainGain.connect(audioCtx.destination);
    soundNodesRef.current.gains.push(mainGain);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.2, audioCtx.currentTime);
    filter.connect(mainGain);
    soundNodesRef.current.filters.push(filter);

    // Generate procedural white/pink noise buffer
    const bufferSize = audioCtx.sampleRate * 2.5; // 2.5s buffer
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = buffer;
    noiseSrc.loop = true;
    noiseSrc.connect(filter);
    noiseSrc.start(0);
    soundNodesRef.current.sources.push(noiseSrc);

    // Sweep filter to simulate ocean wind or rain gusts
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.09, audioCtx.currentTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(260, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(0);
    soundNodesRef.current.lfos.push(lfo);
    soundNodesRef.current.gains.push(lfoGain);

    triggerPhysicalVibrationPulse([80, 40, 80]);
  };

  // 🎧 "Binaural Beats" Synthesis: 200Hz Left / 206Hz Right to create a 6Hz Theta Brainwave
  const playBinauralBeats = () => {
    const audioCtx = getAudioContext();
    stopAllAmbientSounds();

    const mainGain = audioCtx.createGain();
    const targetVolume = (volume / 100) * 0.45;
    mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
    mainGain.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + 1.2);
    mainGain.connect(audioCtx.destination);
    soundNodesRef.current.gains.push(mainGain);

    // Left oscillator (carrier at 200 Hz)
    const oscL = audioCtx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(200, audioCtx.currentTime);

    if (audioCtx.createStereoPanner) {
      const pannerL = audioCtx.createStereoPanner();
      pannerL.pan.setValueAtTime(-1, audioCtx.currentTime);
      oscL.connect(pannerL);
      pannerL.connect(mainGain);
      soundNodesRef.current.filters.push(pannerL);
    } else {
      oscL.connect(mainGain);
    }
    oscL.start(0);
    soundNodesRef.current.oscillators.push(oscL);

    // Right oscillator (theta shift at 206 Hz)
    const oscR = audioCtx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(206, audioCtx.currentTime);

    if (audioCtx.createStereoPanner) {
      const pannerR = audioCtx.createStereoPanner();
      pannerR.pan.setValueAtTime(1, audioCtx.currentTime);
      oscR.connect(pannerR);
      pannerR.connect(mainGain);
      soundNodesRef.current.filters.push(pannerR);
    } else {
      oscR.connect(mainGain);
    }
    oscR.start(0);
    soundNodesRef.current.oscillators.push(oscR);

    triggerPhysicalVibrationPulse([140, 100, 140]);
  };

  // Dynamic Volume adjuster
  useEffect(() => {
    soundNodesRef.current.gains.forEach((g, index) => {
      if (index === 0 && audioContextRef.current) {
        const coef = ambientSound === 'Soft Rain' ? 0.35 : 0.45;
        const targetValue = (volume / 100) * coef;
        g.gain.linearRampToValueAtTime(targetValue, audioContextRef.current.currentTime + 0.15);
      }
    });
  }, [volume, ambientSound]);

  // Handle ambientSound changes
  useEffect(() => {
    if (ambientSound === 'None') {
      stopAllAmbientSounds();
    } else {
      try {
        if (ambientSound === 'Vedic Om') {
          playVedicOm();
        } else if (ambientSound === 'Soft Rain') {
          playSoftRain();
        } else if (ambientSound === 'Binaural Beats') {
          playBinauralBeats();
        }
      } catch (e) {
        console.warn("Audio synthesis missed startup", e);
      }
    }
    return () => {
      stopAllAmbientSounds();
    };
  }, [ambientSound]);

  const triggerPhysicalVibrationPulse = (pattern: number | number[]) => {
    if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe haptic fallback
      }
    }
  };

  const handleStartTrack = (track: MeditationTrack) => {
    setSelectedTrack(track);
    setSecondsRemaining(track.duration * 60);
    setDurationDone(0);
    setIsPlaying(true);
    setCompleted(false);

    // Automatically initialize audio context on user activation
    try {
      getAudioContext();
    } catch (e) {}
  };

  // Breathing pacer transition haptic feedback
  useEffect(() => {
    if (pacerActive) {
      triggerPhysicalVibrationPulse([100, 50, 100]);
    }
  }, [breathState, pacerActive]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    try {
      getAudioContext();
    } catch (e) {}
  };
  
  const handleTogglePacer = () => {
    const nextState = !pacerActive;
    setPacerActive(nextState);
    setBreathState('Inhale');
    setBreathSec(4);
    try {
      getAudioContext();
    } catch (e) {}
    if (nextState) {
      triggerPhysicalVibrationPulse([150, 80, 150]);
    }
  };

  // Filter track library
  const libraryTracks = MEDITATION_TRACKS.filter((track) => {
    if (ageGroup === 'teen') return track.id.startsWith('teen');
    if (ageGroup === 'young') return track.id.startsWith('young');
    if (ageGroup === 'professional') return track.id.startsWith('prof');
    return track.id.startsWith('mature');
  });

  // Track Timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
        setDurationDone((prev) => prev + 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isPlaying) {
      setIsPlaying(false);
      setCompleted(true);
      if (selectedTrack) {
        onAddMinutes(selectedTrack.duration);
        onIncrementMedStreak();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, secondsRemaining]);

  // Breathing Pacer cycle
  useEffect(() => {
    let timer: any = null;
    if (pacerActive) {
      timer = setInterval(() => {
        setBreathSec((prev) => {
          if (prev <= 1) {
            // Transition state
            if (pacerType === 'SamaVritti') {
              // 4s equal breathing (Box)
              if (breathState === 'Inhale') { setBreathState('Hold'); return 4; }
              if (breathState === 'Hold') { setBreathState('Exhale'); return 4; }
              if (breathState === 'Exhale') { setBreathState('HoldOut'); return 4; }
              setBreathState('Inhale'); return 4;
            } else {
              // 4-7-8 Pranayama
              if (breathState === 'Inhale') { setBreathState('Hold'); return 7; }
              if (breathState === 'Hold') { setBreathState('Exhale'); return 8; }
              setBreathState('Inhale'); return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pacerActive, breathState, pacerType]);

  const formatTime = (secs: number) => {
    const mm = Math.floor(secs / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Audio library */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-serif font-black text-[#2D312E] flex items-center gap-2">
            <span>✨</span> {t('zendo.title', language) || 'Zendo Meditation Sanctuary & Audio Room'}
          </h2>
          <p className="text-xs text-slate-600">{t('zendo.subtitle', language) || 'Tailored healing vibrations for'}: <span className="font-bold text-indigo-805 capitalize">{ageGroup}</span></p>
        </div>

        <div className="space-y-3">
          {libraryTracks.map((track) => {
            const isCurrent = selectedTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCurrent ? 'bg-indigo-50/70 border-indigo-300 shadow-sm' : 'bg-white hover:bg-slate-50 border-slate-150'
                }`}
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{track.title}</h3>
                  <p className="text-xs text-slate-455 font-semibold">{t('journal.latest_insight', language) || 'Narrated by'}: {track.narrator}</p>
                  <p className="text-xs text-slate-650 max-w-md">{track.description}</p>
                  {track.binauralFreq && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-wider bg-indigo-100/55 px-2 py-0.5 rounded mt-1.5">
                      🎧 {track.binauralFreq}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-455 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {track.duration} {t('yoga.duration', language) || 'mins'}
                  </span>

                  <button
                    onClick={() => handleStartTrack(track)}
                    className="p-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive players and breath counts */}
      <div className="lg:col-span-5 space-y-6">
        {/* Custom Audio Player */}
        {selectedTrack && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-center pb-5 border-b">
              <span className="text-3xl block mb-2">🧘‍♀️</span>
              <h4 className="font-bold text-slate-900 text-sm line-clamp-1 leading-snug">{selectedTrack.title}</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">Vibe: {selectedTrack.category}</p>

              <div className="my-5 text-4xl font-extrabold font-mono text-indigo-955">
                {formatTime(secondsRemaining)}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-full transition"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <button
                  onClick={() => setSecondsRemaining(selectedTrack.duration * 60)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {completed && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-center text-xs text-emerald-800 font-medium">
                ✔ {t('yoga.completed_yoga', language) || 'Meditation logged successfully!'}
              </div>
            )}
          </div>
        )}

        {/* Standalone Zendo Ambient Resonance & Vibrations (Always visible!) */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-2 border-b">
            <h4 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-650" /> {t('zendo.resonance_title', language) || 'Zendo Resonance & Vibrations'}
            </h4>
            <p className="text-[10px] text-slate-500">{t('zendo.resonance_desc', language)}</p>
          </div>

          {/* Sound choice buttons */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-455 uppercase font-mono tracking-wider">{t('zendo.select_wave', language) || 'Select Cosmic Soundwave'}</label>
            <div className="grid grid-cols-2 gap-2">
              {(['None', 'Vedic Om', 'Soft Rain', 'Binaural Beats'] as const).map((sound) => (
                <button
                  key={sound}
                  onClick={() => {
                    setAmbientSound(sound);
                    try {
                      getAudioContext();
                    } catch(e){}
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left flex flex-col justify-between h-15 focus:outline-none border transition ${
                    ambientSound === sound
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-700'
                  }`}
                >
                  <span>{sound}</span>
                  <span className="text-[9px] font-medium text-slate-400">
                    {sound === 'None' && (t('zendo.silence', language) || 'Silence')}
                    {sound === 'Vedic Om' && '136.1 Hz Cosmic Ohm'}
                    {sound === 'Soft Rain' && 'Hydic Ocean LFO Wave'}
                    {sound === 'Binaural Beats' && '6 Hz Theta Focus'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Wave visualizer & custom volume control */}
          {ambientSound !== 'None' && (
            <div className="space-y-3.5 pt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
              {/* Animated wave */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider font-mono">{t('zendo.vibr_field', language) || 'Vibration Field Active'}</span>
                <span className="flex h-2 w-2 rounded-full bg-red-455 animate-ping"></span>
              </div>
              <div className="flex items-end justify-center gap-1.5 h-7 px-4 bg-white/80 rounded-lg py-1 border border-indigo-100">
                <div className="w-1 bg-[#4A5D4E] rounded-full animate-bounce h-5" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></div>
                <div className="w-1 bg-indigo-500 rounded-full animate-bounce h-6" style={{ animationDelay: '0s', animationDuration: '0.4s' }}></div>
                <div className="w-1 bg-amber-500 rounded-full animate-bounce h-3" style={{ animationDelay: '0.3s', animationDuration: '0.7s' }}></div>
                <div className="w-1 bg-indigo-600 rounded-full animate-bounce h-7" style={{ animationDelay: '0s', animationDuration: '0.5s' }}></div>
                <div className="w-1 bg-indigo-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.4s', animationDuration: '0.8s' }}></div>
                <div className="w-1 bg-[#4A5D4E] rounded-full animate-bounce h-5" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }}></div>
                <div className="w-1 bg-amber-600 rounded-full animate-bounce h-2" style={{ animationDelay: '0.6s', animationDuration: '0.7s' }}></div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-bold font-mono">
                  <span>{t('zendo.vibr_amp', language) || 'VIBRATION AMP (VOLUME)'}</span>
                  <span>{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>
            </div>
          )}

          {/* Physical haptic toggle */}
          <div className="pt-2 flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                {t('zendo.haptics', language) || '📳 Mobile Physical Haptic Pulses'}
              </label>
              <p className="text-[10px] text-slate-500">
                {isHapticSupported 
                  ? (t('zendo.approved', language) || '🎯 Approved on this device') 
                  : (t('zendo.simulated', language) || '💻 Simulated on desktop environments')}
              </p>
            </div>
            <button
              onClick={() => {
                const nextState = !hapticEnabled;
                setHapticEnabled(nextState);
                if (nextState) {
                  triggerPhysicalVibrationPulse([90, 40, 90]);
                }
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                hapticEnabled ? 'bg-indigo-650' : 'bg-slate-250'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  hapticEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Pranayama Breathing Pacer */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-650" /> {t('zendo.pranayama', language) || 'Pranayama Breathing Coach'}
            </h4>
            <div className="flex gap-1">
              {(['SamaVritti', '478'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setPacerType(type);
                    setBreathState('Inhale');
                    setBreathSec(4);
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold focus:outline-none uppercase ${
                    pacerType === type
                      ? 'bg-indigo-100 text-indigo-805'
                      : 'bg-slate-50 text-slate-500'
                  }`}
                >
                  {type === 'SamaVritti' ? 'Box Breath' : '4-7-8 Stress Relief'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            {/* Pulsing Breathing Circle */}
            <div
              className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center text-center transition-all duration-[3000ms] ${
                pacerActive && breathState === 'Inhale' ? 'scale-115 bg-indigo-100/55 border-indigo-500' :
                pacerActive && breathState === 'Hold' ? 'scale-115 bg-amber-50 border-amber-550' :
                pacerActive && breathState === 'Exhale' ? 'scale-90 bg-indigo-50 border-indigo-300' :
                'scale-95 bg-slate-50 border-slate-150'
              }`}
            >
              {pacerActive ? (
                <>
                  <span className="font-bold text-sm tracking-wide text-slate-800">
                    {breathState === 'Inhale' ? (t('zendo.breath_inhale', language) || 'Breath: INHALE') :
                     breathState === 'Hold' ? (t('zendo.breath_hold', language) || 'Breath: HOLD') :
                     breathState === 'Exhale' ? (t('zendo.breath_exhale', language) || 'Breath: EXHALE') :
                     (t('zendo.breath_holdout', language) || 'Breath: HOLD OUT')}
                  </span>
                  <span className="text-xl font-black text-indigo-900 font-mono mt-1">{breathSec}s</span>
                </>
              ) : (
                <span className="text-xs font-semibold text-slate-455">Pacer Paused</span>
              )}
            </div>

            <p className="text-center text-xs text-slate-500 italic max-w-xs mt-5 leading-normal">
              {pacerType === 'SamaVritti'
                ? 'Sama Vritti (Box Breathing): Equal parts inhale, hold, exhale, hold. Neutralizes panic states instantly and triggers pleasant physical vibrations on transition.'
                : 'Ujjayi 4-7-8: Inhale for 4s, hold breath for 7s, exhale slowly for 8s. Strong parasympathetic trigger with tactile wave feedback.'}
            </p>

            <button
              onClick={handleTogglePacer}
              className="mt-5 w-full bg-slate-50/50 hover:bg-slate-100 border text-slate-705 font-semibold py-2.5 rounded-xl text-xs transition"
            >
              {pacerActive ? t('zendo.pause_coach', language) : t('zendo.active_coach', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
