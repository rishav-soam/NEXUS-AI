export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  education: {
    institution: string;
    degree: string;
    major: string;
    graduationYear: string;
    gpa?: string;
  };
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    link?: string;
  }[];
  targetRoles: string[];
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'Onsite' | 'Hybrid';
  stipend: {
    hasStipend: boolean;
    amount?: string; // e.g. "$1,500/mo" or "Unpaid"
  };
  description: string;
  requirements: string[]; // required skills
  duration: string; // e.g., "3 Months" or "6 Months"
  postedAt: string; // ISO string
  source: 'Auto-scraper' | 'Direct Match' | 'Partner';
  applied?: boolean;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  appliedDate: string;
  status: 'Matched' | 'AI Tailored' | 'Applying' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  adaptedResume: {
    summary: string;
    bulletPoints: {
      original: string;
      customized: string;
      skillsAddressed: string[];
    }[];
    suggestedSkillsAdded: string[];
    atsScore: number;
    explanation: string;
  } | null;
  coverLetter: string | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}
