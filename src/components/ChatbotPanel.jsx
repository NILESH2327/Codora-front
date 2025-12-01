import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Mic, MicOff } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getBotResponse } from "../lib/actions/chatbot";
import AudioRecorder from "./AudioRecorder";


const ChatbotPanel = () => {
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
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    if (!hasAskedQuestion) {
      setHasAskedQuestion(true);
    }

    try {
      const botText = await getBotResponse(inputText);
      console.log("Raw bot response:", botText);
      let botResponseData;
      try {
        botResponseData = botText;
      } catch {
        botResponseData = { answer: botText, templateId: 1, steps: [] };
      }

      const botResponse = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        timestamp: new Date(),
        ...botResponseData,
      };

      console.log("Bot response data:", botResponseData);
      playBotAudio(botResponseData.audioBase64);

      setMessages((prev) => [...prev, botResponse]);

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

  // Add this function inside ChatbotPanel or import from a util file
  const playBotAudio = (base64audio) => {
    try {
      if (!base64audio) return;

      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Convert base64 → audio URL
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


  const quickQuestions = [
    "Best time to plant rice in Kerala?",
    "How to prevent coconut diseases?",
    "Current weather suitable for planting?",
    "Organic fertilizer recommendations",
  ];

  return (
    <div className="w-80 sm:w-96 h-[28rem] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-green-600 text-white">
        <h2 className="font-semibold text-sm">{t("chatTitle")}</h2>
        <p className="text-xs opacity-80">{t("chatSubtitle")}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
            >
              <div
                className={`p-2 rounded-full ${msg.sender === "user" ? "bg-green-600" : "bg-blue-600"
                  }`}
              >
                {msg.sender === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>

              <div
                className={`p-2 rounded-lg text-xs ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
              >
                {msg.sender === "bot" && msg.templateId === 2 ? (
                  <div>
                    <p>{msg.answer}</p>
                    <ol className="list-decimal list-inside mt-1 text-xs text-gray-700">
                      {msg.steps.map((step, idx) => (
                        <li key={idx} className="text-black">{step.replace("**", "")}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p>{msg.answer || msg.text}</p>
                )}
                <p
                  className={`mt-1 text-[10px] ${msg.sender === "user" ? "text-green-100" : "text-gray-500"
                    }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

      {/* Quick Questions - only show if user hasn't asked a question yet */}
      {!hasAskedQuestion && (
        <div className="px-3 py-2 border-t bg-gray-50">
          <p className="text-[11px] font-medium text-gray-700 mb-1">Quick Questions</p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInputText(q)}
                className="px-2 py-1 bg-white border border-gray-200 rounded-full text-[10px] text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-2 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={language === "en" ? "Ask your farming question..." : "നിങ്ങളുടെ കൃഷി ചോദ്യം ചോദിക്കുക..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-xs"
          />

          <AudioRecorder setMessage={setInputText} setProcessing={setIsTyping} />

          {isPlaying && (
            <button
              onClick={stopAudio}
              className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs"
            >
              Stop
            </button>
          )}

          {/* <AudioReco  setMessage={setMessage} seProcessing={setIsTyping}/> */}

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1 text-xs"
          >
            <Send className="h-3 w-3" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;
