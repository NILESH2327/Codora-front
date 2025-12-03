// Chatbot.jsx
const Chatbot = () => {
  const chats = [
    "Onboard a new farmer profile",
    "Log today’s field activities",
    "Check pest alerts for my paddy",
    "View rainfall and weather outlook",
    "Get scheme eligibility guidance",
    "Review last season’s yield notes",
    "Set reminders for irrigation",
    "Track input usage and costs",
    "Ask a doubt in Malayalam",
  ];

  const suggestions = [
    "Help me profile a new farmer for Krishi Sakhi",
    "What should I do on my field this week based on weather?",
    "Log an activity: irrigated 1 acre of banana today evening",
    "Are there any pest outbreaks reported near my village?",
  ];

  const coreFeatures = [
    {
      title: "Understands each farm",
      desc: "Capture location, crops, soil, and irrigation once—Krishi Sakhi remembers it for every future conversation.",
    },
    {
      title: "Talk naturally in Malayalam",
      desc: "Speak or type in Malayalam or English. Krishi Sakhi adapts to how farmers actually talk.",
    },
    {
      title: "Simple activity logging",
      desc: "Record sowing, irrigation, input use, or pest issues in one line instead of long forms.",
    },
    {
      title: "Contextual AI advisory",
      desc: "Get guidance tuned to crop, weather, and nearby outbreaks—not generic district-level tips.",
    },
    {
      title: "Smart nudges and alerts",
      desc: "Timely reminders for operations, scheme dates, and price trends—delivered before it is too late.",
    },
    {
      title: "Local knowledge engine",
      desc: "Powered by crop calendars, pest data, and best practices tuned for Kerala’s conditions.",
    },
  ];

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

        <button className="mx-4 my-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-sm shadow-sm">
          <span className="text-lg leading-none">＋</span>
          <span>New conversation</span>
        </button>

        <div className="px-4 mt-3 text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
          Recent sessions
        </div>

        <nav className="mt-1 flex-1 overflow-y-auto text-sm space-y-1 px-2 pb-4">
          {chats.map((item) => (
            <button
              key={item}
              className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-100/80 text-emerald-900"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 mt-auto bg-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
              MG
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
          <button className="text-[11px] px-3 py-1.5 rounded-full border border-emerald-400 text-emerald-700 bg-white/70 hover:bg-emerald-50">
            View scheme status
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
        <section className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 py-10 space-y-10">
          {/* Hero */}
          <div className="text-center max-w-3xl space-y-3">
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

          {/* Input */}
          <div className="w-full max-w-2xl space-y-2">
            <div className="rounded-2xl bg-white/90 border border-emerald-100 flex items-center px-4 py-3 gap-3 shadow-sm">
              <span className="text-lg text-emerald-500">🌾</span>
              <input
                type="text"
                placeholder="Ask Krishi Sakhi: “What should I do in my paddy field this week?”"
                className="flex-1 bg-transparent outline-none text-sm md:text-[15px] text-emerald-900 placeholder:text-emerald-400"
              />
              <button className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-emerald-600 hover:bg-emerald-50 border border-emerald-200">
                <span className="w-3 h-3 rounded-full border-2 border-emerald-500" />
              </button>
            </div>
            <p className="text-[11px] text-emerald-700">
              Type or speak in Malayalam or English. Krishi Sakhi understands
              both.
            </p>
          </div>

          {/* Suggestions */}
          <div className="w-full max-w-3xl space-y-3">
            <p className="text-sm text-emerald-800">
              Use these prompts to get started:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((text) => (
                <button
                  key={text}
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

          {/* Features – airy cards */}
          <div className="w-full max-w-5xl space-y-3">
            <p className="text-sm font-semibold text-emerald-900">
              What Krishi Sakhi learns and does:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-white/70 border border-emerald-100 px-4 py-3 text-left"
                >
                  <h3 className="text-xs font-semibold text-emerald-900 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact strip */}
          <div className="w-full max-w-3xl">
            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-100 px-4 py-3 text-[11px] text-emerald-800">
              <p className="font-semibold mb-1 text-emerald-900">
                Expected impact
              </p>
              <div className="space-y-1">
                <p>• Always-available, contextual support for smallholder farmers.</p>
                <p>• Better timing of field operations and input use across seasons.</p>
                <p>
                  • Bridges knowledge gaps using AI plus local data; rollout and
                  funding depend on government sanction.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Chatbot;
