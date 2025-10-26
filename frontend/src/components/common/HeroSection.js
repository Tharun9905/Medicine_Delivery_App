import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-blue-400 to-blue-200 overflow-hidden py-16 px-4">
      <div className="max-w-4xl w-full mx-auto text-center lg:text-left z-10">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            
            Medicines Delivered
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            in
          </motion.span>
          <motion.div
            className="mt-4 mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="inline-flex items-center bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-white border-opacity-20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-700 leading-none">12-24</div>
                  <div className="text-lg md:text-xl font-semibold text-blue-600 leading-tight">Hours</div>
                </div>
                <div className="hidden sm:flex items-center ml-4">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">⚡ Fast Delivery</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Order prescription & over-the-counter medicines online with lightning-fast delivery
        </motion.p>
        {/* Voice Search Button - commented out */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
          {/*
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`group relative flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg bg-white text-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              listening ? 'ring-4 ring-blue-300 scale-105 bg-blue-50' : 'hover:bg-blue-50'
            }`}
          >
            <div className={`mr-3 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 ${
              listening ? 'bg-blue-200 animate-pulse' : 'group-hover:bg-blue-200'
            }`}>
              <svg
                className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${
                  listening ? 'scale-110' : 'group-hover:scale-110'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v6m0 0l4-4m-4 4L8 3m4 14V7a3 3 0 00-6 0v6a3 3 0 006 0V7z" />
              </svg>
            </div>
            <span>🎤 Voice Search</span>
            {listening && (
              <div className="ml-3 flex space-x-1">
                <div className="w-1 h-4 bg-blue-600 rounded animate-pulse"></div>
                <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </button>
          */}
          <Link
            href="/upload-prescription"
            className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Upload Prescription
          </Link>
        </div>
        {/* Real-time transcript display - commented out */}
        {/*
        {listening && (
          <motion.div
            className="mb-4 w-full bg-white bg-opacity-90 backdrop-blur-sm text-blue-800 rounded-xl px-6 py-4 shadow-lg border border-blue-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="font-mono text-lg">{transcript || 'Listening for your voice...'}</span>
            </div>
          </motion.div>
        )}
        */}
        {/* Voice feedback - commented out */}
        {/*
        {voiceFeedback && (
          <motion.div
            className="mb-4 w-full bg-blue-50 text-blue-800 rounded-xl px-6 py-4 shadow-lg border border-blue-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{voiceFeedback}</span>
            </div>
          </motion.div>
        )}
        */}
        {/* Trust indicators and other hero content can be added here */}
      </div>
      {/* Floating Action Buttons for Pill Reminder, Reorder, Order Reminder */}
      {/* <FABs /> */}
    </section>
  );
}

// --- Floating Action Buttons and Modals ---
// function FABs() {
//   const [showPill, setShowPill] = useState(false);
//   const [showReorder, setShowReorder] = useState(false);
//   const [showOrderReminder, setShowOrderReminder] = useState(false);
//   return (
//     <>
//       <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
//         <button onClick={() => setShowPill(true)} className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-110 hover:from-blue-600 hover:to-blue-800 transition-all">
//           💊 Pill Reminder
//         </button>
//         <button onClick={() => setShowReorder(true)} className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-lg hover:scale-110 hover:from-green-600 hover:to-green-800 transition-all">
//           🔄 Reorder
//         </button>
//         <button onClick={() => setShowOrderReminder(true)} className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-bold shadow-lg hover:scale-110 hover:from-yellow-500 hover:to-yellow-700 transition-all">
//           🔔 Order Reminder
//         </button>
//       </div>
//       {showPill && <PillReminderModal onClose={() => setShowPill(false)} />}
//       {showReorder && <ReorderModal onClose={() => setShowReorder(false)} />}
//       {showOrderReminder && <OrderReminderModal onClose={() => setShowOrderReminder(false)} />}
//     </>
//   );
// }

function PillReminderModal({ onClose }) {
  const [medicine, setMedicine] = useState('');
  const [times, setTimes] = useState({ morning: true, afternoon: false, evening: false });
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [saved, setSaved] = useState(false);
  const enableNotifications = () => {
    if ('Notification' in window) Notification.requestPermission();
  };
  const handleSave = () => {
    setSaved(true);
    enableNotifications();
  };
  return (
    <Modal title="Pill Reminder" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Medicine Name</label>
          <input className="input w-full" value={medicine} onChange={e => setMedicine(e.target.value)} placeholder="e.g. Paracetamol 500mg" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Times</label>
          <div className="flex gap-4">
            <label><input type="checkbox" checked={times.morning} onChange={e => setTimes(t => ({...t, morning: e.target.checked}))} /> Morning (9:00 AM)</label>
            <label><input type="checkbox" checked={times.afternoon} onChange={e => setTimes(t => ({...t, afternoon: e.target.checked}))} /> Afternoon (2:00 PM)</label>
            <label><input type="checkbox" checked={times.evening} onChange={e => setTimes(t => ({...t, evening: e.target.checked}))} /> Evening (8:00 PM)</label>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block font-semibold mb-1">Start Date</label>
            <input type="date" className="input" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Date</label>
            <input type="date" className="input" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
        </div>
        <button onClick={handleSave} className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all">Save Reminder</button>
        {saved && <div className="text-green-600 font-semibold mt-2">Reminder saved! Notifications enabled.</div>}
      </div>
    </Modal>
  );
}

function ReorderModal({ onClose }) {
  const lastOrder = [
    { id: 1, name: 'Paracetamol 500mg', price: 30, checked: true },
    { id: 2, name: 'Vitamin C 1000mg', price: 50, checked: false },
    { id: 3, name: 'Cough Syrup', price: 80, checked: false },
  ];
  const [items, setItems] = useState(lastOrder);
  const total = items.filter(i => i.checked).reduce((sum, i) => sum + i.price, 0);
  const handleCheck = id => setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const [added, setAdded] = useState(false);
  return (
    <Modal title="Reorder Medicines" onClose={onClose}>
      <div className="space-y-4">
        <div className="font-semibold mb-2">Last Order</div>
        <div className="space-y-2">
          {items.map(item => (
            <label key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition">
              <input type="checkbox" checked={item.checked} onChange={() => handleCheck(item.id)} />
              <span className="flex-1">{item.name}</span>
              <span className="text-blue-700 font-bold">₹{item.price}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button onClick={() => setAdded(true)} className="w-full mt-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 rounded-xl hover:from-green-600 hover:to-green-800 transition-all">Add to Cart</button>
        {added && <div className="text-green-600 font-semibold mt-2">Items added to cart! Redirecting...</div>}
      </div>
    </Modal>
  );
}

function OrderReminderModal({ onClose }) {
  const [supply, setSupply] = useState(30);
  const [used, setUsed] = useState(20);
  const remaining = supply - used;
  return (
    <Modal title="Order Reminder" onClose={onClose}>
      <div className="space-y-4">
        <div className="font-semibold">Medicine: Paracetamol 500mg</div>
        <div>Supply: {supply} days</div>
        <div>Used: {used} days</div>
        <div className={remaining <= 7 ? 'text-red-600 font-bold' : 'text-green-700 font-bold'}>
          {remaining <= 7 ? `Only ${remaining} days left!` : `${remaining} days left`}
        </div>
        {remaining <= 7 && (
          <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all mt-2">Reorder Now</button>
        )}
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
