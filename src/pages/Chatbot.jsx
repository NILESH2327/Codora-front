import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Mic, MicOff, Volume2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getBotResponse } from "../lib/actions/chatbot";

const Chatbot = () => {
  const { t, language } = useLanguage();

  // ---------------------------
  // 🎤  Voice Input Setup
  // ---------------------------
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-IN"; // Malayalam
  recognition.continuous = false;
  recognition.interimResults = false;

  const startListening = () => {
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInputText(text); // put spoken text into input
    };

    recognition.onerror = () => {
      alert("Microphone error. Please try again.");
    };
  };

  // ---------------------------
  // 🔊 Voice Output Function
  // ---------------------------
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "en-IN"; // Malayalam voice output
    window.speechSynthesis.speak(speech);
  };

  const [messages, setMessages] = useState([
    {
      id: "1",
      text:
        language === "en"
          ? "Hello! I'm your AI farming assistant. Ask anything about crops, weather, or Kerala farming."
          : "ഹലോ! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായിയാണ്. കേരളത്തിലെ കൃഷി, കാലാവസ്ഥ, രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കൂ.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ---------------------------
  // 💬 Send Message
  // ---------------------------
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    const botText = await getBotResponse(inputText);

    const botResponse = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);

    speak(botText); // 🔊 Auto speak bot reply
  };

  // ---------------------------
  // 🎤 Toggle Mic
  // ---------------------------
  const toggleVoiceInput = () => {
    if (!isListening) startListening();
    setIsListening(!isListening);
  };

  const quickQuestions = [
    "Best time to plant rice in Kerala?",
    "How to prevent coconut diseases?",
    "Current weather suitable for planting?",
    "Organic fertilizer recommendations",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("chatTitle")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("chatSubtitle")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
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
                    className={`p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user" ? "text-green-100" : "text-gray-500"
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
                <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                  <div className="p-2 rounded-full bg-blue-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(q)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  language === "en"
                    ? "Ask your farming question..."
                    : "നിങ്ങളുടെ കൃഷി ചോദ്യം ചോദിക്കുക..."
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />

              {/* 🎤 Voice Input Button */}
              <button
                onClick={toggleVoiceInput}
                className={`p-3 rounded-lg ${
                  isListening ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;
