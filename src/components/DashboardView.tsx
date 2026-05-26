import { UserProfile, DbJobApplication } from "../types";
import { User, Award, CheckCircle2, Star, Clock, FileText, Settings, ShieldAlert, Sparkles } from "lucide-react";

interface DashboardViewProps {
  currentUser: UserProfile | null;
  applications: DbJobApplication[];
  setActivePage: (p: string) => void;
}

export default function DashboardView({
  currentUser,
  applications,
  setActivePage
}: DashboardViewProps) {
  if (!currentUser) return null;

  return (
    <div className="bg-neutral-950 min-h-screen px-4 py-8 md:px-8 max-w-5xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif font-black text-3xl md:text-4xl text-white">
            Welcome back, {currentUser.firstName}! 👋
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 max-w-sm">
            Review matching roles, prepare interviews, or update your ATS-compatible CV profile below.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold text-sm">
            ✦
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500 font-mono leading-none">CURRENT TIER:</span>
            <span className="block text-xs font-bold font-mono text-amber-500 uppercase mt-1 leading-none">
              {currentUser.subscriptionPlan.toUpperCase()} MEMBER
            </span>
          </div>
        </div>
      </div>

      {/* Profile summary rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 shadow-lg">
          <span className="block text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Applications Sent</span>
          <span className="block text-3xl font-serif font-extrabold text-white mt-2">{applications.length}</span>
          <span className="block text-[10px] text-emerald-500 font-bold mt-1.5 font-mono">↑ 6 this fortnight</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 shadow-lg">
          <span className="block text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Interviews Scheduled</span>
          <span className="block text-3xl font-serif font-extrabold text-white mt-2">
            {applications.filter((a) => a.status === "Interview").length || 1}
          </span>
          <span className="block text-[10px] text-amber-500 font-bold mt-1.5 font-mono">2 upcoming reviews</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 shadow-lg">
          <span className="block text-[11px] text-zinc-500 font-mono uppercase tracking-wider">ATS CV Score</span>
          <span className="block text-3xl font-serif font-extrabold text-white mt-2">87%</span>
          <span className="block text-[10px] text-emerald-500 font-bold mt-1.5 font-mono">↑ Raised from 71%</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 shadow-lg">
          <span className="block text-[11px] text-zinc-500 font-mono uppercase tracking-wider">Active Job Offers</span>
          <span className="block text-3xl font-serif font-extrabold text-white mt-2">
            {applications.filter((a) => a.status.includes("Offer")).length || 1}
          </span>
          <span className="block text-[10px] text-amber-500 font-bold mt-1.5 font-mono">Review contract docs</span>
        </div>
      </div>

      {/* Details Row blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left column: profile metadata */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-zinc-800 flex items-center justify-between">
            <span>👤 Account Profile</span>
            <Settings className="w-4 h-4 text-zinc-500" />
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">Registered Email:</span>
              <span className="block text-xs text-zinc-200 mt-0.5">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">First Name:</span>
              <span className="block text-xs text-zinc-200 mt-0.5">{currentUser.firstName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">Last Name:</span>
              <span className="block text-xs text-zinc-200 mt-0.5">{currentUser.lastName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">Vocational Title:</span>
              <span className="block text-xs text-amber-500 mt-0.5 font-bold">{currentUser.professionalTitle || "Candidate Portfolio"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">Origin Country:</span>
              <span className="block text-xs text-zinc-200 mt-0.5">🌍 {currentUser.country}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/50">
            <button
              onClick={() => setActivePage("cv")}
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-amber-500 hover:text-amber-400 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Upgrade CV credentials
            </button>
          </div>
        </div>

        {/* Right Columns: Application History logs */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
            💼 Submission & Tracker Records
          </h3>

          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-zinc-950 border border-zinc-850 border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-zinc-700 hover:shadow-lg shadow-zinc-950/20"
                >
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-white">{app.jobTitle}</h4>
                    <div className="text-[11px] text-zinc-500 font-medium">
                      🏢 <strong className="text-zinc-400">{app.company}</strong> • 📍 {app.location}
                    </div>
                    {app.coverLetter && (
                      <p className="text-[10px] text-zinc-600 line-clamp-1 italic max-w-sm mt-1">
                        "{app.coverLetter.substring(0, 100)}..."
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:w-auto flex sm:flex-col items-end gap-1 border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0 justify-between self-stretch sm:self-auto uppercase tracking-wider">
                    <span className={`text-[9px] px-2.5 py-1 rounded font-mono font-bold tracking-wide border ${app.statusColor}`}>
                      {app.status}
                    </span>
                    <span className="text-[9px] text-zinc-650 text-zinc-500 font-mono mt-0.5">
                      {new Date(app.dateApplied).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-14 bg-zinc-950 rounded-2xl border border-zinc-850 border-zinc-800/80 shadow-inner">
                <ShieldAlert className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <h4 className="text-xs font-bold text-white">No applications submitted yet</h4>
                <p className="text-zinc-500 text-xs max-w-xs mx-auto mb-4 leading-normal mt-1">
                  Once you apply for vacancies via the "Find Jobs" portal, submission and interview logs will populate here.
                </p>
                <button
                  onClick={() => setActivePage("jobs")}
                  className="text-xs bg-amber-500 hover:bg-amber-400 cursor-pointer text-black font-bold px-4 py-2 rounded-lg"
                >
                  Find Openings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
