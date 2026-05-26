import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Bot, Send, Sparkles } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";
import avatarZoeAi from "../assets/images/avatar_zoe_ai_1779719207060.png";

interface AICoachProps {
  chatLogs: ChatMessage[];
  setChatLogs: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AICoach({
  chatLogs,
  setChatLogs
}: AICoachProps) {
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomMarkerRef = useRef<HTMLDivElement>(null);

  // Suggested tags mapping
  const chatScenarios = [
    { text: "Suggest 3 Software Engineer roles in London with visa sponsorships", label: "💻 Jobs in London" },
    { text: "Help me practice an interview for a Senior Technical Product Manager position", label: "🎤 Product PM Prep" },
    { text: "Explain standard visa sponsorships of healthcare nursing grads in Leeds", label: "🏥 UK Care Visas" },
    { text: "Explain active salary ranges of cloud architects in Dubai compared to Nairobi", label: "💰 Dubai vs Africa Pay" }
  ];

  useEffect(() => {
    bottomMarkerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLogs, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const cleanStr = textToSend.trim();
    if (!cleanStr) return;

    // 1. Post candidate message
    const candidateMsg: ChatMessage = {
      id: `m-${Date.now()}-usr`,
      sender: "user",
      text: cleanStr,
      timestamp: new Date()
    };
    setChatLogs((prev) => [...prev, candidateMsg]);
    setIsTyping(true);
    setCurrentInput("");

    try {
      // 2. Poll server-side proxy
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanStr, history: chatLogs })
      });
      const data = await response.json();
      
      const aiReply: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        sender: "ai",
        text: data.text || "I was unable to establish a solid connection to my career databanks. Please try again in secondary channels.",
        timestamp: new Date()
      };
      setChatLogs((prev) => [...prev, aiReply]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `m-${Date.now()}-err`,
        sender: "ai",
        text: "⚠️ A connection latency issue occurred with our Gemini servers. Please verify your GEMINI_API_KEY environment variable is configured in the Settings secrets and retry.",
        timestamp: new Date()
      };
      setChatLogs((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen px-4 py-8 md:px-8 max-w-4xl mx-auto w-full flex flex-col justify-start">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Always Online</span>
        <h1 className="font-serif font-black text-3xl md:text-4xl text-white mt-1">AI Career Coach & Co-pilot</h1>
        <p className="text-zinc-500 text-xs md:text-sm mt-1 max-w-xl mx-auto">
          Inquire about visa sponsors, explore dynamic relative salaries, or prepare mock reviews before interviewing. Powered by Gemini 3.5.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/85 rounded-2xl flex flex-col h-[520px] shadow-2xl overflow-hidden">
        {/* Chat banner */}
        <div className="bg-zinc-950 px-5 py-4.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ResponsiveImage
              src={avatarZoeAi}
              alt="ZOE AI Coach Profile"
              aspectRatio="1:1"
              className="w-10 h-10 rounded-full border border-amber-500/35 flex-shrink-0"
            />
            <div>
              <span className="block text-sm font-bold text-white uppercase tracking-wider leading-none">ZOE AI COACH</span>
              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 mt-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span> Active Gemini Engine
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">24/7 INTERCONNECT</span>
        </div>

        {/* Message Container streams */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scrollbar-thin scrollbar-color-[#2c2f33] scroll-smooth">
          {chatLogs.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {msg.sender === "ai" && (
                <ResponsiveImage
                  src={avatarZoeAi}
                  alt="ZOE AI Partner"
                  aspectRatio="1:1"
                  className="w-8 h-8 rounded-full border border-amber-500/20 flex-shrink-0"
                />
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-black font-semibold rounded-tr-none"
                    : "bg-zinc-950 text-zinc-300 border border-zinc-904 border-zinc-800/80 rounded-tl-none font-light"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing state mock */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <ResponsiveImage
                src={avatarZoeAi}
                alt="ZOE AI thinking"
                aspectRatio="1:1"
                className="w-8 h-8 rounded-full border border-amber-500/20 flex-shrink-0 opacity-70"
              />
              <div className="bg-zinc-950 text-zinc-500 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 h-10 w-16">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          <div ref={bottomMarkerRef} />
        </div>

        {/* Dynamic starter prompts */}
        <div className="px-5 pb-3 pt-2 bg-zinc-900/60 border-t border-zinc-800">
          <div className="flex flex-wrap gap-1.5">
            {chatScenarios.map((sc) => (
              <button
                key={sc.label}
                onClick={() => handleSendMessage(sc.text)}
                className="text-[10px] bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/30 text-zinc-400 hover:text-amber-500 px-3 py-1.5 rounded-full cursor-pointer transition-all flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5" />
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input panel wrapper */}
        <div className="bg-zinc-950 border-t border-zinc-800 px-4 py-3 flex gap-2">
          <input
            type="text"
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none placeholder:text-zinc-600"
            placeholder="Type your question or query here, e.g. How do I prepare for Safaricom interview?"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(currentInput); }}
          />
          <button
            onClick={() => handleSendMessage(currentInput)}
            className="w-12 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
