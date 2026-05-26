import { useState, useEffect } from "react";
import { UserProfile, ResumeData, Job, DbJobApplication, PlanType, ChatMessage } from "./types";
import { INITIAL_JOBS } from "./data";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import JobsView from "./components/JobsView";
import CVBuilder from "./components/CVBuilder";
import AICoach from "./components/AICoach";
import PricingView from "./components/PricingView";
import DashboardView from "./components/DashboardView";
import Modals from "./components/Modals";

// Firebase dependencies
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc, collection, query, where, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function App() {
  // Navigation index
  const [activePage, setActivePage] = useState<string>("home");
  
  // Search parameters proxying landing searches to jobs portal
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Authenticated state (synchronized with Firebase Auth & Firestore)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Resume builder data states (synchronized with Firestore)
  const [resumeData, setResumeData] = useState<ResumeData>({
    userId: "guest",
    title: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    softSkills: "",
    languages: "",
    updatedAt: ""
  });

  // Application logs states (synchronized with Firestore)
  const [applications, setApplications] = useState<DbJobApplication[]>([]);

  // AI Career coach logs
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "👋 Jambo! I am ZOE AI, your virtual career coach from the ZOE AFRICA Network.\n\nI can help you:\n• 🔍 Probe for jobs in UK, USA, Canada, UAE, & across Africa with visa sponsors.\n• 📄 Edit and polish your ATS-beating resume summary.\n• 💡 Run real-world interactive pre-interview practice questions.\n• 📊 Contrast tech salary differences.\n\nWhat career milestone can we crush today?",
      timestamp: new Date()
    }
  ]);

  // Modal handlers
  const [activeModal, setActiveModal] = useState<"login" | "signup" | "apply" | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Core Firebase Authentication and State Sync Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 1. Listen to user profile document changes
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setCurrentUser({ id: snapshot.id, ...snapshot.data() } as any);
          } else {
            // Write transient fallback so the UI never crashes
            setCurrentUser({
              uid: user.uid,
              email: user.email || "",
              firstName: user.displayName?.split(" ")[0] || "Candidate",
              lastName: user.displayName?.split(" ")[1] || "Africa",
              country: "Kenya",
              professionalTitle: "Cloud Engineer candidate",
              subscriptionPlan: PlanType.FREE,
              cvScore: 72,
              isPaid: false,
              createdAt: new Date().toISOString()
            });
          }
          setAuthChecking(false);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
          setAuthChecking(false);
        });

        // 2. Listen to CV document changes
        const cvDocRef = doc(db, "cvs", user.uid);
        const unsubscribeCV = onSnapshot(cvDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setResumeData(snapshot.data() as ResumeData);
          } else {
            setResumeData({
              userId: user.uid,
              title: "",
              summary: "",
              experience: "",
              education: "",
              skills: "",
              softSkills: "",
              languages: "",
              updatedAt: ""
            });
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `cvs/${user.uid}`);
        });

        // 3. Listen to Job Applications changes (filtered securely by userId)
        const q = query(collection(db, "applications"), where("userId", "==", user.uid));
        const unsubscribeApps = onSnapshot(q, (snapshot) => {
          const appsList = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            let dateStr = "";
            if (data.dateApplied) {
              if (typeof data.dateApplied.toDate === "function") {
                dateStr = data.dateApplied.toDate().toISOString();
              } else if (data.dateApplied.seconds) {
                dateStr = new Date(data.dateApplied.seconds * 1000).toISOString();
              } else {
                dateStr = String(data.dateApplied);
              }
            }
            return {
              id: docSnap.id,
              ...data,
              dateApplied: dateStr
            } as DbJobApplication;
          });
          setApplications(appsList);
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, "applications");
        });

        return () => {
          unsubscribeUser();
          unsubscribeCV();
          unsubscribeApps();
        };
      } else {
        // If not authenticated, reset to guest states
        setCurrentUser(null);
        setResumeData({
          userId: "guest",
          title: "",
          summary: "",
          experience: "",
          education: "",
          skills: "",
          softSkills: "",
          languages: "",
          updatedAt: ""
        });
        setApplications([]);
        setAuthChecking(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setResumeData((prev) => ({ ...prev, userId: profile.uid }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setActivePage("home");
    } catch (err) {
      console.error(err);
    }
  };

  // Callback to submit dynamic cover application
  const handleSubmitApplication = (newApp: DbJobApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  // Callback: Plan Upgrade Updater
  const handleUpgradePlan = async (targetPlan: PlanType) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        subscriptionPlan: targetPlan,
        isPaid: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const handleSaveCVDetails = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const cvDocRef = doc(db, "cvs", currentUser.uid);
      await setDoc(cvDocRef, {
        userId: currentUser.uid,
        title: resumeData.title || "",
        summary: resumeData.summary || "",
        experience: resumeData.experience || "",
        education: resumeData.education || "",
        skills: resumeData.skills || "",
        softSkills: resumeData.softSkills || "",
        languages: resumeData.languages || "",
        updatedAt: serverTimestamp()
      });
      setActivePage("dashboard");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `cvs/${currentUser.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenApplyModal = (job: Job) => {
    setSelectedJob(job);
    setActiveModal("apply");
  };

  if (authChecking) {
    return (
      <div className="bg-neutral-950 min-h-screen text-slate-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-xs text-zinc-500 font-mono tracking-widest uppercase animate-pulse">Initializing ZOE Network...</span>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Dynamic Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onOpenModal={setActiveModal}
        onLogout={handleLogout}
      />

      {/* Structured core contents */}
      <main className="min-h-[calc(100vh-64px)] pb-12">
        {activePage === "home" && (
          <HomeView
            setActivePage={setActivePage}
            setSearchKeyword={setSearchKeyword}
            onOpenModal={setActiveModal}
          />
        )}

        {activePage === "jobs" && (
          <JobsView
            jobsList={INITIAL_JOBS}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            onOpenApplyModal={handleOpenApplyModal}
          />
        )}

        {activePage === "cv" && (
          <CVBuilder
            resumeData={resumeData}
            setResumeData={setResumeData}
            onSaveAndApply={handleSaveCVDetails}
            isSaving={isSaving}
          />
        )}

        {activePage === "ai" && (
          <AICoach
            chatLogs={chatLogs}
            setChatLogs={setChatLogs}
          />
        )}

        {activePage === "pricing" && (
          <PricingView
            currentUser={currentUser}
            onUpgradePlan={handleUpgradePlan}
            onOpenModal={setActiveModal}
          />
        )}

        {activePage === "dashboard" && currentUser && (
          <DashboardView
            currentUser={currentUser}
            applications={applications}
            setActivePage={setActivePage}
          />
        )}
      </main>

      {/* Global Modals Drawer Panels */}
      <Modals
        activeModal={activeModal}
        onCloseModal={() => { setActiveModal(null); setSelectedJob(null); }}
        selectedJob={selectedJob}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onSubmitApplication={handleSubmitApplication}
      />
    </div>
  );
}
