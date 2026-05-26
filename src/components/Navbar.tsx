import { UserProfile } from "../types";
import { Briefcase, FileText, Bot, Award, LayoutDashboard, User, LogOut, Sparkles } from "lucide-react";

interface NavbarProps {
  activePage: string;
  setActivePage: (p: string) => void;
  currentUser: UserProfile | null;
  onOpenModal: (name: "login" | "signup") => void;
  onLogout: () => void;
}

export default function Navbar({
  activePage,
  setActivePage,
  currentUser,
  onOpenModal,
  onLogout
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-neutral-950/92 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-8 h-16 flex items-center justify-between">
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setActivePage("home")}
      >
        <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-serif font-black text-lg text-black ring-2 ring-amber-500/20 group-hover:bg-amber-400 transition-all">
          Z
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-black text-amber-500 tracking-wider text-base leading-none">ZOE AFRICA</span>
          <span className="text-[9px] text-zinc-500 tracking-widest font-mono uppercase mt-0.5">Career Network</span>
        </div>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        <button 
          onClick={() => setActivePage("jobs")}
          className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer py-1 border-b-2 ${
            activePage === "jobs" 
              ? "text-amber-500 border-amber-500" 
              : "text-zinc-400 border-transparent hover:text-amber-500"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Find Jobs
        </button>
        <button 
          onClick={() => setActivePage("cv")}
          className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer py-1 border-b-2 ${
            activePage === "cv" 
              ? "text-amber-500 border-amber-500" 
              : "text-zinc-400 border-transparent hover:text-amber-500"
          }`}
        >
          <FileText className="w-4 h-4" />
          CV Builder
        </button>
        <button 
          onClick={() => setActivePage("ai")}
          className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer py-1 border-b-2 ${
            activePage === "ai" 
              ? "text-amber-500 border-amber-500" 
              : "text-zinc-400 border-transparent hover:text-amber-500"
          }`}
        >
          <Bot className="w-4 h-4" />
          AI Coach
        </button>
        <button 
          onClick={() => setActivePage("pricing")}
          className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer py-1 border-b-2 ${
            activePage === "pricing" 
              ? "text-amber-500 border-amber-500" 
              : "text-zinc-400 border-transparent hover:text-amber-500"
          }`}
        >
          <Award className="w-4 h-4" />
          Pricing
        </button>
        {currentUser && (
          <button 
            onClick={() => setActivePage("dashboard")}
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer py-1 border-b-2 ${
              activePage === "dashboard" 
                ? "text-amber-500 border-amber-500" 
                : "text-zinc-400 border-transparent hover:text-amber-500"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        )}
      </div>

      {/* Nav CTA */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3 pr-1">
            <div 
              onClick={() => setActivePage("dashboard")}
              className="flex items-center gap-2 cursor-pointer border border-zinc-800/80 bg-zinc-900 px-3 py-1.5 rounded-lg hover:border-amber-500/40 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-semibold text-xs flex items-center justify-center uppercase">
                {currentUser.firstName ? currentUser.firstName[0] : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden leading-none text-xs text-zinc-300 md:inline">
                {currentUser.firstName} <span className="text-[10px] text-amber-500 ml-1">✦ {currentUser.subscriptionPlan.toUpperCase()}</span>
              </span>
            </div>
            <button 
              onClick={onLogout}
              className="text-zinc-500 hover:text-rose-400 p-1.5 cursor-pointer h-9 w-9 border border-zinc-800/80 rounded-lg flex items-center justify-center bg-zinc-900 hover:bg-rose-500/5 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => onOpenModal("login")}
              className="px-4 py-2 border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-neutral-900 hover:text-zinc-100 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={() => onOpenModal("signup")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-sm font-bold shadow-md shadow-amber-500/10 flex items-center gap-1.5 hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
