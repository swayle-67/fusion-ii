import { BlogPost, CaseStudy } from "../types";
import { BLOG_POSTS, CASE_STUDIES_DATA } from "../data";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface SurveyResponse {
  id: string;
  timestamp: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  q1_businessAbout: string;
  q2_achievements: string[];
  q2_achievementsOther: string;
  q3_webInterest: string;
  q4_webPackages: string[];
  q5_webPagesFeatures: string;
  q6_aiInterest: string;
  q7_aiSolutions: string[];
  q8_aiTasks: string;
  q9_lookAndFeel: string;
  q10_inspirations: string;
  timeline: string;
  budget: string;
}

export interface QuoteSubmission {
  id: string;
  timestamp: string;
  projectName: string;
  email: string;
  selectedGoals: string[];
  budget: string;
  estimateHours: number;
}

export interface AIInteraction {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  blueprintTitle?: string;
}

// Key names
const BLOG_KEY = "fusion_ii_dynamic_blog_posts";
const PORTFOLIO_KEY = "fusion_ii_dynamic_case_studies";
const SURVEYS_KEY = "fusion_ii_project_discovery_responses";
const QUOTES_KEY = "fusion_ii_quote_briefs";
const AIC_KEY = "fusion_ii_ai_conversations";

// Local storage helpers
function getFromStorage<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item) as T;
  } catch (e) {
    console.error("Failed to parse localStorage key:", key, e);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function hasAdminToken(): boolean {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem("fusion_admin_token") || sessionStorage.getItem("fusion_admin_session_auth") === "true";
}

export function getAuthHeaders(): { [key: string]: string } {
  const headers: { [key: string]: string } = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("fusion_admin_token") || "";
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// -------------------------------------------------------------
// Core API
// -------------------------------------------------------------

export function getBlogPosts(): BlogPost[] {
  return getFromStorage<BlogPost[]>(BLOG_KEY, BLOG_POSTS);
}

export function saveBlogPost(post: BlogPost): void {
  const posts = getBlogPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index !== -1) {
    posts[index] = post;
  } else {
    posts.unshift(post);
  }
  setToStorage(BLOG_KEY, posts);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server (Authenticated Admin Action)
  fetch("/api/blogs", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(post)
  }).catch(e => console.error("Cloud syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("blogs").upsert({
      id: post.id,
      category: post.category,
      title: post.title,
      date: post.date,
      readTime: post.readTime,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author || "Fusion Team"
    }).then(({ error }) => {
      if (error) console.error("Supabase blog sync failed:", error);
    });
  }
}

export function deleteBlogPost(id: string): void {
  const posts = getBlogPosts().filter((p) => p.id !== id);
  setToStorage(BLOG_KEY, posts);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server (Authenticated Admin Action)
  fetch(`/api/blogs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  }).catch(e => console.error("Cloud removal syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("blogs").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Supabase blog delete failed:", error);
    });
  }
}

export function getCaseStudies(): CaseStudy[] {
  return getFromStorage<CaseStudy[]>(PORTFOLIO_KEY, CASE_STUDIES_DATA);
}

export function saveCaseStudy(study: CaseStudy): void {
  const studies = getCaseStudies();
  const index = studies.findIndex((s) => s.id === study.id);
  if (index !== -1) {
    studies[index] = study;
  } else {
    studies.unshift(study);
  }
  setToStorage(PORTFOLIO_KEY, studies);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server (Authenticated Admin Action)
  fetch("/api/portfolio", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(study)
  }).catch(e => console.error("Cloud syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("portfolio").upsert({
      id: study.id,
      title: study.title,
      category: study.category,
      client: study.client,
      year: study.year,
      summary: study.summary,
      description: study.description,
      tech: study.tech,
      role: study.role,
      projectUrl: study.projectUrl || null
    }).then(({ error }) => {
      if (error) console.error("Supabase portfolio sync failed:", error);
    });
  }
}

export function deleteCaseStudy(id: string): void {
  const studies = getCaseStudies().filter((s) => s.id !== id);
  setToStorage(PORTFOLIO_KEY, studies);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server (Authenticated Admin Action)
  fetch(`/api/portfolio/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  }).catch(e => console.error("Cloud removal syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("portfolio").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Supabase portfolio delete failed:", error);
    });
  }
}

export function getSurveyResponses(): SurveyResponse[] {
  return getFromStorage<SurveyResponse[]>(SURVEYS_KEY, []);
}

export function saveSurveyResponse(response: SurveyResponse): void {
  const responses = getSurveyResponses();
  responses.unshift(response);
  setToStorage(SURVEYS_KEY, responses);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server
  fetch("/api/surveys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response)
  }).catch(e => console.error("Cloud syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("surveys").upsert(response).then(({ error }) => {
      if (error) console.error("Supabase survey sync failed:", error);
    });
  }
}

export function deleteSurveyResponse(id: string): void {
  const responses = getSurveyResponses().filter((r) => r.id !== id);
  setToStorage(SURVEYS_KEY, responses);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server (Authenticated Admin Action)
  fetch(`/api/surveys/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  }).catch(e => console.error("Cloud removal syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("surveys").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Supabase survey delete failed:", error);
    });
  }
}

export function getQuoteSubmissions(): QuoteSubmission[] {
  return getFromStorage<QuoteSubmission[]>(QUOTES_KEY, []);
}

export function saveQuoteSubmission(submission: QuoteSubmission): void {
  const submissions = getQuoteSubmissions();
  submissions.unshift(submission);
  setToStorage(QUOTES_KEY, submissions);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server
  fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission)
  }).catch(e => console.error("Cloud syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("quotes").upsert(submission).then(({ error }) => {
      if (error) console.error("Supabase quote sync failed:", error);
    });
  }
}

export function deleteQuoteSubmission(id: string): void {
  const submissions = getQuoteSubmissions().filter((s) => s.id !== id);
  setToStorage(QUOTES_KEY, submissions);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server (Authenticated Admin Action)
  fetch(`/api/quotes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  }).catch(e => console.error("Cloud removal syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("quotes").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Supabase quote delete failed:", error);
    });
  }
}

export function getAIInteractions(): AIInteraction[] {
  return getFromStorage<AIInteraction[]>(AIC_KEY, []);
}

export function saveAIInteraction(interaction: AIInteraction): void {
  const interactions = getAIInteractions();
  interactions.unshift(interaction);
  setToStorage(AIC_KEY, interactions);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server
  fetch("/api/chats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interaction)
  }).catch(e => console.error("Cloud syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("chats").upsert(interaction).then(({ error }) => {
      if (error) console.error("Supabase chat logs sync failed:", error);
    });
  }
}

export function deleteAIInteraction(id: string): void {
  const interactions = getAIInteractions().filter((i) => i.id !== id);
  setToStorage(AIC_KEY, interactions);
  window.dispatchEvent(new Event("fusion_data_update"));

  // Sync to database server (Authenticated Admin Action)
  fetch(`/api/chats/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  }).catch(e => console.error("Cloud removal syncing failed:", e));

  // Sync to supabase if configured
  if (isSupabaseConfigured() && supabase) {
    supabase.from("chats").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Supabase chat delete failed:", error);
    });
  }
}

// -------------------------------------------------------------
// Global Server-Sync Bootstrap Core
// -------------------------------------------------------------
async function bootstrapServerSync() {
  try {
    // If Supabase is fully configured manually, download/fetch everything directly from Supabase!
    if (isSupabaseConfigured() && supabase) {
      console.log("[Fusion II] Syncing state from active Supabase cloud schema...");
      const [sbBlogs, sbPortfolio, sbSurveys, sbQuotes, sbChats] = await Promise.all([
        supabase.from("blogs").select("*").order("date", { ascending: false }),
        supabase.from("portfolio").select("*"),
        supabase.from("surveys").select("*").order("timestamp", { ascending: false }),
        supabase.from("quotes").select("*").order("timestamp", { ascending: false }),
        supabase.from("chats").select("*").order("timestamp", { ascending: false }),
      ]);

      let receivedUpdate = false;
      if (sbBlogs.data && sbBlogs.data.length > 0) {
        setToStorage(BLOG_KEY, sbBlogs.data);
        receivedUpdate = true;
      }
      if (sbPortfolio.data && sbPortfolio.data.length > 0) {
        setToStorage(PORTFOLIO_KEY, sbPortfolio.data);
        receivedUpdate = true;
      }
      if (sbSurveys.data) {
        setToStorage(SURVEYS_KEY, sbSurveys.data);
        receivedUpdate = true;
      }
      if (sbQuotes.data) {
        setToStorage(QUOTES_KEY, sbQuotes.data);
        receivedUpdate = true;
      }
      if (sbChats.data) {
        setToStorage(AIC_KEY, sbChats.data);
        receivedUpdate = true;
      }

      if (receivedUpdate) {
        window.dispatchEvent(new Event("fusion_data_update"));
      }
      return;
    }

    // Default connection fallback to Node Express server API (Selectively fetching private logs only if Auth is present)
    const [blogs, portfolio, surveys, quotes, chats] = await Promise.all([
      fetch("/api/blogs").then(r => r.ok ? r.json() : null),
      fetch("/api/portfolio").then(r => r.ok ? r.json() : null),
      hasAdminToken()
        ? fetch("/api/surveys", { headers: getAuthHeaders() }).then(r => r.ok ? r.json() : null)
        : Promise.resolve(null),
      hasAdminToken()
        ? fetch("/api/quotes", { headers: getAuthHeaders() }).then(r => r.ok ? r.json() : null)
        : Promise.resolve(null),
      hasAdminToken()
        ? fetch("/api/chats", { headers: getAuthHeaders() }).then(r => r.ok ? r.json() : null)
        : Promise.resolve(null),
    ]);

    let receivedUpdate = false;

    if (blogs) {
      setToStorage(BLOG_KEY, blogs);
      receivedUpdate = true;
    }
    if (portfolio) {
      setToStorage(PORTFOLIO_KEY, portfolio);
      receivedUpdate = true;
    }
    if (surveys) {
      setToStorage(SURVEYS_KEY, surveys);
      receivedUpdate = true;
    }
    if (quotes) {
      setToStorage(QUOTES_KEY, quotes);
      receivedUpdate = true;
    }
    if (chats) {
      setToStorage(AIC_KEY, chats);
      receivedUpdate = true;
    }

    if (receivedUpdate) {
      window.dispatchEvent(new Event("fusion_data_update"));
    }
  } catch (err) {
    console.warn("Bootstrap server sync could not communicate with backend host:", err);
  }
}

if (typeof window !== "undefined") {
  // Graceful dispatch to prevent render bottlenecks
  setTimeout(() => {
    bootstrapServerSync();
  }, 100);

  // Monitor authorization state change to fetch private historical tables on demand
  window.addEventListener("fusion_auth_change", () => {
    bootstrapServerSync();
  });
}

