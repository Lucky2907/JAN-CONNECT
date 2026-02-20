import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const { t } = useLanguage();

  const quickActions = [
    { id: 'submit', label: t('chatbot.actions.submit'), icon: '📝' },
    { id: 'check', label: t('chatbot.actions.check'), icon: '🔍' },
    { id: 'map', label: t('chatbot.actions.map'), icon: '🗺️' },
    { id: 'contact', label: t('chatbot.actions.contact'), icon: '📞' },
  ];

  const responses = {
    submit: {
      text: t('chatbot.responses.submit'),
      action: () => window.location.href = '/submit-complaint'
    },
    check: {
      text: t('chatbot.responses.check'),
      action: () => window.location.href = '/my-complaints'
    },
    map: {
      text: t('chatbot.responses.map'),
      action: () => window.location.href = '/dashboard'
    },
    contact: {
      text: t('chatbot.responses.contact'),
      action: null
    },
  };

  const handleQuickAction = (actionId) => {
    const userMessage = { type: 'user', text: quickActions.find(a => a.id === actionId)?.label };
    const botMessage = { type: 'bot', text: responses[actionId].text };
    
    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowQuickActions(false);
    
    if (responses[actionId].action) {
      setTimeout(() => responses[actionId].action(), 2000);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowQuickActions(true);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
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
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t('chatbot.title')}</h3>
                    <p className="text-xs text-white/80">{t('chatbot.subtitle')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-md"
                >
                  <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                    {t('chatbot.welcome')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    {t('chatbot.help')}
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
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
              {showQuickActions ? (
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 rounded-xl border border-blue-200 dark:border-blue-700 transition-all text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{action.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {action.label}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={resetChat}
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  {t('chatbot.newQuestion')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
