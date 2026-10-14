import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Home, ArrowRight } from 'lucide-react';
import { chatWithAi } from '../services/api';
import { Link } from 'react-router-dom';

const AiChatbot = ({ propertyContextId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your SmartRent AI Real-Estate Advisor. Ask me anything about fair rental values, lease contracts, pet policies, or neighborhood safety!',
      suggestions: [
        'What is fair rent for a 2BHK in Bengaluru?',
        'What are standard security deposit terms?',
        'Find quiet pet-friendly homes',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text || !text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await chatWithAi({
        message: text,
        propertyId: propertyContextId,
        history,
      });

      const botMessage = {
        role: 'assistant',
        content: res.data.reply,
        suggestions: res.data.followUpSuggestions,
        suggestedProperties: res.data.suggestedProperties,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I am currently operating with local heuristics. Standard security deposits are 2-3 months rent and rental agreements typically have an 11-month tenure with a 1-month lock-in period.',
          suggestions: ['Explore available homes', 'Check price predictor'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 font-medium text-sm"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
          </div>
          <span>AI Assistant</span>
          <span className="hidden group-hover:inline-block text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
            Chat
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  SmartRent AI Advisor
                  <span className="text-[10px] bg-emerald-400 text-emerald-950 font-semibold px-2 py-0.2 rounded-full">
                    Online
                  </span>
                </h4>
                <p className="text-[11px] text-blue-100">
                  Instant rental valuations & lease advice
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Suggested Properties mini-cards */}
                  {msg.suggestedProperties && msg.suggestedProperties.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-2">
                      <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-indigo-500" /> Suggested Properties:
                      </p>
                      {msg.suggestedProperties.map((p) => (
                        <Link
                          key={p.id}
                          to={`/properties/${p.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 transition-colors"
                        >
                          <div className="truncate mr-2">
                            <p className="font-semibold text-slate-900 truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-500">₹{p.price?.toLocaleString()}/mo • {p.city}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200/60 transition-colors text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-2">
                <Bot className="w-4 h-4 animate-bounce text-indigo-600" />
                <span className="italic">AI is analyzing real estate parameters...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about rent, deposits, amenities..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
