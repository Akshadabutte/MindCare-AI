import { YogaPose, MeditationTrack, Article, Therapist, AssessmentQuestion } from './types';

export const YOGA_POSES: YogaPose[] = [
  // TEENAGERS (13-18)
  {
    id: 'teen-desk',
    title: 'School Desk Back Reliever',
    sanskritName: 'Upavistha Marjariasana',
    duration: 10,
    difficulty: 'Beginner',
    category: 'Stretching & Release',
    benefits: ['Relieves exam seating tension', 'Boosts upper back flexibility', 'Calms the mind before study sessions'],
    instructions: [
      'Sit on your chair with feet flat, hands on knees.',
      'Inhale: arch your spine, push chest forward, look up slightly (Cow stretch).',
      'Exhale: round your back, chin to chest, activate core (Cat stretch).',
      'Repeat rhythmically for 10 slow breath rounds.'
    ],
    modifications: ['Can be done standing if sitting is uncomfortable.'],
    imagePlaceholder: '🧘‍♀️ Cat-Cow Desk Stretch'
  },
  {
    id: 'teen-focus',
    title: 'Confidence-Building Warrior',
    sanskritName: 'Virabhadrasana II',
    duration: 15,
    difficulty: 'Beginner',
    category: 'Focus & Stature',
    benefits: ['Builds focus and physical stamina', 'Enhances mental willpower & self-esteem', 'Tones legs and core'],
    instructions: [
      'Stand with legs wide, 3-4 feet apart.',
      'Turn your right foot out 90 degrees, left foot slightly in.',
      'Bend your right knee over right ankle, arms outstretched parallel to floors.',
      'Gaze over right hand fingertips. Keep breathing steadily for 5 deep breaths, then switch.'
    ],
    modifications: ['Bring hands to hips if shoulders feel fatigued.'],
    imagePlaceholder: '🏹 Warrior 2 Pose'
  },

  // YOUNG ADULTS (19-25)
  {
    id: 'young-stress',
    title: 'Sun Salutations for Vitality',
    sanskritName: 'Surya Namaskar',
    duration: 20,
    difficulty: 'Intermediate',
    category: 'Vinyasa Flow',
    benefits: ['Full body stress detox', 'Boosts metabolic circulation', 'Enhances morning creative energy'],
    instructions: [
      'Begin in Mountain Pose (Pranamasana), palms joined.',
      'Inhale: raise arms, arch back (Hastauttanasana).',
      'Exhale: fold forward to toes (Padahastasana).',
      'Inhale: step right foot back, drop knee, look up (Ashwa Sanchalanasana).',
      'Carry on with plank, chest-chin-knees drop, cobra, downward dog.'
    ],
    modifications: ['Slow down pace or bend knees heavily in forward folds.'],
    imagePlaceholder: '🌅 Surya Namaskar Sequence'
  },
  {
    id: 'young-grounding',
    title: 'Tree Pose for Balance',
    sanskritName: 'Vrikshasana',
    duration: 12,
    difficulty: 'Beginner',
    category: 'Balance & Focus',
    benefits: ['Grounds emotional instability', 'Improves leg muscle coordination', 'Quietens frantic overthinking'],
    instructions: [
      'Stand erect on left foot, bend right knee.',
      'Place right foot sole high on inner left thigh (avoiding knee joint) or on calf.',
      'Find a fixed point of focus (Drishti) on the wall.',
      'Bring hands into prayer at chest, or raise them overhead. Root down like a tree.'
    ],
    modifications: ['Keep toes touching the floor or rest hand against a wall for support.'],
    imagePlaceholder: '🌲 Tree Pose'
  },

  // PROFESSIONALS (26-35)
  {
    id: 'prof-desk',
    title: 'Laptop Posture Backbend',
    sanskritName: 'Bhujangasana',
    duration: 15,
    difficulty: 'Beginner',
    category: 'Posture Correction',
    benefits: ['Combats screen-hunching slouch', 'Strengthens spine & posterior muscles', 'Stimulates adrenal deep breathing'],
    instructions: [
      'Lie down on your stomach, forehead touching floors, palms under shoulders.',
      'Inhale: peel chest off the floor using lower back strength, shoulders relaxed.',
      'Keep elbows pinned closely to your ribs.',
      'Hold for 3 calm breaths, then exhale gently down.'
    ],
    modifications: ['Perform Sphinx Pose by placing forearms on floor to ease lower back pressure.'],
    imagePlaceholder: '🐍 Cobra Posture'
  },
  {
    id: 'prof-legs',
    title: 'Anxiety Cooling Wall Elevation',
    sanskritName: 'Viparita Karani',
    duration: 15,
    difficulty: 'Beginner',
    category: 'Restorative Sleep',
    benefits: ['Drains pooled leg lymphatic fluid', 'Triggers parasympathetic rest states', 'Relieves mental and physical burnout'],
    instructions: [
      'Sit facing a wall sideways, lie back and swing legs up the wall.',
      'Slide your tailbone as close to the wall as is comfortable.',
      'Let arms open out to sides, palms up, shoulder blades flat.',
      'Close eyes, breathing abdominal pranayama for 10-15 minutes.'
    ],
    modifications: ['Slide a pillow or folded blanket under your lower back for elevated comfort.'],
    imagePlaceholder: '🪜 Legs up Wall Restorative'
  },

  // MATURE ADULTS (36+)
  {
    id: 'mature-joints',
    title: 'Joint Mobility Nectar',
    sanskritName: 'Sukshma Vyayama',
    duration: 15,
    difficulty: 'Beginner',
    category: 'Gentle Warm-ups',
    benefits: ['Lubricates finger, wrist, elbow and shoulder joints', 'Prevents stiffness from arthritis', 'Calms nervous system tremors'],
    instructions: [
      'Sit comfortably in a chair or crossed-legged on a cushion.',
      'Extend arms out, rapidly clench and release fists 20 times (Mushtika Bandha).',
      'Follow with slow clockwise and counter-clockwise neck semi-circles.',
      'Inhale shoulders up to ears, roll them backward heavily to open chest.'
    ],
    modifications: ['Always sit comfortably with solid back support.'],
    imagePlaceholder: '🧘 Sukshma Vyayama Joint Care'
  },
  {
    id: 'mature-sleep',
    title: 'Sacred Sleep Prep Pose',
    sanskritName: 'Balasana',
    duration: 10,
    difficulty: 'Beginner',
    category: 'Calming Relief',
    benefits: ['Releases physical lower back strain', 'Gentle hip opener', 'Promotes deep, deep mental rest and sleep'],
    instructions: [
      'Kneel on floor, toes touching, knees set wide apart.',
      'Rest hips back onto heels, sit upright.',
      'Exhale and fold torso forward between thighs, placing forehead on floor.',
      'Extend arms completely forward palms-down or stretch them backwards along torso.'
    ],
    modifications: ['If hips don’t meet heels, insert a thick pillow between your thighs.'],
    imagePlaceholder: '🌸 Child’s Resting Pose'
  }
];

export const MEDITATION_TRACKS: MeditationTrack[] = [
  // TEENAGERS
  {
    id: 'teen-exam',
    title: '5-Minute Exam Anxiety Escape',
    duration: 5,
    category: 'Anxiety Management',
    narrator: 'Anjali Rao - Hypnotherapist',
    description: 'An emergency anchor for student panics. Slows heart rate and instills instant academic confidence.',
    binauralFreq: 'Alpha (8Hz) for Focus'
  },
  {
    id: 'teen-overthinking',
    title: 'Social Pressure & Overthinking Purge',
    duration: 12,
    category: 'Mindfulness Affirmations',
    narrator: 'Acharya Shastri - Vedic Wisdom',
    description: 'A soothing visualization that helps you disconnect from school peer labels and discover inner self-worth.',
    binauralFreq: 'Theta (6Hz) for Subconscious Release'
  },

  // YOUNG ADULTS
  {
    id: 'young-career',
    title: 'Career & Life Direction Clarity',
    duration: 15,
    category: 'Pranayama Guided Visualization',
    narrator: 'Devanand Swami - Pranayama Guru',
    description: 'Rooted in Swara Yoga. Balances left and right brain hemispheres to clear foggy career decision burnout.',
    binauralFreq: 'Alpha (10Hz) for Creative Strategy'
  },
  {
    id: 'young-lonely',
    title: 'Dating Confidence & Healing Loneliness',
    duration: 10,
    category: 'Heart Chakra Opening',
    narrator: 'Sarah Jenkins - Mindfulness Coach',
    description: 'Cultivates warm self-love (Anahata activation) protecting young minds from online dating comparison fatigue.',
    binauralFreq: 'Solfeggio 528Hz Transformation'
  },

  // PROFESSIONALS
  {
    id: 'prof-burnout',
    title: '15-Minute Work Stress Detox',
    duration: 15,
    category: 'Yoga Nidra Deep Relaxation',
    narrator: 'Anjali Rao - Hypnotherapist',
    description: 'A deep psychic sleep sequence. 15 minutes holds the neurological resting benefit of 2 hours conventional sleep.'
  },
  {
    id: 'prof-focus',
    title: 'Nadi Shodhana Lunch-break Enhancer',
    duration: 10,
    category: 'Channel Balancing Breath',
    narrator: 'Devanand Swami - Pranayama Guru',
    description: 'Alternate nostril breathing. Infuses prefrontal cortex with oxygen to dissolve desk fog and boost executive leadership.'
  },

  // MATURE ADULTS
  {
    id: 'mature-legacy',
    title: 'Reflective Legacy & Acceptance Meditation',
    duration: 20,
    category: 'Vedic Peace Chant & Reflection',
    narrator: 'Acharya Shastri - Vedic Wisdom',
    description: 'Meditate on the cycle of life, drawing peaceful stability from traditional Vedic teachings on content (Santosha).',
    binauralFreq: 'Delta (2Hz) for Absolute Calming'
  },
  {
    id: 'mature-health',
    title: 'Health Anxiety Dissolver & Body Scan',
    duration: 30,
    category: 'Mindfulness Body Scan',
    narrator: 'Sarah Jenkins - Mindfulness Coach',
    description: 'Gentle, comforting scan that targets physical aches, health-fears, and aligns breath to each body organ.'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'iks-1',
    title: 'Ayurvedic Dinacharya: Traditional Daily Routine for High Vitality',
    summary: 'Explore how alignment of natural rhythms (waking, dining, sleeping) reduces high Cortisol states.',
    content: `In the Indian Knowledge System (IKS), wellness is defined as 'Svasthya'—meaning being firmly established in one's own natural pristine self. 
According to Ayurvedic principles, sticking to a consistent 'Dinacharya' (daily system) matches our hormonal cycle with the diurnal forces of nature:

1. **Brahma Muhurta (4:30 AM - 6:00 AM)**: The optimal time to wake. Air is rich with 'Prana' and natural spiritual silence reigns. Mind states are naturally heavy in 'Sattva' (harmony).
2. **Jihva Nirlekhana (Tongue Scraping)**: Clears toxins ('Ama') accumulated overnight, boosting digestive heat ('Agni') connected with clarity.
3. **Abhyanga (Self-massage with Warm Sesame/Coconut Oil)**: Grounds the nervous system, hydrates tissues, and neutralizes 'Vata' (the air/movement category that controls anxiety).

By anchoring your day, you prevent anxiety from developing before work even starts.`,
    ageGroups: ['young', 'professional', 'mature'],
    readTime: '5 min',
    category: 'IKS',
    isIKS: true,
    author: { name: 'Dr. Alok Sharma', role: 'BAMS, Ayurvedic Neurologist', verified: true }
  },
  {
    id: 'iks-2',
    title: 'Sattva, Rajas, Tamas: The Three Mental Qualities (Gunas)',
    summary: 'How ancient Vedic psychology helps you categorize and balance daily emotional swings.',
    content: `Vedic Psychology teaches that the human mind (Manas) fluctuates between three fundamental qualities:

- **Sattva (Harmony/Clarity)**: Characterized by light, peace, compassion, presence, and balance.
- **Rajas (Passion/Agitation)**: Driven by ambition, competitiveness, anxiety, impatience, and desire.
- **Tamas (Dullness/Apathy)**: Leading to lethargy, depression, confusion, and memory lapses.

When you feel stressed out, your mind is high in 'Rajas'. When you feel burnt out or depressed, 'Tamas' is in charge. The goal of MindCare AI is to cultivate 'Sattva' utilizing specific dietary habits (pure, fresh foods), focused pranayama (breath regulation), and selfless action.`,
    ageGroups: ['teen', 'young', 'professional', 'mature'],
    readTime: '6 min',
    category: 'IKS',
    isIKS: true,
    author: { name: 'Acharya Shastri', role: 'Vedic Scholar & Psychologist', verified: true }
  },
  {
    id: 'teen-social',
    title: 'Navigating Social Media Peer Comparison Guide',
    summary: 'A clinical checklist to protect teenage self-esteem in an era of likes and viral filters.',
    content: `Teenage brains are hardwired to look for peer validation. Social media exploits this vulnerability. Heavy comparison triggers dopamine spikes and severe drops in secure self-worth:

- **The Illusion of Perfect Profiles**: Keep in mind that a peer’s feed is a curated highlight reel, not real life.
- **Curating Your Feed**: Unfollow profiles that leave you feeling insecure or excluded. Follow scientific or uplifting content creators.
- **Strict Curfews**: Set a hard phone power-down 1 hour before bed to prevent blue-light cortisol interference.

Remember: Your value is calculated by your character, kindness, and continuous growth—not by algorithms.`,
    ageGroups: ['teen'],
    readTime: '3 min',
    category: 'Coping',
    isIKS: false,
    author: { name: 'Sarah Jenkins', role: 'Teen Counselor & LCSW', verified: true }
  },
  {
    id: 'prof-burnout-art',
    title: 'Executive Burnout Recovery: Boundaries at Work',
    summary: 'Learn when to say no, schedule real deep rests, and protect your mental reserve.',
    content: `High performance requires regular, conscious recovery. Burnout occurs when your output exceeds your input for an extended period. To combat work-related exhaustion:

1. **Micro-breaks**: Implement the Pomodoro technique with stretching.
2. **Mental Shutdown Ritual**: Officially end the work day by writing tomorrow's top 3 tasks on a sticky note and closing the laptop.
3. **Digital Detox**: Prevent work messaging apps on personal phones from notifying after 7 PM.

Your career is a marathon, not a sprint. Setting boundaries protects both your career longevity and your immediate sanity.`,
    ageGroups: ['professional'],
    readTime: '4 min',
    category: 'Career/Academic',
    isIKS: false,
    author: { name: 'Dr. Susan Wright', role: 'Corporate Wellness Coach', verified: true }
  }
];

export const DIAGNOSTIC_SCHEMES = {
  'PHQ-9': {
    title: 'Depression Screening (PHQ-9)',
    description: 'An internationally validated questionnaire measuring key physiological and cognitive symptoms of low mood over the past 2 weeks.',
    questions: [
      { id: 1, text: 'Little interest or pleasure in doing things' },
      { id: 2, text: 'Feeling down, depressed, or hopeless' },
      { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much' },
      { id: 4, text: 'Feeling tired or having little energy' },
      { id: 5, text: 'Poor appetite or overeating' },
      { id: 6, text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down' },
      { id: 7, text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
      { id: 8, text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual' },
      { id: 9, text: 'Thoughts that you would be better off dead or of hurting yourself in some way' }
    ]
  },
  'GAD-7': {
    title: 'Anxiety Screening (GAD-7)',
    description: 'An internationally validated questionnaire screening for generalized anxiety, restlessness, and persistent worry over the past 2 weeks.',
    questions: [
      { id: 1, text: 'Feeling nervous, anxious, or on edge' },
      { id: 2, text: 'Not being able to stop or control worrying' },
      { id: 3, text: 'Worrying too much about different things' },
      { id: 4, text: 'Trouble relaxing' },
      { id: 5, text: 'Being so restless that it is hard to sit still' },
      { id: 6, text: 'Becoming easily annoyed or irritable' },
      { id: 7, text: 'Feeling afraid, as if something awful might happen' }
    ]
  },
  'Work-Stress': {
    title: 'Occupational Burnout Scale',
    description: 'Specially adapted assessment measuring occupational overload, emotional extraction, and career efficacy.',
    questions: [
      { id: 1, text: 'I feel emotionally exhausted and drained from my workload' },
      { id: 2, text: 'I feel disconnected from my achievements and find client/peer queries irritating' },
      { id: 3, text: 'I worry about career stalling and feel unsupported by management' },
      { id: 4, text: 'My laptop and messages dictate my sleep cycle and weekend schedules' },
      { id: 5, text: 'I struggle to concentrate or deliver quality due to constant back-to-back pressure' }
    ]
  },
  'Academic-Anxiety': {
    title: 'Academic Stress Assessment',
    description: 'Measuring academic anxiety, grade expectations, and peer performance pressure.',
    questions: [
      { id: 1, text: 'My grades or mock test performances dictate my day’s happiness level' },
      { id: 2, text: 'I suffer from physical symptoms (racing heart, cold sweat) during exams or while studying' },
      { id: 3, text: 'I experience persistent fear of letting my parents or teachers down' },
      { id: 4, text: 'I avoid study blocks or feel constantly behind schedule' },
      { id: 5, text: 'I feel inadequate when comparing my scores to peers on chat or rankings' }
    ]
  }
};

export const THERAPISTS: Therapist[] = [
  {
    id: 'ther-1',
    name: 'Dr. Vivek Mehra',
    role: 'Senior Clinical Psychologist',
    languages: ['Hindi', 'English', 'Punjabi'],
    specialty: ['Anxiety Disorders', 'CBT', 'Family Counseling'],
    experience: 14,
    rating: 4.9,
    availability: ['Mon 10:00 AM', 'Tue 2:00 PM', 'Thu 4:00 PM'],
    price: '₹1,500 / Session',
    image: '👨‍⚕️'
  },
  {
    id: 'ther-2',
    name: 'Ananya Deshmukh',
    role: 'Teen & Young Adult Counselor',
    languages: ['Marathi', 'Hindi', 'English'],
    specialty: ['Academic stress', 'Peer pressure', 'Self-esteem building'],
    experience: 8,
    rating: 4.8,
    availability: ['Wed 11:00 AM', 'Fri 3:00 PM', 'Sat 10:00 AM'],
    price: '₹1,200 / Session',
    image: '👩‍⚕️'
  },
  {
    id: 'ther-3',
    name: 'Aditya Ramakrishnan',
    role: 'Corporate Wellness & Executive Coach',
    languages: ['Tamil', 'English', 'Malayalam'],
    specialty: ['Work-life balance', 'Burnout recovery', 'Assertiveness'],
    experience: 11,
    rating: 4.95,
    availability: ['Tue 9:00 AM', 'Thu 6:00 PM', 'Fri 5:00 PM'],
    price: '₹2,000 / Session',
    image: '👨‍💼'
  },
  {
    id: 'ther-4',
    name: 'Swamini Anandasri',
    role: 'IKS Wellness Practitioner & Yoga Therapist',
    languages: ['Sanskrit', 'Telugu', 'Hindi', 'English'],
    specialty: ['Ayurvedic Psychology', 'Pranayama therapy', 'Vedic scriptures counseling'],
    experience: 18,
    rating: 4.97,
    availability: ['Mon 8:00 AM', 'Wed 8:00 AM', 'Sat 7:00 AM'],
    price: '₹1,000 / Session',
    image: '🧘‍♀️'
  }
];

export const JOURNAL_PROMPTSByAge = {
  teen: [
    'How did school make you feel today? Was there any academic or peer pressure?',
    'Identify one person who supported you today and what they did.',
    'What is one social media post or comment that grabbed your energy today, and how did it affect you?',
    'Write absolute, unfiltered words about anything you feel you cannot tell your parents/teachers right now.'
  ],
  young: [
    'What is fueling or draining your confidence regarding your career or relationship targets?',
    'Describe your screen time today: Was it scrolling to escape or active work?',
    'Where do you see yourself in 3 years? Focus on emotional qualities, not just career metrics.',
    'Write a short gratitude letter to your body. How has it supported your late nights or study grids?'
  ],
  professional: [
    'List 3 situations today where you noticed Rajas (restlessness/rush) vs. Sattva (presents/clarity).',
    'Write about a boundary you successfully set (or should have set) in your workspace today.',
    'Describe any physical tensions from sitting—does your shoulder or lower back hold any posture fatigue?',
    'Are you chasing achievement at the expense of presence? Reflect honestly.'
  ],
  mature: [
    'What aspects of your current legacy and life path fill you with deep internal peace?',
    'Write a reflection about a family connection or relationship dynamic you want to heal or deepen.',
    'How does your body feel today? What gentle health habits did you prioritize?',
    'What Vedic principle or traditional practice brought you a sense of gratitude and calmness today?'
  ]
};
