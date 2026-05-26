import { useState } from "react";
import { ResumeData } from "../types";
import { Sparkles, FileText, Download, Check, HelpCircle, Loader2 } from "lucide-react";

interface CVBuilderProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  onSaveAndApply: () => void;
  isSaving: boolean;
}

export default function CVBuilder({
  resumeData,
  setResumeData,
  onSaveAndApply,
  isSaving
}: CVBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Local state details for personal fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [webLinks, setWebLinks] = useState("");

  const [job1, setJob1] = useState("");
  const [comp1, setComp1] = useState("");
  const [start1, setStart1] = useState("");
  const [end1, setEnd1] = useState("");

  const [degree, setDegree] = useState("");
  const [uni, setUni] = useState("");
  const [grad, setGrad] = useState("");
  const [grade, setGrade] = useState("");
  const [certs, setCerts] = useState("");

  // AI loading indicators
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingExperience, setLoadingExperience] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [skillsSuggestions, setSkillsSuggestions] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  const stepsNav = [
    { label: "Personal", icon: "👤" },
    { label: "Experience", icon: "💼" },
    { label: "Education", icon: "🎓" },
    { label: "Skills", icon: "⚡" },
    { label: "Preview", icon: "👁" }
  ];

  const updatePreviewField = (key: keyof ResumeData, value: string) => {
    setResumeData({ ...resumeData, [key]: value });
  };

  // Helper to generate elegant toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Backend API Call: Enhance summary using server-side Gemini
  const handleEnhanceSummary = async () => {
    if (!resumeData.summary.trim()) {
      triggerToast("⚠️ Please enter a basic summary first before enhancing it.");
      return;
    }
    setLoadingSummary(true);
    try {
      const response = await fetch("/api/gemini/enhance-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: resumeData.summary, title: resumeData.title })
      });
      const data = await response.json();
      if (data.text) {
        updatePreviewField("summary", data.text);
        triggerToast("✨ AI successfully elevated and polished your professional overview!");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      triggerToast(`❌ Failed: ${err.message || "Unable to reach AI summary booster."}`);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Backend API Call: Analyze experience details and convert to crisp bullets
  const handleEnhanceExperience = async () => {
    if (!resumeData.experience.trim()) {
      triggerToast("⚠️ Please enter standard job responsibilities first.");
      return;
    }
    setLoadingExperience(true);
    try {
      const response = await fetch("/api/gemini/enhance-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: resumeData.experience, title: job1, company: comp1 })
      });
      const data = await response.json();
      if (data.text) {
        updatePreviewField("experience", data.text);
        triggerToast("📈 AI has rewritten your work history using quantitative metrics!");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      triggerToast(`❌ Failed: ${err.message || "Unable to connect AI coach."}`);
    } finally {
      setLoadingExperience(false);
    }
  };

  // Backend API Call: Suggest popular market skills for the title
  const handleSuggestSkills = async () => {
    if (!resumeData.title.trim()) {
      triggerToast("⚠️ Please specify your target job title in Step 1 first.");
      return;
    }
    setLoadingSkills(true);
    try {
      const response = await fetch("/api/gemini/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: resumeData.title })
      });
      const data = await response.json();
      if (data.text) {
        const parsed = data.text.split(",").map((s: string) => s.trim().replace(/^•\s*/, ""));
        setSkillsSuggestions(parsed);
        triggerToast("🔥 AI populated recommended skills for your specific vocation!");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      triggerToast("❌ Unable to fetch suggested skills.");
    } finally {
      setLoadingSkills(false);
    }
  };

  const addSuggestedSkill = (sk: string) => {
    const fresh = resumeData.skills ? `${resumeData.skills}, ${sk}` : sk;
    updatePreviewField("skills", fresh);
    setSkillsSuggestions(skillsSuggestions.filter((s) => s !== sk));
  };

  const handleDownloadCV = () => {
    triggerToast("📄 Your ATS-optimised CV PDF is compiling... (Upgrade to Pro/Elite to download physical copies)");
  };

  const calculatedName = `${fname || "Firstname"} ${lname || "Lastname"}`.trim();

  return (
    <div className="bg-neutral-950 min-h-screen px-4 py-8 md:px-8 max-w-5xl mx-auto w-full relative">
      
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-amber-500/40 text-sm font-semibold rounded-xl px-5 py-3.5 shadow-2xl flex items-center gap-2 text-zinc-200">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          {toastMessage}
        </div>
      )}

      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Premium Tool</span>
        <h1 className="font-serif font-black text-3xl md:text-4xl text-white mt-1">Smart Auto-CV Builder</h1>
        <p className="text-zinc-500 text-xs md:text-sm mt-1 max-w-xl mx-auto">
          Write an elegant, ATS-scannable CV in under ten minutes. Leverage server-side AI boosters to elevate and format your achievements.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-8">
        {/* Step buttons */}
        <div className="bg-zinc-950 rounded-xl p-1.5 flex flex-wrap gap-1">
          {stepsNav.map((st, idx) => (
            <button
              key={st.label}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 min-w-[100px] py-3 text-xs md:text-sm font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                currentStep === idx
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/5 font-extrabold"
                  : "bg-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span>{st.icon}</span>
              {st.label}
            </button>
          ))}
        </div>

        {/* STEP 0: Personal details */}
        {currentStep === 0 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">First Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amara"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Okafor"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-500">Target Vocation Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Backend / Cloud Systems Engineer"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                value={resumeData.title}
                onChange={(e) => updatePreviewField("title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Professional Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. amara.okafor@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Phone Code & Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +234 803 123 4567"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Current Residence (City / Country)</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos, Nigeria"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">LinkedIn Profile or Website URL</label>
                <input
                  type="text"
                  placeholder="e.g. linkedin.com/in/amara-okafor"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={webLinks}
                  onChange={(e) => setWebLinks(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono uppercase">
                <span className="text-zinc-500">Professional Summary</span>
                <button
                  type="button"
                  onClick={handleEnhanceSummary}
                  disabled={loadingSummary}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-bold transition-colors disabled:opacity-40 cursor-pointer border border-zinc-800 bg-zinc-950 px-2.5 py-1 rounded-md"
                >
                  {loadingSummary ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                      Polishing summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      AI: Optimize summary
                    </>
                  )}
                </button>
              </div>
              <textarea
                placeholder="A high-performance technical professional with a solid background of deploying..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none min-h-[120px] resize-y leading-relaxed placeholder:text-zinc-700"
                value={resumeData.summary}
                onChange={(e) => updatePreviewField("summary", e.target.value)}
              />
            </div>
            
            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Proceed to Experience
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Experience */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Recent Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Associate Software Engineer"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={job1}
                  onChange={(e) => setJob1(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Employer Name & Location</label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp, Kenya"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={comp1}
                  onChange={(e) => setComp1(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. Feb 2022"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={start1}
                  onChange={(e) => setStart1(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">End Date</label>
                <input
                  type="text"
                  placeholder="e.g. Present"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={end1}
                  onChange={(e) => setEnd1(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono uppercase">
                <span className="text-zinc-500">Work History & Accomplishments</span>
                <button
                  type="button"
                  onClick={handleEnhanceExperience}
                  disabled={loadingExperience}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-bold transition-colors disabled:opacity-40 cursor-pointer border border-zinc-800 bg-zinc-950 px-2.5 py-1 rounded-md"
                >
                  {loadingExperience ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                      Rewriting achievements...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      AI: ATS Bullet Booster
                    </>
                  )}
                </button>
              </div>
              <textarea
                placeholder="Managed code releases, fixed bugs, built APIs, and mentored 2 interns."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none min-h-[140px] resize-y leading-relaxed placeholder:text-zinc-700 font-mono text-zinc-300 text-xs"
                value={resumeData.experience}
                onChange={(e) => updatePreviewField("experience", e.target.value)}
              />
              <p className="text-[10px] text-zinc-600 leading-normal">
                Pro-tip: List your responsibilities and click <strong>ATS Bullet Booster</strong>! Our Gemini server model will rewrite them using high-impact standard formatting.
              </p>
            </div>

            <div className="pt-3 flex justify-between">
              <button
                onClick={() => setCurrentStep(0)}
                className="bg-transparent text-zinc-400 hover:text-white border border-zinc-800 text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Back to Details
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Next to Education
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Education */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-500">Degree / Major</label>
              <input
                type="text"
                placeholder="e.g. BSc Computer Science"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                value={degree}
                onChange={(e) => { setDegree(e.target.value); updatePreviewField("education", `${e.target.value}\n${uni} (${grad})`); }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">University / Institution</label>
                <input
                  type="text"
                  placeholder="e.g. University of Lagos"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={uni}
                  onChange={(e) => { setUni(e.target.value); updatePreviewField("education", `${degree}\n${e.target.value} (${grad})`); }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Year Completed</label>
                <input
                  type="text"
                  placeholder="e.g. 2021"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={grad}
                  onChange={(e) => { setGrad(e.target.value); updatePreviewField("education", `${degree}\n${uni} (${e.target.value})`); }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Grade / honors (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. First Class Honours"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Key Certifications</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Developer Associate, PMP"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  value={certs}
                  onChange={(e) => setCerts(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-3 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-transparent text-zinc-400 hover:text-white border border-zinc-800 text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Back to Experience
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Next to Skills
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Skills selection */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-3 bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">Let ZOE scan matching keywords</h3>
                  <p className="text-zinc-500 text-xs">Based on target career path: <strong className="text-amber-500">{resumeData.title || "Not specified yet"}</strong></p>
                </div>
                <button
                  type="button"
                  onClick={handleSuggestSkills}
                  disabled={loadingSkills}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-xs text-amber-500 hover:text-amber-400 font-bold px-3 py-1.5 rounded-xl cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {loadingSkills ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      Analyzing roles...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      AI: Scan Market Skills
                    </>
                  )}
                </button>
              </div>

              {/* Suggestions row */}
              {skillsSuggestions.length > 0 && (
                <div className="pt-3 border-t border-zinc-900">
                  <span className="block text-[10px] text-zinc-500 font-mono uppercase mb-2">Double click to annex to CV:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsSuggestions.map((sk) => (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => addSuggestedSkill(sk)}
                        className="text-[10px] bg-zinc-900 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-500 px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition-all flex items-center gap-1"
                      >
                        {sk} <span className="font-bold text-amber-500">+</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-500">Technical Skills (Comma separated)</label>
              <textarea
                placeholder="Python, AWS, Terraform, Docker, JavaScript, Git, CI/CD"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none min-h-[90px] resize-y placeholder:text-zinc-700"
                value={resumeData.skills}
                onChange={(e) => updatePreviewField("skills", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-500">Soft Skills / Frameworks (Comma separated)</label>
              <input
                type="text"
                placeholder="Scrum / Agile, Team Engagement, Problem-Solving, Cross-Functional Alignment"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                value={resumeData.softSkills}
                onChange={(e) => updatePreviewField("softSkills", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-500">Languages & Fluency</label>
              <input
                type="text"
                placeholder="English (Fluent / Professional), Swahili (Native), French (Conversational)"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                value={resumeData.languages}
                onChange={(e) => updatePreviewField("languages", e.target.value)}
              />
            </div>

            <div className="pt-3 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-transparent text-zinc-400 hover:text-white border border-zinc-800 text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Back to Education
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Preview Resume Card
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Resume compilation preview */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            {/* Elegant preview layout */}
            <div className="border border-zinc-800 rounded-2xl bg-zinc-950 p-6 md:p-10 shadow-inner font-sans max-w-2xl mx-auto border-t-4 border-t-amber-500 text-zinc-300">
              
              {/* Card Header */}
              <div className="border-b border-zinc-800/80 pb-6 mb-6">
                <h2 className="font-serif font-black text-2xl md:text-3xl text-white tracking-tight">
                  {calculatedName || "Your Full Name"}
                </h2>
                <div className="text-xs md:text-sm text-amber-500 font-semibold tracking-wide uppercase mt-1 leading-none">
                  {resumeData.title || "Target Vocation Vibe"}
                </div>
                <div className="text-[11px] font-mono text-zinc-500 flex flex-wrap gap-2.5 mt-3 leading-relaxed items-center">
                  <span>📧 {email || "email.vibe@zoe.com"}</span>
                  <span className="text-zinc-800">•</span>
                  <span>📱 {phone || "+254 700 123 456"}</span>
                  <span className="text-zinc-800">•</span>
                  <span>📍 {location || "Lagos / Nairobi / Remote"}</span>
                  {webLinks && (
                    <>
                      <span className="text-zinc-800">•</span>
                      <span className="underline">{webLinks}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase pb-1 border-b border-zinc-900">
                  Professional Profile
                </h4>
                <p className="text-[12px] md:text-sm text-zinc-400 leading-relaxed">
                  {resumeData.summary || "Complete the biography in step 1 to display your summary attributes here."}
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase pb-1 border-b border-zinc-900">
                  Work Experience
                </h4>
                {job1 ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline flex-wrap text-sm">
                      <strong className="text-white text-xs md:text-sm">{job1}</strong>
                      <span className="text-[11px] text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/50">
                        {start1 || "Start"} – {end1 || "Present"}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-amber-600 uppercase tracking-wide leading-none">{comp1}</div>
                    <p className="text-[11px] md:text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap mt-2 font-light">
                      {resumeData.experience}
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-600 text-[11px] italic">No prior experience listed yet.</p>
                )}
              </div>

              {/* Education */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase pb-1 border-b border-zinc-900">
                  Academic Milestones
                </h4>
                {degree ? (
                  <div className="text-xs md:text-sm leading-relaxed text-zinc-400 font-light">
                    <div className="flex justify-between text-xs font-bold text-white uppercase">
                      <span>{degree}</span>
                      <span className="text-zinc-500 font-mono text-[10px]">{grad}</span>
                    </div>
                    <div className="text-zinc-500 text-[11px]">{uni}</div>
                    {grade && <span className="block text-[10px] text-emerald-500/80 mt-1 font-mono">GPA Score: {grade}</span>}
                    {certs && <span className="block text-[10px] text-amber-500/70 mt-0.5">Licenses: {certs}</span>}
                  </div>
                ) : (
                  <p className="text-zinc-600 text-[11px] italic">No institutions details logged.</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase pb-1 border-b border-zinc-900">
                  Skills & Languages
                </h4>
                <div className="text-xs space-y-2 leading-relaxed text-zinc-400 font-light text-[11px]">
                  {resumeData.skills && (
                    <div>
                      <strong className="text-white text-[10px] uppercase font-mono tracking-wider">Technical:</strong> {resumeData.skills}
                    </div>
                  )}
                  {resumeData.softSkills && (
                    <div>
                      <strong className="text-white text-[10px] uppercase font-mono tracking-wider">Functional:</strong> {resumeData.softSkills}
                    </div>
                  )}
                  {resumeData.languages && (
                    <div>
                      <strong className="text-white text-[10px] uppercase font-mono tracking-wider">Languages:</strong> {resumeData.languages}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Preview Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full max-w-2xl mx-auto">
              <button
                onClick={handleDownloadCV}
                className="flex-1 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-500 hover:text-amber-400 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Copy
              </button>
              <button
                onClick={onSaveAndApply}
                disabled={isSaving}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/5 hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    Save CV & Sync Jobs
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
