import React, { useState } from 'react';
import { motion } from 'motion/react';
import { THERAPISTS } from '../data';
import { Therapist } from '../types';
import { UserCheck, Star, Calendar, MessageSquare, ChevronRight, CheckCircle, ShieldCheck, Share2, ClipboardList } from 'lucide-react';
import { t } from '../utils/translations';

interface DirectorProps {
  onBookConfirmed: (therapistName: string, dateSlot: string) => void;
  resultsSharedCount: number;
  language: string;
}

export default function TherapistDirectory({ onBookConfirmed, resultsSharedCount, language }: DirectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  
  // Simulated Secure Chat Session
  const [chatActive, setChatActive] = useState(false);
  const [msgInput, setMsgInput] = useState('');
  const [therapistMsgs, setTherapistMsgs] = useState([
    { sender: 'therapist', text: 'Namaste! I reviewed your dashboard mood metrics earlier. Our yoga breath limits look very effective for calming your Rajas (agitative) waves. How is your sleep cycle?', time: '9:30 AM' }
  ]);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [shareConsent, setShareConsent] = useState(true);

  const filteredTherapists = THERAPISTS.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialty.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConfirmBooking = () => {
    if (!selectedTherapist || !activeSlot) return;
    setBookingConfirmed(true);
    onBookConfirmed(selectedTherapist.name, activeSlot);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedTherapist(null);
      setActiveSlot(null);
    }, 4500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const userMsg = { sender: 'user', text: msgInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setTherapistMsgs(prev => [...prev, userMsg]);
    setMsgInput('');

    // Simulated reply
    setTimeout(() => {
      setTherapistMsgs(prev => [
        ...prev,
        {
          sender: 'therapist',
          text: `Thank you for sharing. For your homework homework task today, I want you to carry out 10 mins of 'Balasana' child pose followed by 5 mins of gratitude journaling before screens. Let's discuss outcomes during our calendar call.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 font-sans text-slate-800">
      {/* Directory listing */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-1.5">
              <UserCheck className="w-5.5 h-5.5 text-indigo-650" /> {t('therapists.title', language) || 'Expert Therapist Directory'}
            </h2>
            <p className="text-xs text-slate-500">{t('therapists.subtitle', language) || 'Vetted clinical psychotherapists specialized in IKS counseling'}</p>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('therapists.search', language) || 'Search specialties, anxiety, IKS...'}
            className="px-4 py-2 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl text-xs w-full sm:w-64"
          />
        </div>

        {/* Unified sharing consent slider */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-150 rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Direct Clinical Integration</h4>
            <p className="text-[11px] text-indigo-800 leading-normal">
              Authorize securely sharing your GAD-7, mood trajectories, and Ayurvedic profiles with chosen therapists.
            </p>
          </div>
          <button
            onClick={() => setShareConsent(!shareConsent)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition focus:outline-none shrink-0 ${
              shareConsent ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {shareConsent ? 'Active Shared (✔)' : 'Offline/Private'}
          </button>
        </div>

        <div className="space-y-4">
          {filteredTherapists.map((ther) => (
            <div key={ther.id} className="bg-white border hover:border-indigo-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-3xl shrink-0">
                  {ther.image}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 leading-tight">{ther.name}</h3>
                    <div className="flex items-center text-amber-500 text-xs font-extrabold gap-0.5 font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" /> {ther.rating}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-indigo-700 font-mono tracking-wide">{ther.role}</p>

                  <div className="flex flex-wrap gap-1 mt-1 pb-1">
                    {ther.specialty.map((spec) => (
                      <span key={spec} className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-slate-100 text-slate-600 font-bold rounded">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 leading-normal">
                    {t('therapists.experience', language) || 'Experience'}: <span className="font-semibold text-slate-800">{ther.experience} {t('yoga.years', language) || 'years'}</span> • {t('therapists.languages', language) || 'Languages'}: {ther.languages.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col justify-between items-end shrink-0 md:border-l pl-0 md:pl-5 border-slate-150 gap-4">
                <div className="text-left md:text-right">
                  <p className="text-xs font-bold text-slate-800">{ther.price}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{t('therapists.vetted', language) || 'Verified Session Fee'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTherapist(ther);
                      setActiveSlot(null);
                      setChatActive(false);
                      setBookingConfirmed(false);
                    }}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Call
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTherapist(ther);
                      setChatActive(true);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Send Secure Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking and homework drawer */}
      <div className="lg:col-span-5 space-y-6">
        {selectedTherapist ? (
          <div>
            {!chatActive ? (
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 border-b pb-3 mb-4 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4.5 h-4.5 text-indigo-600" /> Book Video Consultation
                </h3>

                <div className="text-center py-4 mb-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 text-indigo-700">
                    {selectedTherapist.image}
                  </div>
                  <h4 className="font-extrabold text-slate-900">{selectedTherapist.name}</h4>
                  <p className="text-xs text-indigo-700 font-mono italic">{selectedTherapist.role}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono mb-2">Available Slots This Week</label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTherapist.availability.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setActiveSlot(slot)}
                          className={`p-2 rounded-xl text-xs font-semibold focus:outline-none border transition text-center ${
                            activeSlot === slot
                              ? 'bg-indigo-650 border-indigo-650 text-white shadow-sm font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {shareConsent && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-150 flex items-start gap-2.5">
                      <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        <strong>Consent active</strong>: Sharing {resultsSharedCount} past diagnostic scores securely with {selectedTherapist.name}.
                      </p>
                    </div>
                  )}

                  {bookingConfirmed ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-emerald-50 text-emerald-850 rounded-xl text-center border font-medium text-xs flex items-center justify-center gap-2 animate-pulse"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Booking confirmed! Link has been exported.
                    </motion.div>
                  ) : (
                    <button
                      onClick={handleConfirmBooking}
                      disabled={!activeSlot}
                      className="w-full bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition"
                    >
                      Confirm and Schedule Call
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Messaging Panel
              <div className="bg-white border rounded-2xl overflow-hidden shadow-sm h-[400px] flex flex-col justify-between">
                <div className="px-5 py-3.5 bg-slate-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedTherapist.image}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-none">{selectedTherapist.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-mono font-bold mt-1">● Secure Sync Active</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatActive(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Calendar Slots
                  </button>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {therapistMsgs.map((m, i) => {
                    const isTher = m.sender === 'therapist';
                    return (
                      <div key={i} className={`flex ${isTher ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs ${
                          isTher ? 'bg-slate-100 text-slate-800 rounded-bl-none' : 'bg-indigo-650 text-white rounded-br-none'
                        }`}>
                          {m.text}
                          <span className={`block text-[8px] mt-1 text-right ${isTher ? 'text-slate-400' : 'text-indigo-200'}`}>{m.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Prescription box */}
                <div className="bg-indigo-50/50 p-2.5 border-t border-slate-100 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-600 shrink-0" />
                  <p className="text-[10px] text-slate-550 leading-tight">
                    <strong>Prescription/Task Activity</strong>: Perform Balasana posture & writing daily gratitude before sleep.
                  </p>
                </div>

                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
                  <input
                    type="text"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    placeholder="Ask therapist regarding homework..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-650 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition"
                  >
                    Post
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-8 shadow-sm text-center border-dashed">
            <ClipboardList className="w-10 h-10 text-slate-350 mx-auto mb-3" />
            <p className="text-xs font-medium text-slate-500">Pick a professional guide.</p>
            <p className="text-[10px] text-slate-400 mt-1">Check credentials or initiate scheduling from any profile card.</p>
          </div>
        )}
      </div>
    </div>
  );
}
