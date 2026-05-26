import { Job } from "./types";

export const INITIAL_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Google",
    location: "London, UK (Hybrid)",
    type: "Full-time",
    region: "UK",
    salary: "£95,000 – £125,000 /yr",
    tag: "Featured",
    posted: "2 days ago",
    match: 97
  },
  {
    id: 2,
    title: "Data Analyst & Analytics Engineer",
    company: "Andela",
    location: "Remote (Africa / Europe)",
    type: "Remote",
    region: "Remote",
    salary: "$3,200 – $4,800 /mo",
    tag: "Hot",
    posted: "1 day ago",
    match: 92
  },
  {
    id: 3,
    title: "Growth Marketing Manager",
    company: "Jumia Group",
    location: "Lagos, Nigeria",
    type: "Full-time",
    region: "Africa",
    salary: "₦650,000 – ₦850,000 /mo",
    tag: "Featured",
    posted: "3 days ago",
    match: 88
  },
  {
    id: 4,
    title: "Technical Product Manager",
    company: "Safaricom",
    location: "Nairobi, Kenya",
    type: "Full-time",
    region: "Africa",
    salary: "KES 350,000 – KES 480,000 /mo",
    tag: "Urgent",
    posted: "Today",
    match: 94
  },
  {
    id: 5,
    title: "API & Cloud Solutions Cloud Architect",
    company: "AWS (Amazon Web Services)",
    location: "Dubai, UAE (Visa Sponsor)",
    type: "Full-time",
    region: "UAE",
    salary: "AED 30,000 – AED 42,000 /mo",
    tag: "Featured",
    posted: "5 hours ago",
    match: 96
  },
  {
    id: 6,
    title: "UI/UX & Product Designer",
    company: "Flutterwave",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
    region: "Africa",
    salary: "$2,800 – $4,000 /mo",
    tag: "Hot",
    posted: "2 days ago",
    match: 89
  },
  {
    id: 7,
    title: "Investment & Financial Analyst",
    company: "Standard Bank",
    location: "Johannesburg, South Africa",
    type: "Full-time",
    region: "Africa",
    salary: "ZAR 60,000 – ZAR 85,000 /mo",
    tag: "Urgent",
    posted: "1 day ago",
    match: 85
  },
  {
    id: 8,
    title: "Senior DevOps & Infrastructure Specialist",
    company: "Shopify",
    location: "Toronto, Canada (Remote-Friendly)",
    type: "Full-time",
    region: "Canada",
    salary: "CAD 120,000 – CAD 150,000 /yr",
    tag: "Hot",
    posted: "3 days ago",
    match: 91
  },
  {
    id: 9,
    title: "AI research and Fine-Tuning Engineer",
    company: "OpenAI",
    location: "San Francisco, USA (Visa Help)",
    type: "Full-time",
    region: "USA",
    salary: "$180,000 – $240,000 /yr",
    tag: "Featured",
    posted: "Today",
    match: 98
  },
  {
    id: 10,
    title: "Senior Registered Nursing Officer",
    company: "NHS Trust Foundation",
    location: "Birmingham, UK (Visa Sponsorship)",
    type: "Full-time",
    region: "UK",
    salary: "£42,000 – £52,000 /yr",
    tag: "Sponsorship",
    posted: "4 days ago",
    match: 82
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    userId: "demo-user",
    jobId: 1,
    jobTitle: "Senior Software Engineer",
    company: "Google",
    location: "London, UK",
    status: "Interview",
    statusColor: "text-green-400 bg-green-500/10 border-green-500/30",
    dateApplied: "2026-05-20T10:00:00Z",
    coverLetter: "Dear Hiring Team,\n\nI am writing to express my keen interest in the Senior Software Engineer position at Google..."
  },
  {
    id: "app-2",
    userId: "demo-user",
    jobId: 4,
    jobTitle: "Technical Product Manager",
    company: "Safaricom",
    location: "Nairobi, Kenya",
    status: "Applied",
    statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    dateApplied: "2026-05-24T14:30:00Z",
    coverLetter: "Dear Safecom Team,\n\nApplying for the Technical PM role is a significant milestone for me..."
  },
  {
    id: "app-3",
    userId: "demo-user",
    jobId: 2,
    jobTitle: "Data Analyst & Analytics Engineer",
    company: "Andela",
    location: "Remote",
    status: "Offer 🎉",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    dateApplied: "2026-05-18T09:12:00Z",
    coverLetter: "Dear Andela Recruiters,\n\nI am thrilled to submit my bid to join your global network..."
  }
];
