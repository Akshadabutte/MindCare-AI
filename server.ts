import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header requested by standard guidelines
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY", // Handle key missing gracefully
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Detect temporary Gemini API errors (503 Service Unavailable, rate limits, overloads, etc.)
const isTemporaryError = (err: any) => {
  const msg = String(err?.message || "").toLowerCase();
  return (
    msg.includes("553") ||
    msg.includes("503") ||
    msg.includes("500") ||
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("overloaded") ||
    msg.includes("limit") ||
    msg.includes("exhausted") ||
    msg.includes("busy") ||
    msg.includes("spike") ||
    msg.includes("timeout")
  );
};

// Offline counseling dictionary to serve high-quality, smart feedback even during server outages
function generateHardcodedFallbackResponse(
  type: "chat" | "journal" | "recommendations",
  ageGroup: string,
  language: string,
  userInput: string
): string {
  const query = userInput.toLowerCase();
  let notice = "";

  if (language === "Hindi") {
    notice = "🧘 *[मनकैरे मित्र ऑफ़लाइन सहायता सक्रिय - उच्च सर्वर मांग]*\n\n";
  } else if (language === "Tamil") {
    notice = "🧘 *[மைண்ட்கேர் மித்ரா ஆஃப்லைன் பயன்முறை - அதிக சர்வர் சுமை]*\n\n";
  } else if (language === "Telugu") {
    notice = "🧘 *[మైండ్‌కేర్ మిత్ర ఆఫ్ లైన్ సహాయం - అధిక సర్వర్ లోడ్]*\n\n";
  } else if (language === "Bengali") {
    notice = "🧘 *[মাইন্ডকেয়ার মিত্র অফলাইন মোড - উচ্চ সার্ভার ট্রাফিক]*\n\n";
  } else if (language === "Marathi") {
    notice = "🧘 *[माइंडकेअर मित्र ऑफलाइन साहाय्य सक्रिय - सर्व्हर लोड अधिक आहे]*\n\n";
  } else {
    notice = "🧘 *[MindCare Mitra Offline Sanctuary mode enabled due to high server demand]*\n\n";
  }

  // Group 1: Laptop posture & back pain
  if (query.includes("posture") || query.includes("back") || query.includes("pain") || query.includes("shoulder") || query.includes("neck") || query.includes("stiff")) {
    if (language === "Hindi") {
      return notice + `लंबे समय तक लैपटॉप पर काम करने से रीढ़ की हड्डी में तनाव आ जाता है। चलिए एक सरल उपचार करते हैं:
1. **स्कंध चालन (Shoulder Rolls):** अपनी रीढ़ सीधी रखें और कंधों को 5 बार आगे से पीछे और पीछे से आगे घुमाएं।
2. **ताड़ासन अभ्यास:** दोनों हाथों को सर के ऊपर सीधा तानें, सांस भरें और उंगलियों को आपस में फंसाकर ऊपर की तरफ खींचें।
3. **नेत्र व्यायाम:** स्क्रीन से हटाकर हर 20 मिनट में 20 फीट दूर किसी वस्तु को 20 सेकंड के लिए देखें।

यह अभ्यास शरीर की वायु को संतुलित करता है और तनाव को समाप्त करता है।`;
    }
    return notice + `I notice you are holding tension in your physical body due to heavy screen hours. Let's address this with brief posture resets:
1. **Skandha Chalan (Shoulder Releases):** Roll your shoulders clockwise and counterclockwise 5 times, synchronized with full deep breaths.
2. **Seated Tadasana:** Sit tall in your chair, interlace your fingers, inhale, and stretch your hands up toward the ceiling. Feel the expansion in your spine.
3. **The 20-20-20 Rule:** To avoid digital fatigue, look away from your screen every 20 minutes at something 20 feet away for 20 seconds.

This physical offset regulates Tamas (stagnation) in India's wellness systems and restores free-flowing Prana.`;
  }

  // Group 2: School, stress, test, exams
  if (query.includes("stressed") || query.includes("exam") || query.includes("rankings") || query.includes("test") || query.includes("peer") || query.includes("fail") || query.includes("school")) {
    if (language === "Hindi") {
      return notice + `अध्ययन और परीक्षा का तनाव बहुत सामान्य है, लेकिन याद रखें कि आपका अंतर्निहित मूल्य अंकों द्वारा तय नहीं होता।
* प्राणायाम उपचार: **शीतली प्राणायाम** या **अनुलोम विलोम** करें। साँस को भीतर 4 सेकंड रोकें और धीरे-धीरे बाहर छोड़ें। यह मन को तुरंत शांत करता है।
* सात्विक विचार: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन' - केवल अपने प्रयास पर ध्यान केंद्रित करें, परिणामों की अधिक चिंता न करें। आप पूरी तरह सक्षम हैं।`;
    }
    return notice + `I hear how intense the academic pressure and ranking anxiety feels to you right now. Remember, your ultimate destiny is far wider than any examination grade. Let's ground your anxiety:
1. **Nadi Shodhana Pranayama:** Alternate nostril breathing is remarkably restorative. Block your right nostril, inhale from the left, block the left, and exhale from the right. Repeat 5 times.
2. **Refining the Focus:** Turn your attention purely onto the process (Karmanyevadhikaraste), not the outcome. This aligns with clinical cognitive reappraisal and ancient Karma Yoga.
3. **Hydration and Sleep:** Take a warm herbal infusion. Keep screens away at least 45 minutes before sleep to ground your Rajas (overthinking).`;
  }

  // Group 3: Corporate burnout, career imposter
  if (query.includes("burnout") || query.includes("career") || query.includes("job") || query.includes("money") || query.includes("imposter") || query.includes("interview")) {
    if (language === "Hindi") {
      return notice + `करियर की दिशा और जीवन के इस संक्रमण काल में भारीपन महसूस होना स्वाभाविक है। इसे प्राचीन भारतीय आयुर्वेद 'स्वधर्म' के संतुलन से देखता है।
1. **साँस का संतुलन (4-7-8 सांस):** धीरे-धीरे नाक से साँस लें, 7 सेकंड तक उसे रोकें, और मुँह से जाने दें। यह घबराहट को तुरंत कम करता है।
2. **स्वेच्छा का पुनर्मूल्यांकन:** आज किसी भी तरह की उत्पादकता की दौड़ में न भागें। अपने भीतर के 'सत्त्व' गुण को बढ़ाएं – शांति, मौन और सात्विक आहार।`;
    }
    return notice + `Working or searching through intense career shifts often triggers professional exhaustion or severe burnout. Let's cultivate balance:
1. **Belly Breathing (Adham Pranayama):** Place one hand on your naval. Inhale deeply, forcing your belly outwards, and exhale allowing it to fall. This triggers the parasympathetic nervous system.
2. **Sattvification:** Focus on daily restorative rituals. Avoid hyper-stimulating screens during lunch times.
3. **Clarify Swadharma:** True success is aligned to of-the-moment authenticity. Break down gigantic tasks into tiny, actionable milestones. You are exactly where you need to be.`;
  }

  // Group 4: Loneliness, grief, heartbreaks
  if (query.includes("breakup") || query.includes("lonely") || query.includes("loneliness") || query.includes("relationship") || query.includes("friend") || query.includes("angry") || query.includes("love")) {
    if (language === "Hindi") {
      return notice + `हृदय के संबंध और एकाकीपन को संभालना बहुत संवेदनशील प्रक्रिया है। हमारे भीतर का प्रेम असीम है।
1. **हृदय चक्र ध्यान:** आराम से बैठें, अपना दाहिना हाथ छाती के बीच (अनाहत चक्र) पर रखें। आँखें बंद करें और प्रत्येक सांस के साथ अपने प्रति दया और क्षमा भाव महसूस करें।
2. **सहानुभूति (आत्म-मैत्री):** अपने आप को वे शब्द कहें जो आप किसी प्यारे मित्र को इस दुःख में कहते। समय ही सर्वोत्तम औषधि है।`;
    }
    return notice + `Handling the deep heartache of a relationship breakup or intense loneliness is incredibly heavy. Please hold space for your healing:
1. **Anahata (Heart Chakra) Grounding:** Place your dominant hand over the center of your chest. Inhale warmth and acceptance; exhale judgment and regret.
2. **Maitri (Self-Kindness):** Cultivate deep compassion for yourself. Allow the emotions to arise and pass without labeling them as permanent failures.
3. **Connect Gently:** Send a message to one positive family member or friend, or interact gently with nature. You are fundamentally connected to the vastness of life.`;
  }

  // Group 5: Insomnia or sleep cycles
  if (query.includes("insomnia") || query.includes("sleep") || query.includes("awake") || query.includes("night") || query.includes("tired")) {
    if (language === "Hindi") {
      return notice + `नींद और विश्राम की समस्या होने पर वात दोष उत्तेजित हो जाता है। शांत निद्रा के लिए:
1. **भ्रामरी प्राणायाम:** आँखें और कान बंद करके गुनगुनाहट (मधुमक्खी जैसी ध्वनि) करें। यह आपके तंत्रिका तंत्र को गहरी विश्राम अवस्था में भेजता है।
2. **हल्की मालिश:** सोते समय पैरों के तलवों में तिल के तेल या नारियल तेल से हल्की मालिश करें।
3. **कमरे को शांत और ठंडा रखें।**`;
    }
    return notice + `When sleep is hard, it is an indication of heightened Vata (air/movement) in the body-mind energy system. Let's induce calm sleep:
1. **Bhramari Pranayama (Humming Bee Breath):** Close your eyes, place your fingers on the cartilage of your ears, and buzz gently like a bee during a long exhalation. It is clinically proven to lower heart rates.
2. **Foot Massage (Pada Abhyanga):** Rub a small amount of warm sesame or coconut oil over the soles of your feet to anchor your energy downward.
3. **Sleep Sanctuary:** Dim the room lights, avoid social media, and read something uplifting or listen to ambient natural raga soundscapes.`;
  }

  // Default response matching language
  if (language === "Hindi") {
    return notice + `मैं आपकी बात को पूरे ध्यान से सुन रहा हूँ। यद्यपि बाहरी सर्वर पर अत्यधिक कार्यभार है, फिर भी हमारी ऑफलाइन सात्विक सहायता आपके साथ है। 

तनाव को त्वरित रूप से शांत करने के लिए आइए **३ गहरी प्राणवायु सांस** लें:
1. अपनी रीढ़ को सीधा करें और कन्धों को ढीला छोड़ें।
2. नाक से मंद सांस भीतर भरें... (४ सेकंड)
3. उसे अंतर्मन में रोकें... (२ सेकंड)
4. और धीरे-धीरे मुंह से जाने दें... (६ सेकंड)

कृपया अपनी वर्तमान भावनाएं मेरे साथ साझा करें। ऑफलाइन मोड में भी मैं हर तरह से आपका ध्यान रखूँगा।`;
  }
  return notice + `Thank you for sharing your thoughts. Even though our primary high-fidelity AI model is experiencing peak demand, your mental sanctuary remains our absolute priority.

Let's begin by calming your nervous system with a **simple 4-count pranayama pattern**:
1. Sit comfortably with your spine tall, shoulders relaxed.
2. Inhale quiet, cooling Prana slowly through your nose... (4 counts)
3. Hold it gently within... (2 counts)
4. Exhale and release all burdens slowly... (6 counts)

Please feel free to express whatever is on your mind, and I will continue to guide and support you with therapeutic wisdom.`;
}

// Offline high-fidelity journal analysis generator to keep journal logs fully functional without crash
function generateOfflineJournalAnalysis(text: string): any {
  const clean = text.toLowerCase();
  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  let sentimentScore = 0.0;
  const tones: string[] = ["reflective"];
  const keywords: string[] = ["mental awareness"];
  let advice = "Your thoughts are held in a safe, completely secure, and non-judgmental space. Journaling is a beautiful path to clear inner cognitive noise. Rest gently after this practice.";

  if (clean.includes("stress") || clean.includes("anxious") || clean.includes("worry") || clean.includes("anxiety") || clean.includes("scared") || clean.includes("exam") || clean.includes("test")) {
    sentiment = "negative";
    sentimentScore = -0.4;
    tones.push("anxious", "overwhelmed");
    keywords.push("academic/career concern");
    advice = "I notice some stress and anxiety in your reflection. To ease this tension, practice 5 minutes of alternate nostril breathing (Nadi Shodhana) to guide the nervous system into resting mode. Remind yourself that challenges are fleeting.";
  } else if (clean.includes("sad") || clean.includes("depressed") || clean.includes("lonely") || clean.includes("cry") || clean.includes("hurt") || clean.includes("pain") || clean.includes("breakup")) {
    sentiment = "negative";
    sentimentScore = -0.6;
    tones.push("sorrowful", "isolated");
    keywords.push("emotional burden");
    advice = "Your heart is carrying some heavy weight today. Please be extremely gentle with yourself. Take 10 minutes to sit in a quiet corner with your hand on your heart and repeat 'I am safe, I am worthy, I am healing.' Nourish your body with warm liquids.";
  } else if (clean.includes("angry") || clean.includes("mad") || clean.includes("frustrated") || clean.includes("hate") || clean.includes("annoyed")) {
    sentiment = "negative";
    sentimentScore = -0.3;
    tones.push("frustrated", "reactive");
    keywords.push("interpersonal triggers");
    advice = "I detect rising heat (Rajasic irritation) in your post. Cool the fire by practicing Sitali cooling breath (inhaling through a curled tongue, exhaled through the nostrils). Let the impulse dissolve into wise compassion.";
  } else if (clean.includes("tired") || clean.includes("sleep") || clean.includes("insomnia") || clean.includes("exhausted") || clean.includes("burnout")) {
    sentiment = "neutral";
    sentimentScore = -0.2;
    tones.push("fatigued", "depleted");
    keywords.push("workplace overload");
    advice = "Your physical battery is signaling depletion (Tamasic weight). Give yourself permission to shut down screens 1 hour early tonight, massage your feet with sesame oil (Pada Abhyanga), and allow your mind to fully reset.";
  } else if (clean.includes("happy") || clean.includes("glad") || clean.includes("excited") || clean.includes("good") || clean.includes("love") || clean.includes("grateful") || clean.includes("blessed") || clean.includes("awesome") || clean.includes("great")) {
    sentiment = "positive";
    sentimentScore = 0.8;
    tones.push("grateful", "harmonious");
    keywords.push("positive focus");
    advice = "Your journal reflects beautiful Sattvic clarity and joy! Cultivating appreciation expands our natural vitality. Anchor this feeling inside your heart today and let it guide you gracefully.";
  }

  const potentialKeywords = [
    "career", "health", "friend", "parent", "partner", "sleep", "school", "exam", "diet", "fitness", "finance", "time"
  ];
  potentialKeywords.forEach(kw => {
    if (clean.includes(kw) && !keywords.includes(kw)) {
      keywords.push(kw);
    }
  });

  return {
    sentiment,
    sentimentScore,
    tones,
    keywords,
    patterns: "Offline sentiment capture identified a " + sentiment + " emotional cycle.",
    advice: "🧘 *[MindCare Offline Sentiment Sanctuary]* " + advice
  };
}

// Offline recommendation system
function generateOfflineRecommendations(mood: number, triggers: string[], activities: string[], ageGroup: string): any {
  let dominantGuna = "Sattva";
  let vibeNote = "Your thoughts and physical energy sound balanced. Let's reinforce this tranquility with simple grounding postures.";

  if (mood <= 2) {
    dominantGuna = triggers.includes("screen") || triggers.includes("work") ? "Rajas" : "Tamas";
    vibeNote = "Your vitality feels slightly low or hyper-reactive. Here are some calming remedies to anchor your body's energy.";
  } else if (mood === 3) {
    dominantGuna = "Rajas";
    vibeNote = "Your day is in motion. Aligning your internal state will grant you crisp focus.";
  }

  const recommendations = [
    {
      type: "Yoga Pose",
      title: ageGroup === "professional" || ageGroup === "young" ? "Marjariasana (Cat-Cow stretch)" : "Balasana (Child's Pose)",
      description: "Complete 5 slow rounds matching your breathing. Arch smoothly on inhalations and round on exhalations.",
      benefit: "Soothes back stiffness and shoulder load, realigns the spinal cord, and promotes structural ease.",
      durationMins: 5
    },
    {
      type: "Breathing Exercise",
      title: mood <= 2 ? "Sama Vritti (Box Breathing)" : "Nadi Shodhana Pranayama",
      description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds. Repeat 8 times.",
      benefit: "Reduces acute overthinking, stabilizes pulse variability, and centers the amygdala.",
      durationMins: 4
    },
    {
      type: "Ayurvedic Habit",
      title: "Ushapan (Warm Water Ritual)",
      description: "Sit quietly and sip a cup of warm water slowly. Feel the hydration flushing out toxic buildup.",
      benefit: "Ignites digestive fire (Agni), balances bodily humors, and pacifies excess physical heat.",
      durationMins: 3
    }
  ];

  return {
    dominantGuna,
    vibeNote: "🧘 *[Mitra Offline Smart Recommender]* " + vibeNote,
    recommendations
  };
}

// Tracks if the API Key has been exhausted (rate-limited) to bypass networks and serve offline sanctuary instantly
let localQuotaCooldownTimestamp = 0; // Cooldown end time

// Unified robust handler to run attempts, retry on transient errors, and fallback offline
async function generateContentWithRetry(params: {
  contents: any;
  config?: any;
  offlineFallback?: boolean;
  type: "chat" | "journal" | "recommendations";
  ageGroup?: string;
  language?: string;
  messageText?: string;
  mood?: number;
  triggers?: string[];
  activities?: string[];
}) {
  const {
    contents,
    config,
    offlineFallback = false,
    type,
    ageGroup = "professional",
    language = "English",
    messageText = "",
    mood = 3,
    triggers = [],
    activities = []
  } = params;

  const shieldActive = Date.now() < localQuotaCooldownTimestamp;

  if (offlineFallback || shieldActive) {
    console.log(`[Offline Sanctuary] Bypassing call (shield active? ${shieldActive}). Active offline wisdom for: ${type}`);
    if (type === "chat") {
      return { text: generateHardcodedFallbackResponse(type, ageGroup, language, messageText) };
    } else if (type === "journal") {
      return generateOfflineJournalAnalysis(messageText);
    } else {
      return generateOfflineRecommendations(mood, triggers, activities, ageGroup);
    }
  }

  // Attempt 1: Standard model (gemini-3.5-flash)
  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config
    });
    if (res && res.text) {
      return res;
    }
  } catch (err: any) {
    const msg = String(err?.message || "").toLowerCase();
    const is429 = msg.includes("429") || msg.includes("quota") || msg.includes("exhausted") || msg.includes("resource_exhausted") || err?.status === "RESOURCE_EXHAUSTED";
    
    if (is429) {
      localQuotaCooldownTimestamp = Date.now() + 65 * 1000; // Shield for 65 seconds
      console.log(`[Quota Shield] Exceeded quota (429). Offline sanctuary activated for 65s. Reason: ${err.message}`);
    } else {
      console.log(`[Gemini API Info] Attempt 1 failed for ${type}:`, err.message);
    }

    // If transient or rate-limit or overload, attempt lightweight backup model if shield isn't active now
    if (isTemporaryError(err) && !is429) {
      try {
        console.log(`[Offline Sanctuary] Trying backup model "gemini-3.1-flash-lite" under peak load:`);
        const fallbackRes = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents,
          config
        });
        if (fallbackRes && fallbackRes.text) {
          return fallbackRes;
        }
      } catch (fallbackErr: any) {
        console.log(`[Gemini API Info] Fallback model also failed:`, fallbackErr.message);
      }
    }
  }

  // Double fallback: activate beautiful manual counseling wisdom responses
  console.log(`[Offline Sanctuary Activation] Sourcing local fallback parser for: ${type}`);
  if (type === "chat") {
    return { text: generateHardcodedFallbackResponse(type, ageGroup, language, messageText) };
  } else if (type === "journal") {
    return generateOfflineJournalAnalysis(messageText);
  } else {
    return generateOfflineRecommendations(mood, triggers, activities, ageGroup);
  }
}

// Middleware to check if Gemini key is configured; we soft-pass to let fallback provide immediate test outcomes
const ensureGeminiKey = (req: any, res: any, next: any) => {
  req.offlineFallback = !process.env.GEMINI_API_KEY;
  next();
};

// 1. Heartbeat
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString()
  });
});

// 2. Chat endpoint (Supports contextual system instructions, translation, and crisis triggers)
app.post("/api/chat", ensureGeminiKey, async (req, res) => {
  try {
    const { message, history, ageGroup, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 24/7 Crisis trigger check
    const crisisTriggers = [
      "suicide", "kill myself", "end my life", "suicidal", "want to die",
      "cutting", "self harm", "overdose", "die tonight", "better off dead",
      "atmahatya", "mar jana", "visha", "jeevan samapt"
    ];
    const lowercaseMsg = message.toLowerCase();
    const crisisDetected = crisisTriggers.some(trigger => lowercaseMsg.includes(trigger));

    if (crisisDetected) {
      return res.json({
        crisisDetected: true,
        text: `I hear how much pain you are in right now, but please know you do not have to carry this alone. I am an AI, and I want to support you in finding professional care immediately. Let us work together to keep you safe. 

Please reach out to the 24/7 helplines right away:
🚨 **AASRA India**: +91-9820466726 
🚨 **Vandrevala Foundation**: +91-9999776666
🚨 **iCall**: +91-9152987821
🚨 **International (Crisis Text Line)**: Text HOME to 741741

Would you like to try a 4-7-8 breathing exercise together right now to help ground you?`,
        suggestedAction: "SOS_ACTIVATION"
      });
    }

    // Context-dependent instructions by age group
    let systemInstruction = `You are "MindCare Mitra", a compassionate, culturally-attuned, and highly qualified IKS (Indian Knowledge System) mental health counselor. 
Your tone must adapt dynamically to the user's lifestage. 
Include deep ancient Indian Wisdom (Ayurveda, Yoga, Vedic psychological states like Sattva, Rajas, Tamas) paired with evidence-based cognitive support strategies.

CRITICAL RULES:
1. Speak exclusively in the requested language: ${language || "English"}. (If English, you can occasionally use beautiful Sanskrit or Hindi terms like Svasthya, Santosha, Pranayama with clear translations).
2. You must never prescribe pharmaceutical medications.
3. Offer concrete, digestible tips (e.g. specific breathing exercises, journal reflections, or gentle postures).
`;

    if (ageGroup === "teen") {
      systemInstruction += `\nTarget Age Group: TEENAGERS (13-18 years).
- Voice and Vibe: Warm, enthusiastic, non-judgmental, emoji-friendly, relatable and reassuring.
- Topics focus: Exam stress, peer pressure, body image, academic anxiety, and social insecurity.
- Counsel strategy: Avoid lecturing them like a parent. Act as a wise, trustworthy older sibling or school mentor. Give brief, highly practical, gamified tips.`;
    } else if (ageGroup === "young") {
      systemInstruction += `\nTarget Age Group: YOUNG ADULTS (19-25 years).
- Voice and Vibe: Modern, sleek, authentic, validating, collaborative.
- Topics focus: Career direction, relationship heartbreaks, identity crises, campus burnout, and financial uncertainty.
- Counsel strategy: Highlight career alignment, self-respect, 'Swadharma' (life purpose), 'Yam-Niyam' ethics, and boundary-setting. Speak with intellectual respect.`;
    } else if (ageGroup === "professional") {
      systemInstruction += `\nTarget Age Group: PROFESSIONALS (26-35 years).
- Voice and Vibe: Grounded, professional, executive, time-conscious, structured.
- Topics focus: Excessive work-hustle, digital burnout, postural back tension, corporate imposter syndrome, and parenting or relationship balancing.
- Counsel strategy: Weave in 'Dinacharya' (daily routines) for cortisol regulation, Nadi Shodhana pranayama for pre-meeting clarity, and cognitive reframing of productivity guilt.`;
    } else if (ageGroup === "mature") {
      systemInstruction += `\nTarget Age Group: MATURE ADULTS (36+ years).
- Voice and Vibe: Deeply respectful, calm, slow-paced, compassionate, reflective.
- Topics focus: Life transition meaning, physical health changes, family caregiving loads, bereavement, and preparing an legacy of peace.
- Counsel strategy: Rely on Vedic concepts of gratitude, mindfulness, Santosha (contentment), joints lubrication, and gentle restorative poses. Use clear definitions, large-text-friendly insights.`;
    }

    // Build chat parameters with history
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Adding current message as part of the request
    const response = await generateContentWithRetry({
      contents: [...formattedHistory, { role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      offlineFallback: (req as any).offlineFallback,
      type: "chat",
      ageGroup,
      language,
      messageText: message
    });

    res.json({
      text: response.text,
      crisisDetected: false
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error?.message || "Failed to call Gemini API" });
  }
});

// 3. Journal Sentiment and IKS Tone Analyzer (Strict JSON response format)
app.post("/api/journal/analyze", ensureGeminiKey, async (req, res) => {
  try {
    const { text, prompt, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Journal text is required" });
    }

    const targetLang = language || "English";
    const systemInstruction = `You are a clinical psychotherapist and Ayurvedic psychology expert who specializes in journal text extraction.
Analyze the user's journal entry. Determine their sentiment, identify the emotional tones, parse key triggers, and extract core keywords.
Provide compassionate clinical recommendations infused with traditional Indian scriptural and lifestyle wisdom (e.g. Sattva calming advice, breathing).
CRITICAL: You MUST write all string fields (tones, keywords, patterns, and advice) in the requested language: ${targetLang}. For example, if Marathi is requested, perform the analysis and output all textual descriptions in Marathi.
Return ONLY a valid JSON object matching the requested schema.`;

    const response: any = await generateContentWithRetry({
      contents: `Prompt Asked to User: "${prompt || "General Reflection"}"\nUser's Journal Text: "${text}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["sentiment", "sentimentScore", "tones", "keywords", "patterns", "advice"],
          properties: {
            sentiment: {
              type: Type.STRING,
              description: "Must be 'positive', 'neutral', or 'negative'"
            },
            sentimentScore: {
              type: Type.NUMBER,
              description: "A sentiment polarity score between -1.0 (extremely negative/hopeless) and 1.0 (extremely positive/grateful)"
            },
            tones: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Emotional qualities detected, translated in target language"
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Top 3 to 5 key themes or people mentioned, translated in target language"
            },
            patterns: {
              type: Type.STRING,
              description: "Observation of recurring emotional cycles, translated in target language"
            },
            advice: {
              type: Type.STRING,
              description: "1-2 paragraphs of soothing feedback incorporating evidence-based psychology and a specific Yogic Pranayama or Ayurvedic lifestyle micro-habit to restore calm, translated in target language."
            }
          }
        }
      },
      offlineFallback: (req as any).offlineFallback,
      type: "journal",
      messageText: text,
      language: targetLang
    });

    const result = (response && typeof response.text === "string")
      ? JSON.parse(response.text || "{}")
      : response;
    res.json(result);
  } catch (error: any) {
    console.error("Journal Analysis API error:", error);
    res.status(500).json({ error: error?.message || "Failed to analyze journal" });
  }
});

// 4. Personalized Recommendations Engine
app.post("/api/recommendations", ensureGeminiKey, async (req, res) => {
  try {
    const { mood, triggers, activities, ageGroup, language } = req.body;
    const targetLang = language || "English";

    const query = `Recommend mental health interventions for a user.
- Age Category: ${ageGroup}
- Current Mood Rating: ${mood}/5 (1 is awful, 5 is excellent)
- Reported Triggers: ${JSON.stringify(triggers || [])}
- Completed Activities Today: ${JSON.stringify(activities || [])}

Provide 3 key actionable things the user can do RIGHT NOW, customized tightly to their life phase. Blend 1 physical yoga suggestion, 1 pranayama breathing/meditation pacer tip, and 1 ancient IKS lifestyle tip (nutrition or routine).
CRITICAL: All generated fields in the JSON response (including dominantGuna, vibeNote, type, title, description, and benefit) MUST be written in the requested language: ${targetLang}. For example, if Marathi is selected, recommendations must be in Marathi. Return clean JSON.`;

    const response: any = await generateContentWithRetry({
      contents: query,
      config: {
        systemInstruction: `You are an expert diagnostic wellness recommender. Return ONLY a valid JSON object according to the schema. You MUST translate all string values into the user's requested language: ${targetLang}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["recommendations", "dominantGuna", "vibeNote"],
          properties: {
            dominantGuna: {
              type: Type.STRING,
              description: "Assess the current mental quality, translated in target language"
            },
            vibeNote: {
              type: Type.STRING,
              description: "A comforting 1-sentence diagnostic note summarizing their vibe state, translated in target language."
            },
            recommendations: {
              type: Type.ARRAY,
              description: "Exactly 3 distinct, curated action items.",
              items: {
                type: Type.OBJECT,
                required: ["type", "title", "description", "benefit", "durationMins"],
                properties: {
                  type: { type: Type.STRING, description: "One of: 'Yoga Pose', 'Breathing Exercise', 'Ayurvedic Habit', translated in target language" },
                  title: { type: Type.STRING, description: "Translated in target language" },
                  description: { type: Type.STRING, description: "Actionable details, translated in target language" },
                  benefit: { type: Type.STRING, description: "Translated in target language" },
                  durationMins: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      },
      offlineFallback: (req as any).offlineFallback,
      type: "recommendations",
      ageGroup,
      mood,
      triggers,
      activities,
      language: targetLang
    });

    const result = (response && typeof response.text === "string")
      ? JSON.parse(response.text || "{}")
      : response;
    res.json(result);
  } catch (error: any) {
    console.error("Recommendations API error:", error);
    res.status(500).json({ error: error?.message || "Failed to obtain recommendations" });
  }
});

// Setup Vite Dev server or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving server in PRODUCTION mode with compiled static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started. Ingress binds to http://0.0.0.0:${PORT}`);
  });
}

startServer();
