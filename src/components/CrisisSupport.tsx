import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Phone, Compass, Plus, Sparkles, MapPin, Heart, ListTodo, CheckCircle } from 'lucide-react';
import { t } from '../utils/translations';

interface CrisisProps {
  language: string;
}

export default function CrisisSupport({ language }: CrisisProps) {
  const [activeTab, setActiveTab] = useState<'helplines' | 'grounding' | 'safetyPlan'>('helplines');

  // Grounding Game States
  const [groundingStep, setGroundingStep] = useState(1);
  const [groundingAnswers, setGroundingAnswers] = useState<Record<number, string[]>>({
    5: [], 4: [], 3: [], 2: [], 1: []
  });
  const [currInput, setCurrInput] = useState('');

  // Safety Plan States
  const [trustedContacts, setTrustedContacts] = useState<Array<{ name: string; phone: string }>>([
    { name: 'Mom/Dad (Sample)', phone: '+91-9876543210' }
  ]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [triggers, setTriggers] = useState<string[]>([
    'Late night screen scrolling',
    'Unregulated caffeine intake',
    'Comparing test grades with peer circles'
  ]);
  const [newTrigger, setNewTrigger] = useState('');

  const [copingMechanisms, setCopingMechanisms] = useState<string[]>([
    'Perform 5 minutes of alternate nostril pranayama (Nadi Shodhana)',
    'Go outdoors and put bare feet on warm soil/grass'
  ]);
  const [newCoping, setNewCoping] = useState('');

  const helplines = [
    { country: 'India', name: 'AASRA Helpline', number: '9820466726', hours: '24/7 Support', info: 'Direct peer counseling' },
    { country: 'India', name: 'Vandrevala Foundation', number: '9999-77-6666', hours: '24/7 Support', info: 'Multilingual assistance' },
    { country: 'India', name: 'iCall Tata Institute', number: '9152987821', hours: '08:00 AM - 10:00 PM', info: 'Clinical psychological support' },
    { country: 'International', name: 'Crisis Text Line', number: 'Text HOME to 741741', hours: '24/7 Support', info: 'Text alternative support' },
    { country: 'International', name: 'IASP Association', number: 'www.iasp.info/resources', hours: 'Globally listed resources', info: 'Portal lookup' }
  ];

  const handleAddContact = () => {
    if (!contactName || !contactPhone) return;
    setTrustedContacts([...trustedContacts, { name: contactName, phone: contactPhone }]);
    setContactName('');
    setContactPhone('');
  };

  const handleAddTrigger = () => {
    if (!newTrigger) return;
    setTriggers([...triggers, newTrigger]);
    setNewTrigger('');
  };

  const handleAddCoping = () => {
    if (!newCoping) return;
    setCopingMechanisms([...copingMechanisms, newCoping]);
    setNewCoping('');
  };

  const handleAddGroundingItem = () => {
    if (!currInput.trim()) return;
    const key = groundingStep === 1 ? 5 : groundingStep === 2 ? 4 : groundingStep === 3 ? 3 : groundingStep === 4 ? 2 : 1;
    const currentList = groundingAnswers[key] || [];

    if (currentList.length < key) {
      setGroundingAnswers({
        ...groundingAnswers,
        [key]: [...currentList, currInput]
      });
      setCurrInput('');
    }
  };

  const nextGroundingStep = () => {
    if (groundingStep < 5) {
      setGroundingStep(groundingStep + 1);
      setCurrInput('');
    }
  };

  const resetGroundingStep = () => {
    setGroundingStep(1);
    setGroundingAnswers({ 5: [], 4: [], 3: [], 2: [], 1: [] });
    setCurrInput('');
  };

  const renderGroundingSection = () => {
    const stepsConf = [
      { step: 1, count: 5, prompt: 'Things you can SEE around you right now (describe them aloud)', icon: '👁️' },
      { step: 2, count: 4, prompt: 'Physical sensations you can TOUCH (e.g. wool sweater, glass table)', icon: '✋' },
      { step: 3, count: 3, prompt: 'Audible sounds you can HEAR (e.g. ticking clock, ventilation buzz)', icon: '👂' },
      { step: 4, count: 2, prompt: 'Environmental odors you can SMELL (e.g. wet soil, dry paper)', icon: '👃' },
      { step: 5, count: 1, prompt: 'Flavors you can TASTE (even lingering hints of coffee or water)', icon: '👅' }
    ];

    const activeConf = stepsConf[groundingStep - 1];
    const userEnteredList = groundingAnswers[activeConf.count] || [];
    const needed = activeConf.count;

    return (
      <div className="space-y-6">
        <div className="bg-slate-50 border p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-3xl block">{activeConf.icon}</span>
            <h4 className="font-bold text-slate-900 mt-2 text-sm">Step {groundingStep} of 5: cognitive grounding</h4>
            <p className="text-xs text-slate-500 leading-normal max-w-md">{activeConf.prompt}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-semibold uppercase text-indigo-750">Items logged:</span>
            <p className="text-xl font-bold text-indigo-900 font-mono mt-0.5">{userEnteredList.length} / {needed}</p>
          </div>
        </div>

        {/* Input tray for grounding */}
        {userEnteredList.length < needed ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={currInput}
              onChange={(e) => setCurrInput(e.target.value)}
              placeholder="e.g. Green plant in the corner"
              onKeyDown={(e) => e.key === 'Enter' && handleAddGroundingItem()}
              className="flex-1 px-4 py-3 bg-white border border-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-850"
            />
            <button
              onClick={handleAddGroundingItem}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-4 rounded-xl text-xs transition"
            >
              Add
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            {groundingStep < 5 ? (
              <button
                onClick={nextGroundingStep}
                className="px-6 py-2 bg-emerald-650 hover:bg-emerald-705 text-white font-semibold rounded-lg text-xs transition"
              >
                Proceed to Next Step (✔)
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-emerald-800 bg-emerald-50 border p-3 rounded-xl font-medium">
                  🌟 Grounding exercise completed! You successfully redirected your cognitive priorities back to the present. How is your chest tension?
                </p>
                <button
                  onClick={resetGroundingStep}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition"
                >
                  Restart Grounding
                </button>
              </div>
            )}
          </div>
        )}

        {/* Entered Answers Checklist */}
        {userEnteredList.length > 0 && (
          <div className="p-4 bg-slate-50/50 border rounded-xl space-y-1.5 text-xs text-slate-700">
            <div className="font-mono uppercase font-bold text-[10px] text-slate-400">Current checklist:</div>
            {userEnteredList.map((ans, idx) => (
              <p key={idx} className="flex gap-1.5 items-center">
                <span className="text-emerald-555">✔</span> {ans}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Dynamic Tabs */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex gap-2 overflow-x-auto border-b border-slate-150 pb-3">
          <button
            onClick={() => setActiveTab('helplines')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition focus:outline-none ${
              activeTab === 'helplines'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border hover:bg-slate-50 text-slate-755 font-semibold'
            }`}
          >
            ☎ {t('sos.tab_helplines', language) || 'Helpline Directories'}
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition focus:outline-none ${
              activeTab === 'grounding'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border hover:bg-slate-50 text-slate-755 font-semibold'
            }`}
          >
            ⚓ {t('sos.tab_grounding', language) || '5-4-3-2-1 Grounding Game'}
          </button>
          <button
            onClick={() => setActiveTab('safetyPlan')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition focus:outline-none ${
              activeTab === 'safetyPlan'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border hover:bg-slate-50 text-slate-755 font-semibold'
            }`}
          >
            🛡 {t('sos.tab_safety', language) || 'Personal Crisis Safety Plan'}
          </button>
        </div>

        {activeTab === 'helplines' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">{t('sos.title', language) || 'Crisis Helpline Resources'}</h3>
            <p className="text-xs text-slate-500 leading-normal">{t('sos.subtitle', language) || 'Reach out to compassionate, trained clinical counseling experts.'}</p>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helplines.map((hel, i) => (
                <div key={i} className="bg-white border border-slate-200 hover:border-rose-200 p-5 rounded-2xl flex flex-col justify-between gap-4 transition">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider font-mono text-rose-800 bg-rose-50 border border-rose-100 rounded">
                      {hel.country}
                    </span>
                    <h4 className="font-extrabold text-slate-900 mt-2 text-sm">{hel.name}</h4>
                    <p className="text-slate-500 text-xs">{hel.info}</p>
                    <p className="text-[10px] text-slate-400 font-mono italic">{hel.hours}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1.5">
                    <span className="font-bold font-mono text-rose-700 text-sm">{hel.number}</span>
                    <a
                      href={`tel:${hel.number.replace(/[^0-9+]/g, '')}`}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-lg text-[10px] uppercase leading-none transition"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'grounding' && renderGroundingSection()}

        {activeTab === 'safetyPlan' && (
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2">
                <Heart className="w-4.5 h-4.5 text-rose-600" /> Crisis Safety Blueprint
              </h4>
              <p className="text-xs text-slate-500 leading-normal">
                This dynamic layout acts as your visual baseline when feelings of helplessness escalate. Establish your trusted contacts and write coping strategies.
              </p>

              {/* Trusted Contacts */}
              <div className="space-y-4 pt-1">
                <div>
                  <h5 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2">Trusted Safety Contacts</h5>
                  <div className="space-y-2">
                    {trustedContacts.map((tc, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                        <span className="font-bold">{tc.name}</span>
                        <span className="font-mono text-slate-500">{tc.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact Name"
                    className="flex-1 px-3 py-2 border rounded-xl text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone number"
                    className="flex-1 px-3 py-2 border rounded-xl text-xs text-slate-800"
                  />
                  <button
                    onClick={handleAddContact}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Add Contact
                  </button>
                </div>
              </div>

              {/* Triggers list */}
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h5 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2">Recognized Panic Triggers</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {triggers.map((trig, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 border rounded-lg">
                        {trig}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    placeholder="e.g. Back-to-back notifications"
                    className="flex-1 px-3 py-2 border rounded-xl text-xs text-slate-800"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTrigger()}
                  />
                  <button
                    onClick={handleAddTrigger}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-semibold transition"
                  >
                    Log Trigger
                  </button>
                </div>
              </div>

              {/* Coping Mechanisms */}
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h5 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2">Personal Coping Actions</h5>
                  <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5">
                    {copingMechanisms.map((cop, i) => (
                      <li key={i}>{cop}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCoping}
                    onChange={(e) => setNewCoping(e.target.value)}
                    placeholder="e.g. Listen to Vedic Om soundtrack"
                    className="flex-1 px-3 py-2 border rounded-xl text-xs text-slate-800"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCoping()}
                  />
                  <button
                    onClick={handleAddCoping}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-semibold transition"
                  >
                    Save Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency grounding sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-250 p-6 rounded-2xl shadow-sm text-slate-900">
          <div className="w-10 h-10 bg-rose-200 rounded-xl flex items-center justify-center text-rose-700 mb-4 animate-bounce">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-rose-955 text-sm uppercase font-mono tracking-wider">{t('sos.alert_title', language) || 'Emergency SOS Guide'}</h4>
          <p className="text-xs text-rose-900 leading-relaxed mt-2">
            {t('sos.alert_desc', language) || 'If you are having severe feelings of panic physical chest tightness, or harmful self-harm urges, please put down work tasks immediate.'}
          </p>

          <div className="bg-white/80 p-3 rounded-xl border border-rose-100 text-xs leading-relaxed space-y-2 text-rose-900 font-medium mt-4">
            <p><strong>Safety Promise</strong>:</p>
            <p className="italic">"My mental health is exceptionally precious. I promise to delay any harmful reactions and reach out to one professional or safety helpline right now."</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3 font-medium text-slate-700 text-xs">
          <h5 className="font-bold text-slate-950 uppercase font-mono tracking-wide text-[10px]">Nearby Wellness Support</h5>
          <div className="flex gap-2.5 items-start mt-1">
            <MapPin className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-850">Local Public Centers</p>
              <p className="text-[10px] text-slate-455 leading-normal">Emergency medical facilities are accessible in all Indian municipalities. Seek \'Clinical Outpatient\' service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
