import { useState } from "react";
import { Search, MapPin, Sparkles, AlertCircle, Bot, FileCheck, Send, Globe, Phone, Zap } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

import heroNetworkMap from "../assets/images/hero_network_map_1779719053358.png";
import avatarFemalePm from "../assets/images/avatar_female_pm_1779719068015.png";
import avatarMaleEng from "../assets/images/avatar_male_eng_1779719083693.png";
import avatarMaleAnalyst from "../assets/images/avatar_male_analyst_1779719101007.png";

interface HomeViewProps {
  setActivePage: (p: string) => void;
  setSearchKeyword: (k: string) => void;
  onOpenModal: (name: "login" | "signup") => void;
}

export default function HomeView({
  setActivePage,
  setSearchKeyword,
  onOpenModal
}: HomeViewProps) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Save keyword search state and route to portal
    const combinedSearch = (keyword + " " + location).trim();
    setSearchKeyword(combinedSearch);
    setActivePage("jobs");
  };

  const quickSearch = (value: string) => {
    setSearchKeyword(value);
    setActivePage("jobs");
  };

  const handleWhatsAppRedirect = () => {
    const encodedText = encodeURIComponent("Hi ZOE AFRICA! I want to find jobs, optimize my CV, and unlock global visa sponsorships. Please help me get setup.");
    window.open(`https://wa.me/254700000000?text=${encodedText}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 bg-[radial-gradient(ellipse_at_20%_50%,rgba(197,160,76,0.06)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(197,160,76,0.04)_0%,transparent_50%)] border-b border-zinc-900 overflow-hidden">
        
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-500 mb-6 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Africa's #1 AI-Powered Career Ecosystem
              </div>

              <h1 className="font-serif font-extrabold text-4xl sm:text-6xl leading-[1.1] tracking-tight text-white mb-6">
                Your Dream Job is <br />
                <span className="text-amber-500 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">One Click Away</span>
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
                ZOE AFRICA connects talented professionals across Africa and the global diaspora with world-class opportunities. Build an ATS-beating CV, prepare dynamically with AI, and sign in to target sponsor roles easily.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full max-w-md">
                <button
                  onClick={() => setActivePage("jobs")}
                  className="w-full sm:w-auto px-7 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Search Global Vacancies
                </button>
                <button
                  onClick={() => setActivePage("cv")}
                  className="w-full sm:w-auto px-7 py-4 bg-transparent hover:bg-zinc-900 text-amber-500 border border-amber-500/40 hover:border-amber-500 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  Build Auto-CV
                </button>
              </div>
            </div>

            {/* Right Graphic/Image Column with Aspect-Ratio Containment and Loading States */}
            <div className="lg:col-span-5 w-full flex justify-center items-center">
              <div className="w-full max-w-md lg:max-w-none relative group">
                {/* Decorative Amber Blur Background Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700" />
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-3.5 shadow-2xl">
                  <div className="text-[10px] font-mono text-zinc-500 flex justify-between uppercase mb-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" /> Connection Active
                    </span>
                    <span>Global Nodes Core</span>
                  </div>
                  <ResponsiveImage
                    src={heroNetworkMap}
                    alt="ZOE AFRICA global career connectivity map"
                    aspectRatio="16:9"
                    isHero={true}
                    className="rounded-xl border border-zinc-800 shadow-md group-hover:scale-[1.01] transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics List */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14 border-t border-zinc-900/80 pt-10 mt-4 w-full">
            <div className="text-center md:text-left">
              <span className="block font-serif text-3xl md:text-4xl font-extrabold text-amber-500">2.4M+</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1 block uppercase">Active Vacancies</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-serif text-3xl md:text-4xl font-extrabold text-amber-500">180+</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1 block uppercase">Countries Linked</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-serif text-3xl md:text-4xl font-extrabold text-amber-500">850K+</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1 block uppercase">Candidates Hired</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-serif text-3xl md:text-4xl font-extrabold text-amber-500">98%</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1 block uppercase">ATS Success Rate</span>
            </div>
          </div>
        </div>

      </section>

      {/* Interactive Search Box Section */}
      <section className="px-6 py-10 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto bg-zinc-900/90 rounded-2xl border border-zinc-800/80 p-3 md:p-4 flex flex-col md:flex-row items-stretch gap-3 shadow-2xl">
          {/* Keyword Field */}
          <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-zinc-800">
            <Search className="w-5 h-5 text-zinc-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Job title, technical skill, or company..."
              className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder:text-zinc-600"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSearch(); }}
            />
          </div>

          {/* Location Field */}
          <div className="flex-1 flex items-center gap-3 px-3 py-2">
            <MapPin className="w-5 h-5 text-zinc-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="City, state, or Remote..."
              className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder:text-zinc-600"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSearch(); }}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-6 py-3.5 rounded-xl cursor-pointer transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            Find Vacancies
          </button>
        </div>

        {/* Quick searches */}
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center mt-6">
          <span className="text-xs text-zinc-500 font-medium py-1">Popular searches:</span>
          {["Software Engineer", "Marketing Lead", "Data Analyst", "Remote", "Sponsorship", "Medical"].map((tag) => (
            <button
              key={tag}
              onClick={() => quickSearch(tag)}
              className="text-xs bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-400 hover:text-amber-500 px-3 py-1.5 rounded-full cursor-pointer transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Next-gen Capability</span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-white mt-3">Why Land Your Job with ZOE?</h2>
          <p className="text-zinc-500 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Supercharge your application cycle. From auto-CV templates to instant voice updates over WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActivePage("ai")}
            className="bg-zinc-900/40 border border-zinc-800 hover:border-amber-500/40 p-8 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center text-lg mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors">AI Career Coach</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Analyze credentials, draft tailored cover letters, and run mock interview practices in a responsive chat. Available 24/7.
            </p>
          </div>

          <div 
            onClick={() => setActivePage("cv")}
            className="bg-zinc-900/40 border border-zinc-800 hover:border-amber-500/40 p-8 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center text-lg mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors">Smart ATS CV Builder</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Compile premium resume drafts with active AI writing guides. Highlight measurable metrics and skills instantly.
            </p>
          </div>

          <div 
            onClick={() => setActivePage("jobs")}
            className="bg-zinc-900/40 border border-zinc-800 hover:border-amber-500/40 p-8 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center text-lg mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors">One-Click Auto-Apply</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Apply to international vacancies in milliseconds. Your credentials and cover headers are customized dynamically per position.
            </p>
          </div>
        </div>
      </section>

      {/* Global Sponsors Section */}
      <section className="px-6 py-20 bg-zinc-900/40 border-y border-zinc-950/80 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Corporate Reach</span>
          <h2 className="font-serif font-bold text-2xl md:text-4xl text-white mt-3">Jobs Across Global Hubs</h2>
          <p className="text-zinc-500 text-sm md:text-base mt-2 max-w-lg mx-auto">
            Our talent pool can choose vacancies backed by visa-support programs.
          </p>

          <div className="flex flex-wrap gap-5 md:gap-8 justify-center mt-12">
            {[
              { flag: "🇳🇬", name: "Nigeria" },
              { flag: "🇰🇪", name: "Kenya" },
              { flag: "🇿🇦", name: "South Africa" },
              { flag: "🇬🇭", name: "Ghana" },
              { flag: "🇬🇧", name: "United Kingdom" },
              { flag: "🇦🇪", name: "United Arab Emirates" },
              { flag: "🇨🇦", name: "Canada" },
              { flag: "🇺🇸", name: "USA" },
              { flag: "🇩🇪", name: "Germany" },
              { flag: "🇪🇹", name: "Ethiopia" }
            ].map((cnt) => (
              <div key={cnt.name} className="flex flex-col items-center bg-zinc-900 border border-zinc-800/60 px-5 py-4.5 rounded-xl min-w-[100px]">
                <span className="text-3xl filter saturate-100 mb-1.5">{cnt.flag}</span>
                <span className="text-xs text-zinc-400 font-medium">{cnt.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-teal-950/20 to-amber-950/5 border border-teal-500/25 p-8 md:p-14 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full filter blur-xl pointer-events-none" />
          <div className="w-16 h-16 bg-teal-500/15 text-teal-400 rounded-full flex items-center justify-center text-3xl mx-auto">
            💬
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-4xl text-white">Interface via WhatsApp</h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            No laptop? No problem. Use WhatsApp to find active jobs, generate covers with our AI assistant, and send instant application files from your phone.
          </p>
          <button
            onClick={handleWhatsAppRedirect}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-teal-500/10 flex-wrap"
          >
            <Phone className="w-4 h-4" />
            Connect via WhatsApp
          </button>
          <p className="text-[11px] text-zinc-600 font-mono">+254 700 ZOE ZOE · Available 24 Hours</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-25 bg-zinc-950/70 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Candidate Reviews</span>
            <h2 className="font-serif font-bold text-3xl text-white mt-2">Success Stories from ZOE Network</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between">
              <p className="text-zinc-400 text-sm leading-relaxed italic mb-6">
                "Drafting CV highlights used to take me hours of frustration. Zoe's AI wrote ATS-aligned metrics for my prior engineering roles in 10 seconds. Now I work remotely for a firm in Toronto."
              </p>
              <div className="flex items-center gap-3">
                <ResponsiveImage
                  src={avatarFemalePm}
                  alt="Amara K."
                  aspectRatio="1:1"
                  className="w-10 h-10 rounded-full border border-amber-500/35 flex-shrink-0"
                />
                <div>
                  <span className="block text-sm font-semibold text-zinc-300">Amara K.</span>
                  <span className="block text-xs text-zinc-500">Lagos → Toronto (Remote)</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between">
              <p className="text-zinc-400 text-sm leading-relaxed italic mb-6">
                "The pricing is so honest, and saving and registering was frictionless. I applied to 5 sponsors in London, got 2 interviews within a fortnight, and accepted an offer last Friday!"
              </p>
              <div className="flex items-center gap-3">
                <ResponsiveImage
                  src={avatarMaleEng}
                  alt="Kwame O."
                  aspectRatio="1:1"
                  className="w-10 h-10 rounded-full border border-amber-500/35 flex-shrink-0"
                />
                <div>
                  <span className="block text-sm font-semibold text-zinc-300">Kwame O.</span>
                  <span className="block text-xs text-zinc-500">Accra → London</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between">
              <p className="text-zinc-400 text-sm leading-relaxed italic mb-6">
                "With no computer, ZOE's WhatsApp automation let me query open positions and auto-submit my saved resume right from my phone. Absolutely incredible innovation for tech in Africa!"
              </p>
              <div className="flex items-center gap-3">
                <ResponsiveImage
                  src={avatarMaleAnalyst}
                  alt="Fatima M."
                  aspectRatio="1:1"
                  className="w-10 h-10 rounded-full border border-amber-500/35 flex-shrink-0"
                />
                <div>
                  <span className="block text-sm font-semibold text-zinc-300">Fatima M.</span>
                  <span className="block text-xs text-zinc-500">Nairobi → Dubai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 px-6 py-16 text-center md:text-left mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-zinc-900 pb-12 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-serif font-black text-black text-sm">Z</div>
              <span className="font-serif font-bold text-amber-500 text-md tracking-wider">ZOE AFRICA</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
              Connecting premium African engineering, dynamic analytics, and administrative talent to high-paying international careers. Powered by Advanced Gemini Intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-mono tracking-wider uppercase mb-4">For Candidates</h4>
            <div className="space-y-2 flex flex-col items-center md:items-start text-xs text-zinc-500">
              <button onClick={() => setActivePage("jobs")} className="hover:text-amber-500 transition-colors">Find Vacancies</button>
              <button onClick={() => setActivePage("cv")} className="hover:text-amber-500 transition-colors">Smart CV Builder</button>
              <button onClick={() => setActivePage("ai")} className="hover:text-amber-500 transition-colors">AI Chat Coach</button>
              <button onClick={() => onOpenModal("signup")} className="hover:text-amber-500 transition-colors">Register Account</button>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-mono tracking-wider uppercase mb-4">Integrations</h4>
            <div className="space-y-2 flex flex-col items-center md:items-start text-xs text-zinc-500">
              <button onClick={handleWhatsAppRedirect} className="hover:text-teal-400 transition-colors">WhatsApp Apply</button>
              <button onClick={() => setActivePage("pricing")} className="hover:text-amber-500 transition-colors">Pricing Packages</button>
              <a href="#" className="hover:text-amber-500 transition-colors">Corporate API</a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-mono tracking-wider uppercase mb-4">Legal & Support</h4>
            <div className="space-y-2 flex flex-col items-center md:items-start text-xs text-zinc-500">
              <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <span>&copy; 2026 ZOE AFRICA. Fully encrypted full-stack application. All rights reserved.</span>
          <span>Designed with ❤️ for candidates in Africa and beyond.</span>
        </div>
      </footer>
    </div>
  );
}
