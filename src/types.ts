export enum PlanType {
  FREE = "free",
  PRO = "pro",
  ELITE = "elite"
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  professionalTitle: string;
  subscriptionPlan: PlanType;
  cvScore: number;
  isPaid: boolean;
  createdAt: any; // Firestore Timestamp or ISO String
}

export interface ResumeData {
  userId: string;
  title: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  softSkills: string;
  languages: string;
  updatedAt: any;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  region: string;
  salary: string;
  tag: string;
  posted: string;
  match: number;
}

export interface DbJobApplication {
  id?: string;
  userId: string;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  coverLetter: string;
  status: "Applied" | "Interview" | "Offer" | "Offer 🎉" | "Rejected";
  statusColor: string;
  dateApplied: any;
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
}
