// Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getBotResponse } from "../lib/actions/chatbot";
import AudioRecorder from "../components/AudioRecorder";

const Chatbot = () => {
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: "1",
      text:
        language === "en"
          ? "Hello! I'm your AI farming assistant. Ask anything about crops, weather, or Kerala farming."
          : "ഹലോ! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായിയാണ്. കേരളത്തിലെ കൃഷി, കാലാവസ്ഥ, രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കൂ.",
      sender: "bot",
      timestamp: new Date(),
      templateId: 1,
      answer:
        language === "en"
          ? "Hello! I'm your AI farming assistant. Ask anything about crops, weather, or Kerala farming."
          : "ഹലോ! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായിയാണ്. കേരളത്തിലെ കൃഷി, കാലാവസ്ഥ, രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കൂ.",
      steps: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const suggestions = [
    "Help me profile a new farmer for Krishi Sakhi",
    "What should I do on my field this week based on weather?",
    "Log an activity: irrigated 1 acre of banana today evening",
    "Are there any pest outbreaks reported near my village?",
  ];

  const quickQuestions = [
    "Best time to plant rice in Kerala?",
    "How to prevent coconut diseases?",
    "Current weather suitable for planting?",
    "Organic fertilizer recommendations",
  ];

  // Scroll to latest message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Audio play / stop
  const playBotAudio = (base64audio) => {
    try {
      if (!base64audio) return;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audioBlob = new Blob(
        [Uint8Array.from(atob(base64audio), (c) => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSend = async (textFromBtn) => {
    const content = (textFromBtn ?? input).trim();
    if (!content) return;

    const userMessage = {
      id: Date.now().toString(),
      text: content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    if (!hasAskedQuestion) setHasAskedQuestion(true);

    try {
      const botText = await getBotResponse(content);
      let botResponseData;
      try {
        // If your API already returns { answer, templateId, steps, audioBase64 }
        botResponseData = botText;
      } catch {
        botResponseData = { answer: botText, templateId: 1, steps: [] };
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        timestamp: new Date(),
        ...botResponseData,
      };

      if (botResponseData.audioBase64) {
        playBotAudio(botResponseData.audioBase64);
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          timestamp: new Date(),
          answer: "Sorry, something went wrong. Please try again later.",
          templateId: 1,
          steps: [],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: "1",
        text:
          language === "en"
            ? "New chat started. Tell me about your field or question."
            : "പുതിയ സംഭാഷണം ആരംഭിച്ചു. നിങ്ങളുടെ വയലിനെക്കുറിച്ചോ സംശയത്തെക്കുറിച്ചോ പറയൂ.",
        sender: "bot",
        timestamp: new Date(),
        templateId: 1,
        answer:
          language === "en"
            ? "New chat started. Tell me about your field or question."
            : "പുതിയ സംഭാഷണം ആരംഭിച്ചു. നിങ്ങളുടെ വയലിനെക്കുറിച്ചോ സംശയത്തെക്കുറിച്ചോ പറയൂ.",
        steps: [],
      },
    ]);
    setInput("");
    setHasAskedQuestion(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-emerald-50/90 border-r border-emerald-100">
        <div className="px-4 pt-5 pb-2">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
            Krishi Sakhi
          </p>
          <p className="text-[11px] text-emerald-600">
            Personal farming assistant
          </p>
        </div>

        <button
          className="mx-4 my-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-sm shadow-sm"
          onClick={startNewConversation}
        >
          <span className="text-lg leading-none">＋</span>
          <span>New conversation</span>
        </button>

        <div className="px-4 mt-3 text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
          Recent sessions
        </div>

        {/* simple static list for now */}
        <nav className="mt-1 flex-1 overflow-y-auto text-sm space-y-1 px-2 pb-4">
          {suggestions.map((item) => (
            <button
              key={item}
              className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-100/80 text-emerald-900 text-xs"
              onClick={() => handleSend(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 mt-auto bg-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
              KS
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-emerald-900">
                Console
              </span>
              <span className="text-[11px] text-emerald-600">
                Kerala pilot · 2025
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
        <section className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-6 py-6 space-y-6">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-medium text-emerald-700 tracking-wide uppercase">
              AI-powered farming companion
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-emerald-900 leading-tight">
              Walk with every farmer through the entire crop cycle.
            </h1>
            <p className="text-sm md:text-base text-emerald-800">
              Krishi Sakhi gives Kerala’s smallholder farmers timely, field‑level
              guidance by combining their own records with local weather, pest,
              and scheme data.
            </p>
          </div>

          {/* Suggestions row */}
          <div className="w-full max-w-3xl mx-auto space-y-3">
            <p className="text-sm text-emerald-800">
              Use these prompts to get started:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => handleSend(text)}
                  className="flex items-start gap-3 px-3 py-3 rounded-2xl bg-white/80 hover:bg-emerald-50 border border-emerald-100 text-left shadow-sm"
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-600">
                    ✦
                  </div>
                  <span className="text-[13px] text-emerald-900 leading-snug">
                    {text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div className="w-full max-w-3xl mx-auto border border-emerald-100 rounded-2xl bg-white/80 p-3 text-sm max-h-80 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    msg.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      msg.sender === "user" ? "bg-green-600" : "bg-blue-600"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`p-2 rounded-lg text-xs ${
                      msg.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.sender === "bot" && msg.templateId === 2 ? (
                      <div>
                        <p>{msg.answer}</p>
                        <ol className="list-decimal list-inside mt-1 text-xs text-gray-700">
                          {msg.steps.map((step, idx) => (
                            <li key={idx} className="text-black">
                              {step.replace("**", "")}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <p>{msg.answer || msg.text}</p>
                    )}
                    <p
                      className={`mt-1 text-[10px] ${
                        msg.sender === "user"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-blue-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-2 rounded-lg bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions strip */}
          {!hasAskedQuestion && (
            <div className="w-full max-w-3xl mx-auto border border-emerald-100 rounded-2xl bg-emerald-50/80 px-3 py-2">
              <p className="text-[11px] font-medium text-emerald-900 mb-1">
                Quick questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="px-2 py-1 bg-white border border-emerald-100 rounded-full text-[10px] text-emerald-700 hover:bg-emerald-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl mx-auto rounded-2xl bg-white/90 border border-emerald-100 flex items-center px-4 py-2 gap-2 shadow-sm"
          >
            <span className="text-lg text-emerald-500">🌾</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder={
                language === "en"
                  ? "Ask your farming question..."
                  : "നിങ്ങളുടെ കൃഷി ചോദ്യം ചോദിക്കുക..."
              }
              className="flex-1 px-2 py-2 bg-transparent outline-none text-sm text-emerald-900 placeholder:text-emerald-400"
            />

            <AudioRecorder setMessage={setInput} setProcessing={setIsTyping} />

            {isPlaying && (
              <button
                type="button"
                onClick={stopAudio}
                className="px-2 py-2 bg-red-500 text-white rounded-lg text-[11px]"
              >
                Stop
              </button>
            )}

            <button
              type="submit"
              disabled={!input.trim()}
              className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center space-x-1 text-xs"
            >
              <Send className="h-3 w-3" />
              <span>Send</span>
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Chatbot;
