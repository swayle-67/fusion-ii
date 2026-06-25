export interface Service {
  index: string;
  title: string;
  description: string;
  capabilities: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  summary: string;
  description: string;
  tech: string[];
  role: string;
  projectUrl?: string;
}

export interface CanvasSettings {
  density: number;
  driftSpeed: number;
  breatheSpeed: number;
  grainSize: number;
  maxAlpha: number;
  colorTheme: "silver" | "gold" | "emerald" | "sunset";
}

export interface BlogPost {
  id: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  author?: "Sales Team" | "Founder" | "Fusion Team";
}

