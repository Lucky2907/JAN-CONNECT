import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildActiveRedCircles, evaluateRedCircleGeofence } from '../utils/geofencingEngine';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [pendingIssueDetails, setPendingIssueDetails] = useState(false);
  const [lastTicketId, setLastTicketId] = useState(null);
  const { complaints, user } = useApp();
  const messageEndRef = useRef(null);

  const redCircles = useMemo(() => buildActiveRedCircles(complaints), [complaints]);

  const quickActions = [
    { id: 'report', label: 'Report Issue', preset: 'There is a pothole near my area.' },
    { id: 'zone', label: 'Red Zone Alert', preset: 'Any red zone near me?' },
    { id: 'trust', label: 'My Trust Score', preset: 'What is my trust score?' },
    { id: 'officer', label: 'Connect Officer', preset: 'Need officer support' },
  ];

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const containsHindiScript = (text) => /[\u0900-\u097F]/.test(text);

  const makeTicketId = () => {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `JAN-${datePart}-${randomPart}`;
  };

  const parseCoordinates = (text) => {
    const match = text.match(/(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
    if (!match) {
      return null;
    }
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2])
    };
  };

  const getTrustScoreResponse = (isHindiQuery) => {
    if (!user?.citizenId) {
      return isHindiQuery
        ? 'Aapka trust score dekhne ke liye citizen account se login karein.'
        : 'Please log in with your citizen account to view your Trust Score.';
    }

    const myComplaints = complaints.filter((complaint) => complaint.citizenId === user.citizenId);
    const resolvedCount = myComplaints.filter((complaint) => complaint.status === 'Resolved').length;
    const upvotePoints = myComplaints.reduce((sum, complaint) => sum + Math.max((complaint.upvotes || 1) - 1, 0), 0);
    const score = (myComplaints.length * 5) + (resolvedCount * 10) + (upvotePoints * 2);

    return isHindiQuery
      ? `Aapka current Trust Score ${score} points hai. Score badhane ke liye: sahi location ke saath genuine reports bhejein, clear photo upload karein, aur duplicate complaints ko upvote karein.`
      : `Your current Trust Score is ${score} points. To improve it: submit accurate reports with clear location, upload valid photos, and upvote existing similar complaints.`;
  };

  const fallbackOfficerMessage = "I'll connect you to a JAN CONNECT officer.";

  const buildBotReply = (rawText) => {
    const text = rawText.trim();
    const lower = text.toLowerCase();
    const isHindiQuery = containsHindiScript(text);

    const issuePattern = /pothole|broken light|street light|waterlogging|water logging|garbage|trash|waste|drainage|sewer|manhole/i;
    const redZonePattern = /red zone|restricted area|safety alert|danger zone|unsafe zone|geofence/i;
    const trustPattern = /trust score|trust points|my score|points/i;
    const officerPattern = /officer|agent|human|support|helpdesk/i;

    if (pendingIssueDetails) {
      const hasLocation = /location|near|at\s|latitude|longitude|\d{1,2}\.\d+\s*,\s*\d{1,3}\.\d+/i.test(lower);
      const hasPhoto = /photo|image|pic|upload|attached|jpg|jpeg|png/i.test(lower);

      if (hasLocation && hasPhoto) {
        const ticketId = makeTicketId();
        setLastTicketId(ticketId);
        setPendingIssueDetails(false);
        return isHindiQuery
          ? `Shukriya. Complaint submit ho gayi hai. Ticket ID: ${ticketId}. Status track karne ke liye My Complaints dekhein.`
          : `Thanks. Your complaint has been submitted. Ticket ID: ${ticketId}. You can track status in My Complaints.`;
      }

      if (!hasLocation && !hasPhoto) {
        return isHindiQuery
          ? 'Please location aur photo dono bhejein, tabhi complaint register hogi.'
          : 'Please share both your location and a photo to register this complaint.';
      }

      if (!hasLocation) {
        return isHindiQuery
          ? 'Location missing hai. Kripya area ka exact address ya GPS coordinates bhejein.'
          : 'Location is missing. Please share the exact address or GPS coordinates.';
      }

      return isHindiQuery
        ? 'Photo missing hai. Kripya issue ki clear photo upload karein.'
        : 'Photo is missing. Please upload a clear photo of the issue.';
    }

    if (issuePattern.test(lower)) {
      setPendingIssueDetails(true);
      return isHindiQuery
        ? 'Main complaint register kar deta hoon. Kripya location aur issue ki photo bhejein.'
        : 'I can register this complaint. Please share your location and a photo of the issue.';
    }

    if (redZonePattern.test(lower)) {
      if (!redCircles.length) {
        return fallbackOfficerMessage;
      }

      const coords = parseCoordinates(text);
      if (coords) {
        const geofenceResult = evaluateRedCircleGeofence(coords, redCircles, {
          defaultPoliceSubstation: 'Central Substation'
        });

        if (geofenceResult.status === 'SAFE') {
          return isHindiQuery
            ? 'Aap abhi safe zone mein hain. Koi active red circle breach nahi mila.'
            : 'You are currently in a safe zone. No active red-circle breach detected.';
        }

        return isHindiQuery
          ? `Alert: ${geofenceResult.zone_name} ke paas restricted zone hai. ${geofenceResult.citizen_message}`
          : `Alert: ${geofenceResult.zone_name} is a restricted zone. ${geofenceResult.citizen_message}`;
      }

      const zone = redCircles[0];
      return isHindiQuery
        ? `Active red zone: ${zone.name} (${zone.reason}). Kripya iss area se door rahen.`
        : `Active red zone: ${zone.name} (${zone.reason}). Please stay away from this area.`;
    }

    if (trustPattern.test(lower)) {
      return getTrustScoreResponse(isHindiQuery);
    }

    if (officerPattern.test(lower)) {
      return fallbackOfficerMessage;
    }

    return fallbackOfficerMessage;
  };

  const handleSendMessage = (customText = null) => {
    const messageText = (customText || inputText).trim();
    if (!messageText) {
      return;
    }

    const userMessage = { type: 'user', text: messageText };
    const botMessage = { type: 'bot', text: buildBotReply(messageText) };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputText('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-orange-500 via-white to-green-500 text-blue-900 rounded-full shadow-xl border border-blue-200 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-blue-200"
          >
            {/* Header */}
            <div className="bg-blue-900 p-4 text-white border-b-4 border-orange-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">JAN CONNECT Civic Assistant</h3>
                    <p className="text-xs text-blue-100">Govt Helpline Support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-500" />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200"
                >
                  <p className="text-slate-800 text-base font-semibold">
                    Namaste. How can I help you today?
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Report urban issues, check red-zone alerts, or ask about your Trust Score.
                  </p>
                </motion.div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-blue-800 text-white rounded-br-none'
                        : 'bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    onClick={() => handleSendMessage(action.preset)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 transition-all text-left"
                  >
                    <span className="text-xs font-semibold text-slate-700">{action.label}</span>
                  </motion.button>
                ))}
              </div>

              {lastTicketId && (
                <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  Last ticket: {lastTicketId}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700/30 focus:border-blue-700"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2.5 rounded-xl bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
