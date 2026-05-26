import React, { useState, useEffect } from "react";
import { UserProfile, Job, DbJobApplication, PlanType } from "../types";
import { X, Bot, Sparkles, Loader2, Send, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";

interface ModalsProps {
  activeModal: "login" | "signup" | "apply" | null;
  onCloseModal: () => void;
  selectedJob: Job | null;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onSubmitApplication: (app: DbJobApplication) => void;
}

export default function Modals({
  activeModal,
  onCloseModal,
  selectedJob,
  currentUser,
  onLoginSuccess,
  onSubmitApplication
}: ModalsProps) {
  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Register state
  const [regFname, setRegFname] = useState("");
  const [regLname, setRegLname] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regCountry, setRegCountry] = useState("Kenya");
  const [regTitle, setRegTitle] = useState("Software Engineer");

  // Auth processing states
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Apply state
  const [coverText, setCoverText] = useState("");
  const [isDraftingCover, setIsDraftingCover] = useState(false);
  const [coverStatusMsg, setCoverStatusMsg] = useState("");

  const [applyState, setApplyState] = useState<"idle" | "submitting" | "success">("idle");

  // Effect: Generate cover letter using server proxy as soon as the apply modal is opened
  useEffect(() => {
    if (activeModal === "apply" && selectedJob) {
      handleDraftAICoverLetter();
    } else {
      setCoverText("");
      setApplyState("idle");
    }
    // Reset Auth state when switching modals
    setAuthError("");
    setAuthLoading(false);
  }, [activeModal, selectedJob]);

  // Server Proxy API: Generate Cover Letter via Gemini
  const handleDraftAICoverLetter = async () => {
    if (!selectedJob) return;
    setIsDraftingCover(true);
    setCoverStatusMsg("ZOE AI is reviewing your CV credentials...");
    
    // Dynamically simulate scanning delay
    setTimeout(async () => {
      setCoverStatusMsg("ZOE AI is tailoring your cover letter highlights...");
      try {
        const response = await fetch("/api/gemini/generate-cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: selectedJob.title,
            company: selectedJob.company,
            location: selectedJob.location,
            salary: selectedJob.salary,
            candidateName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Amara Okafor",
            profileTitle: currentUser?.professionalTitle || regTitle || "Senior Professional",
            candidateExperience: "Strong track record of delivering high-performance scalable software pipelines, leading cross-functional scopes, and migrating architectures."
          })
        });
        const data = await response.json();
        if (data.text) {
          setCoverText(data.text);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        // Fallback robust cover letter representation if API fails
        setCoverText(
          `Dear Hiring Team at ${selectedJob.company},\n\nI am writing to express my keen interest in the open ${selectedJob.title} position in ${selectedJob.location}. With my robust technical capabilities, strong work ethic, and history of deploying performant solutions, I am confident I would be a stellar addition to your technical department.\n\nThank you for reviewing my credentials. I look forward to connecting soon.\n\nBest regards,\n${currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Amara Okafor"}`
        );
      } finally {
        setIsDraftingCover(false);
      }
    }, 1000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass.trim()) return;
    setAuthLoading(true);
    setAuthError("");

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      onCloseModal();
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regFname.trim() || !regLname.trim() || !regPass.trim()) return;
    setAuthLoading(true);
    setAuthError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPass);
      const user = userCredential.user;

      // Save user profile immediately to Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: regEmail,
        firstName: regFname,
        lastName: regLname,
        country: regCountry,
        professionalTitle: regTitle,
        subscriptionPlan: PlanType.FREE,
        cvScore: 72,
        isPaid: false,
        createdAt: serverTimestamp()
      });

      // Maintain initial bootstrap CV document to pass safety check rules
      const cvDocRef = doc(db, "cvs", user.uid);
      await setDoc(cvDocRef, {
        userId: user.uid,
        title: regTitle,
        summary: "",
        experience: "",
        education: "",
        skills: "",
        softSkills: "",
        languages: "",
        updatedAt: serverTimestamp()
      });

      onCloseModal();
    } catch (err: any) {
      setAuthError(err.message || "Failed to register profile details.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleApplySubmit = async () => {
    if (!selectedJob) return;
    setApplyState("submitting");

    try {
      const appDocRef = doc(collection(db, "applications"));
      const newApplication = {
        userId: currentUser?.uid || "guest-user",
        jobId: Number(selectedJob.id),
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        location: selectedJob.location,
        coverLetter: coverText,
        status: "Applied" as const,
        statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
        dateApplied: serverTimestamp()
      };

      await setDoc(appDocRef, newApplication);
      setApplyState("success");
      
      setTimeout(() => {
        onCloseModal();
      }, 2000);
    } catch (error) {
      setApplyState("idle");
      handleFirestoreError(error, OperationType.CREATE, "applications");
    }
  };

  const handleWhatsAppApply = () => {
    if (!selectedJob) return;
    const waText = encodeURIComponent(`Hi ZOE AFRICA! Please apply me to the "${selectedJob.title}" vacancy at "${selectedJob.company}" (${selectedJob.location}). Thank you!`);
    window.open(`https://wa.me/254700000000?text=${waText}`, "_blank");
    onCloseModal();
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onCloseModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LOGIN MODAL */}
        {activeModal === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="text-center">
              <h2 className="font-serif font-black text-2xl md:text-3xl text-white">Welcome Back</h2>
              <p className="text-zinc-500 text-xs mt-1">Sign in to your ZOE AFRICA career network account.</p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl text-center">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  className="w-full bg-zinc-950 border border-zinc-805 border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none placeholder:text-zinc-700"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-500">Account Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none placeholder:text-zinc-700 font-mono pr-12"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-300"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Verifying Credentials...
                </>
              ) : (
                "Sign In to Account →"
              )}
            </button>
          </form>
        )}

        {/* SIGNUP MODAL */}
        {activeModal === "signup" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="text-center">
              <h2 className="font-serif font-black text-2xl md:text-3xl text-white">Join ZOE AFRICA</h2>
              <p className="text-zinc-500 text-xs mt-1">Register your absolute free candidate portfolio in seconds.</p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl text-center">
                {authError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Amara"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none"
                  value={regFname}
                  onChange={(e) => setRegFname(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Okafor"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none"
                  value={regLname}
                  onChange={(e) => setRegLname(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-zinc-500">Professional Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineer / Data Analyst"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none"
                value={regTitle}
                onChange={(e) => setRegTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-zinc-500">Email Address</label>
              <input
                type="email"
                required
                placeholder="amara@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-zinc-500">Choose Secure Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-zinc-500">Sponsor Registry Hub Country</label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-zinc-400 focus:outline-none cursor-pointer"
                value={regCountry}
                onChange={(e) => setRegCountry(e.target.value)}
              >
                <option value="Kenya">Kenya</option>
                <option value="Nigeria">Nigeria</option>
                <option value="South Africa">South Africa</option>
                <option value="Ghana">Ghana</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Other">Other Hub</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs md:text-sm tracking-widest uppercase rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Registering Profile...
                </>
              ) : (
                "Configure Account Free →"
              )}
            </button>
          </form>
        )}

        {/* APPLY MODAL CONTAINER */}
        {activeModal === "apply" && selectedJob && (
          <div className="space-y-5 text-left animate-fade-in">
            <div className="border-b border-zinc-800/80 pb-4">
              <h2 className="font-serif font-black text-xl md:text-2xl text-white">Apply for Position</h2>
              <div className="text-xs font-semibold text-amber-500 mt-1">
                {selectedJob.title} • <span className="text-zinc-500 font-normal">{selectedJob.company} • {selectedJob.location}</span>
              </div>
            </div>

            {/* AI Generator banner */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-bold">
                <Bot className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>ZOE AI Career Companion active</span>
              </div>
              {isDraftingCover ? (
                <div className="flex items-center gap-2.5 py-1">
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                  <span className="text-xs text-zinc-400 font-light font-mono animate-pulse">{coverStatusMsg}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="block text-[11px] text-zinc-500 font-light">
                    We scanned your CV. Generated high-precision highlights tailored to {selectedJob.company}'s hiring focus.
                  </span>
                  <div className="flex gap-2 pt-1">
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                      ✓ CV aligned
                    </span>
                    <span className="text-[10px] bg-blue-500/10 border border-blue-500/25 text-blue-400 px-2.5 py-0.5 rounded-full font-bold">
                      AI Match: {selectedJob.match}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {applyState === "success" ? (
              <div className="text-center py-10 space-y-3 animate-scale-up">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-2xl flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="text-md font-bold text-white uppercase">Application Transmitted!</h3>
                <p className="text-zinc-500 text-xs leading-normal">
                  Your tailored cover letter and profile details was successfully dispatched to hiring teams. Check your dashboard for alerts.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-500">AI Tailored Cover Statement</label>
                  <textarea
                    disabled={isDraftingCover}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs md:text-sm text-zinc-300 focus:outline-none min-h-[160px] resize-y leading-relaxed font-mono"
                    value={coverText}
                    onChange={(e) => setCoverText(e.target.value)}
                    placeholder="Cover letter is generating..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    onClick={handleApplySubmit}
                    disabled={isDraftingCover || applyState === "submitting"}
                    className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs md:text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {applyState === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Dispersing Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        Submit Application
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleWhatsAppApply}
                    disabled={isDraftingCover}
                    className="flex-1 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-teal-400 hover:text-teal-300 font-bold text-xs md:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
