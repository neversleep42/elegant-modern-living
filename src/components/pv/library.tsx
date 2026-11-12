import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, List, Plus, Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePV, type Prompt } from "@/lib/store";
import { PromptCard } from "./prompt-card";
import { TopBar } from "./app-shell";
import { cn } from "@/lib/utils";

type Sort = "updated" | "created" | "title" | "usage";
const quick = ["All", "Favorites", "Recently Added", "Recently Used"] as const;

export function Library({ crumbs, title, description, base, defaultSort = "updated", hideCollectionFilter, headerExtra, renderCard }: {
  crumbs: string[]; title: ReactNode; description: string; base: (p: Prompt) => boolean; defaultSort?: Sort; hideCollectionFilter?: boolean; headerExtra?: ReactNode;
  renderCard?: (p: Prompt, view: "grid" | "list") => ReactNode;
}) {
  const { prompts, collections, defaultView } = usePV();
  const [q, setQ] = useState("");
  const [col, setCol] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<Sort>(defaultSort);
  const [view, setView] = useState<"grid" | "list" | null>(null);
  const [qf, setQf] = useState<(typeof quick)[number]>("All");
  const v = view ?? defaultView;
  const scoped = prompts.filter(base);
  const tags = useMemo(() => Array.from(new Set(scoped.flatMap((p) => p.tags))).sort(), [scoped]);
  const list = useMemo(() => {
    const s = q.toLowerCase();
    let r = scoped.filter((p) =>
      (!s || [p.title, p.description, p.content, ...p.tags].some((x) => x.toLowerCase().includes(s))) &&
      (col === "all" || p.collectionId === col) && (tag === "all" || p.tags.includes(tag)));
    let srt = sort;
    if (qf === "Favorites") r = r.filter((p) => p.favorite);
    if (qf === "Recently Added") srt = "created";
    if (qf === "Recently Used") { r = r.filter((p) => p.usedAt); r.sort((a, b) => (b.usedAt ?? 0) - (a.usedAt ?? 0)); return r; }
    const fn: Record<Sort, (a: Prompt, b: Prompt) => number> = {
      updated: (a, b) => b.updatedAt - a.updatedAt, created: (a, b) => b.createdAt - a.createdAt,
      title: (a, b) => a.title.localeCompare(b.title), usage: (a, b) => b.usageCount - a.usageCount,
    };
    return [...r].sort(fn[srt]);
  }, [scoped, q, col, tag, sort, qf]);

  return (
    <>
      <TopBar crumbs={crumbs} />
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-[13.5px] text-muted-foreground">{description}</p>
          </div>
          <div className="flex gap-2">{headerExtra}<Button asChild><Link to="/editor/$id" params={{ id: "new" }}><Plus /> New Prompt</Link></Button></div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts…" className="h-9 bg-card pl-8" />
          </div>
          {!hideCollectionFilter && (
            <Select value={col} onValueChange={setCol}>
              <SelectTrigger className="h-9 w-[150px] bg-card"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All categories</SelectItem>{collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          )}
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="h-9 w-[130px] bg-card"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All tags</SelectItem>{tags.map((t) => <SelectItem key={t} value={t}>#{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={(x) => setSort(x as Sort)}>
            <SelectTrigger className="h-9 w-[150px] bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last modified</SelectItem><SelectItem value="created">Date created</SelectItem>
              <SelectItem value="title">Alphabetical</SelectItem><SelectItem value="usage">Most used</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            {(["grid", "list"] as const).map((m) => (
              <button key={m} onClick={() => setView(m)} aria-label={m} className={cn("grid size-7 place-items-center rounded-md text-muted-foreground", v === m && "bg-elevated text-foreground")}>
                {m === "grid" ? <LayoutGrid className="size-3.5" /> : <List className="size-3.5" />}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-1 overflow-x-auto">
          {quick.map((f) => (
            <button key={f} onClick={() => setQf(f)} className={cn("whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] transition-colors", qf === f ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")}>{f}</button>
          ))}
          <span className="ml-auto self-center text-[12px] text-muted-foreground">{list.length} prompts</span>
        </div>
        <div className="mt-5">
          {list.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-center">
              <Inbox className="size-6 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No prompts here yet</p>
              <p className="mt-1 text-[13px] text-muted-foreground">Try adjusting filters or create a new prompt.</p>
            </div>
          ) : v === "grid" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => renderCard ? renderCard(p, "grid") : <PromptCard key={p.id} prompt={p} />)}</div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">{list.map((p) => renderCard ? renderCard(p, "list") : <PromptCard key={p.id} prompt={p} view="list" />)}</div>
          )}
        </div>
      </div>
    </>
  );
}
