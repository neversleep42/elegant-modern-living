import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Prompt = {
  id: string;
  title: string;
  description: string;
  content: string;
  collectionId: string;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  isTemplate: boolean;
  createdAt: number;
  updatedAt: number;
  usedAt?: number;
  usageCount: number;
};

export type Collection = { id: string; name: string; color: string; description: string };
export type Theme = "dark" | "light" | "system";

export const COLLECTION_COLORS = ["#A78BFA", "#62C99A", "#E6B566", "#6CB6FF", "#F78C8C", "#5ED3D3", "#F0A3D9", "#B3B5BD"];

const uid = () => Math.random().toString(36).slice(2, 10);
const H = 3600_000;
const D = 24 * H;
const now = Date.now();

const seedCollections: Collection[] = [
  { id: "marketing", name: "Marketing", color: "#F78C8C", description: "Campaigns, ads and copywriting." },
  { id: "dev", name: "Development", color: "#6CB6FF", description: "Code generation and engineering workflows." },
  { id: "design", name: "UI / UX Design", color: "#A78BFA", description: "Interfaces, systems and critique." },
  { id: "image", name: "Image Generation", color: "#F0A3D9", description: "Midjourney, DALL·E and Flux prompts." },
  { id: "business", name: "Business", color: "#E6B566", description: "Strategy, analysis and planning." },
  { id: "productivity", name: "Productivity", color: "#62C99A", description: "Daily workflows and personal systems." },
  { id: "seo", name: "SEO", color: "#5ED3D3", description: "Search-optimized content architecture." },
];

const p = (o: Partial<Prompt> & Pick<Prompt, "title" | "content" | "collectionId">, age: number): Prompt => ({
  id: uid(), description: "", tags: [], favorite: false, archived: false, isTemplate: false,
  createdAt: now - age - 10 * D, updatedAt: now - age, usageCount: Math.floor(Math.random() * 40), ...o,
});

const seedPrompts: Prompt[] = [
  p({ title: "Premium Landing Page Generator", description: "Generate a conversion-focused landing page with modern React components.", collectionId: "dev", tags: ["React", "Landing Page"], favorite: true, isTemplate: true, usedAt: now - H,
    content: "Create a premium landing page for {{brand_name}}.\n\nIndustry: {{industry}}\nDesign style: {{style}}\nPrimary color: {{color}}\nTarget audience: {{audience}}\n\nUse React, TypeScript and Tailwind. Include a hero, social proof, features, pricing and a final CTA." }, 2 * H),
  p({ title: "Luxury Product Photography", description: "Editorial studio shots with soft, directional lighting.", collectionId: "image", tags: ["Midjourney", "Product"], favorite: true, usedAt: now - 5 * H,
    content: "Luxury product photography of {{product}}, placed on a travertine pedestal, soft directional light from the left, deep shadows, muted beige palette, shot on Hasselblad, 85mm, f/2.8, editorial, ultra-detailed --ar 4:5 --style raw" , isTemplate: true}, D),
  p({ title: "High-Converting Ad Copy", description: "Three ad variations built on proven copywriting frameworks.", collectionId: "marketing", tags: ["Advertising", "Copywriting"], usedAt: now - D,
    content: "You are a senior direct-response copywriter. Write 3 ad variations for {{product}} targeting {{audience}}.\n\nUse the AIDA, PAS and Before/After/Bridge frameworks. Each ad: a hook under 8 words, body under 60 words, a clear CTA.", isTemplate: true }, D + 3 * H),
  p({ title: "SEO Article Architect", description: "Plan a full article outline built around search intent.", collectionId: "seo", tags: ["SEO", "Content"], favorite: true,
    content: "Act as an SEO strategist. For the keyword \"{{keyword}}\", produce:\n1. Search intent analysis\n2. H1 + meta description\n3. A detailed H2/H3 outline\n4. 10 semantically related keywords\n5. Internal linking suggestions" , isTemplate: true}, 2 * D),
  p({ title: "Code Review Partner", description: "Thorough, kind and actionable code reviews.", collectionId: "dev", tags: ["Code", "Review"], usedAt: now - 2 * H,
    content: "Review the following code as a staff engineer. Focus on correctness, readability, performance and security. Group feedback by severity and suggest concrete fixes.\n\n```\n{{code}}\n```" }, 3 * D),
  p({ title: "Design System Critique", description: "Audit an interface against modern design principles.", collectionId: "design", tags: ["UI", "Audit"],
    content: "Critique this interface like a principal product designer from Linear. Evaluate hierarchy, spacing rhythm, typography, color contrast and interaction affordances. Give 5 prioritized improvements." }, 4 * D),
  p({ title: "Weekly Review Ritual", description: "Reflect on the week and plan the next one.", collectionId: "productivity", tags: ["Planning", "Journal"], favorite: true,
    content: "Guide me through a weekly review. Ask one question at a time about: wins, lessons, unfinished tasks, energy levels, and top 3 priorities for next week. Summarize at the end." }, 5 * D),
  p({ title: "Competitive Analysis Matrix", description: "Compare competitors across key strategic dimensions.", collectionId: "business", tags: ["Strategy", "Research"],
    content: "Build a competitive analysis for {{company}} against {{competitors}}. Compare positioning, pricing, target segment, key features, strengths and weaknesses in a markdown table, then summarize opportunities." , isTemplate: true}, 6 * D),
  p({ title: "Cold Email Sequence", description: "A friendly 4-step outbound sequence.", collectionId: "marketing", tags: ["Email", "Sales"],
    content: "Write a 4-email cold outreach sequence for {{offer}} to {{persona}}. Keep each under 90 words, conversational, with one clear ask. Space them over 12 days." }, 8 * D),
  p({ title: "Mobile Onboarding Flow", description: "Design a 4-screen onboarding experience.", collectionId: "design", tags: ["Mobile", "UX"],
    content: "Design a 4-screen mobile onboarding flow for a {{app_type}} app. For each screen describe the headline, supporting copy, illustration concept and primary action." }, 9 * D),
  p({ title: "Cinematic Portrait", description: "Moody, film-like portraits.", collectionId: "image", tags: ["Portrait", "Flux"],
    content: "Cinematic portrait of a woman in a rain-soaked Tokyo alley at night, neon reflections, shallow depth of field, Kodak Portra 800 grain, teal and amber palette, 35mm" }, 12 * D),
  p({ title: "Old Meeting Notes Formatter", description: "Archived formatter for meeting notes.", collectionId: "productivity", tags: ["Notes"], archived: true,
    content: "Turn these raw meeting notes into: summary, decisions, action items (owner, due date), open questions." }, 30 * D),
];

type State = {
  prompts: Prompt[];
  collections: Collection[];
  theme: Theme;
  defaultView: "grid" | "list";
  workspaceName: string;
  recentSearches: string[];
  selectedId: string | null;
  searchOpen: boolean;
  select: (id: string | null) => void;
  setSearchOpen: (v: boolean) => void;
  addRecentSearch: (q: string) => void;
  savePrompt: (p: Partial<Prompt> & { id?: string }) => string;
  deletePrompt: (id: string) => void;
  duplicatePrompt: (id: string) => string | undefined;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  markUsed: (id: string) => void;
  addCollection: (name: string, color?: string) => string;
  updateCollection: (id: string, patch: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  setTheme: (t: Theme) => void;
  setDefaultView: (v: "grid" | "list") => void;
  setWorkspaceName: (n: string) => void;
  importPrompts: (ps: Prompt[]) => void;
  reset: () => void;
};

export const usePV = create<State>()(
  persist(
    (set, get) => ({
      prompts: seedPrompts,
      collections: seedCollections,
      theme: "dark",
      defaultView: "grid",
      workspaceName: "Personal Workspace",
      recentSearches: ["landing page", "midjourney", "seo"],
      selectedId: null,
      searchOpen: false,
      select: (id) => set({ selectedId: id }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      addRecentSearch: (q) => set((s) => ({ recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 5) })),
      savePrompt: (data) => {
        const t = Date.now();
        if (data.id && get().prompts.some((x) => x.id === data.id)) {
          set((s) => ({ prompts: s.prompts.map((x) => (x.id === data.id ? { ...x, ...data, updatedAt: t } : x)) }));
          return data.id;
        }
        const id = uid();
        const np: Prompt = { title: "Untitled prompt", description: "", content: "", collectionId: get().collections[0]?.id ?? "", tags: [], favorite: false, archived: false, isTemplate: false, usageCount: 0, ...data, id, createdAt: t, updatedAt: t };
        set((s) => ({ prompts: [np, ...s.prompts] }));
        return id;
      },
      deletePrompt: (id) => set((s) => ({ prompts: s.prompts.filter((x) => x.id !== id), selectedId: s.selectedId === id ? null : s.selectedId })),
      duplicatePrompt: (id) => {
        const src = get().prompts.find((x) => x.id === id);
        if (!src) return;
        const t = Date.now();
        const np = { ...src, id: uid(), title: `${src.title} (copy)`, createdAt: t, updatedAt: t, usageCount: 0 };
        set((s) => ({ prompts: [np, ...s.prompts] }));
        return np.id;
      },
      toggleFavorite: (id) => set((s) => ({ prompts: s.prompts.map((x) => (x.id === id ? { ...x, favorite: !x.favorite } : x)) })),
      toggleArchive: (id) => set((s) => ({ prompts: s.prompts.map((x) => (x.id === id ? { ...x, archived: !x.archived } : x)) })),
      markUsed: (id) => set((s) => ({ prompts: s.prompts.map((x) => (x.id === id ? { ...x, usageCount: x.usageCount + 1, usedAt: Date.now() } : x)) })),
      addCollection: (name, color) => {
        const id = uid();
        set((s) => ({ collections: [...s.collections, { id, name, color: color ?? COLLECTION_COLORS[s.collections.length % COLLECTION_COLORS.length] ?? "#A78BFA", description: "" }] }));
        return id;
      },
      updateCollection: (id, patch) => set((s) => ({ collections: s.collections.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      deleteCollection: (id) => set((s) => {
        const rest = s.collections.filter((c) => c.id !== id);
        return { collections: rest, prompts: s.prompts.map((x) => (x.collectionId === id ? { ...x, collectionId: rest[0]?.id ?? "" } : x)) };
      }),
      setTheme: (theme) => set({ theme }),
      setDefaultView: (defaultView) => set({ defaultView }),
      setWorkspaceName: (workspaceName) => set({ workspaceName }),
      importPrompts: (ps) => set((s) => ({ prompts: [...ps.map((x) => ({ ...x, id: uid() })), ...s.prompts] })),
      reset: () => set({ prompts: seedPrompts, collections: seedCollections, selectedId: null }),
    }),
    {
      name: "promptvault",
      skipHydration: true,
      partialize: (s) => ({ prompts: s.prompts, collections: s.collections, theme: s.theme, defaultView: s.defaultView, workspaceName: s.workspaceName, recentSearches: s.recentSearches }),
    },
  ),
);

export const extractVariables = (content: string) => Array.from(new Set(Array.from(content.matchAll(/\{\{\s*(\w+)\s*\}\}/g), (m) => m[1] as string)));
export const fillTemplate = (content: string, values: Record<string, string>) =>
  content.replace(/\{\{\s*(\w+)\s*\}\}/g, (all, k) => (values[k]?.trim() ? values[k] : all));
export const humanize = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function timeAgo(t: number) {
  const diff = Date.now() - t;
  if (diff < 60_000) return "Just now";
  if (diff < H) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < D) return `${Math.floor(diff / H)} hours ago`;
  if (diff < 2 * D) return "Yesterday";
  if (diff < 30 * D) return `${Math.floor(diff / D)} days ago`;
  return new Date(t).toLocaleDateString();
}

export async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
}
