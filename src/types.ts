export type AgeGroup = 'teen' | 'young' | 'professional' | 'mature';

export interface UserProfile {
  name: string;
  age: number;
  ageGroup: AgeGroup;
  concerns: string[];
  profession?: string;
  onboarded: boolean;
  language: string;
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  score: number; // 1 to 5 (Awful, Bad, Okay, Good, Excellent)
  note: string;
  triggers: string[];
  activities: string[];
  sentimentScore?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  prompt: string;
  analysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    sentimentScore: number; // -1 to 1
    tones: string[];
    keywords: string[];
    patterns: string;
    advice: string;
  };
}

export interface YogaPose {
  id: string;
  title: string;
  sanskritName: string;
  duration: number; // in mins
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  instructions: string[];
  modifications: string[];
  category: string;
  imagePlaceholder: string;
}

export interface MeditationTrack {
  id: string;
  title: string;
  duration: number; // in mins
  category: string;
  narrator: string;
  description: string;
  binauralFreq?: string;
  audioUrl?: string; // local simulation audio context
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  ageGroups: AgeGroup[];
  readTime: string;
  category: 'IKS' | 'Mental Health' | 'Coping' | 'Career/Academic';
  isIKS: boolean;
  author: {
    name: string;
    role: string;
    verified: boolean;
  };
}

export interface AssessmentQuestion {
  id: number;
  text: string;
}

export interface AssessmentResult {
  id: string;
  date: string;
  type: 'PHQ-9' | 'GAD-7' | 'Work-Stress' | 'Academic-Anxiety';
  score: number;
  maxScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  interpretation: string;
  recommendations: string[];
}

export interface Therapist {
  id: string;
  name: string;
  role: string;
  languages: string[];
  specialty: string[];
  experience: number; // years
  rating: number;
  availability: string[];
  price: string;
  image: string;
}

export interface HealthMetric {
  date: string;
  sleepHours: number;
  waterIntake: number; // ml
  screenTime: number; // mins
  stepCount: number;
  activeMinutes: number;
  stressLevel: number; // 1-10
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
