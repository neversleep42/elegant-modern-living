import { Copy, Star, Braces } from "lucide-react";
import { toast } from "sonner";
import { usePV, timeAgo, copyText, type Prompt } from "@/lib/store";
import { PromptActions } from "./prompt-actions";
import { cn } from "@/lib/utils";

export function CollectionBadge({ id }: { id: string }) {
  const c = usePV((s) => s.collections.find((x) => x.id === id));
  if (!c) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-1.5 py-0.5 text-[11px] text-muted-foreground">
      <span className="size-1.5 rounded-full" style={{ background: c.color }} />{c.name}
    </span>
  );
}

export function usePromptCopy() {
  const markUsed = usePV((s) => s.markUsed);
  return (p: Prompt) => { copyText(p.content); markUsed(p.id); toast.success("Prompt copied to clipboard."); };
}

export function PromptCard({ prompt, view = "grid", showPreview = true }: { prompt: Prompt; view?: "grid" | "list"; showPreview?: boolean }) {
  const { select, selectedId, toggleFavorite } = usePV();
  const copy = usePromptCopy();
  const active = selectedId === prompt.id;
  const actions = (
    <div className={cn("flex items-center gap-0.5 transition-opacity", prompt.favorite ? "" : "opacity-0 group-hover:opacity-100", "max-md:opacity-100")}>
      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(prompt.id); }} aria-label="Favorite" className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-elevated hover:text-foreground">
        <Star className={cn("size-4", prompt.favorite && "fill-warning text-warning")} />
      </button>
      <span className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100">
        <button onClick={(e) => { e.stopPropagation(); copy(prompt); }} aria-label="Copy" className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-elevated hover:text-foreground"><Copy className="size-4" /></button>
        <PromptActions prompt={prompt} />
      </span>
    </div>
  );

  if (view === "list") {
    return (
      <div onClick={() => select(prompt.id)} className={cn("group flex cursor-pointer items-center gap-4 border-b border-border px-4 py-3 transition-colors hover:bg-card", active && "bg-card")}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><span className="truncate text-[14px] font-medium">{prompt.title}</span>{prompt.isTemplate && <Braces className="size-3.5 text-primary" />}</div>
          <p className="truncate text-[13px] text-muted-foreground">{prompt.description}</p>
        </div>
        <div className="hidden md:block"><CollectionBadge id={prompt.collectionId} /></div>
        <span className="hidden w-24 text-right text-[11px] text-muted-foreground lg:block">{timeAgo(prompt.updatedAt)}</span>
        {actions}
      </div>
    );
  }

  return (
    <div onClick={() => select(prompt.id)} className={cn("group fade-in flex cursor-pointer flex-col rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:border-primary/40 hover:-translate-y-px", active && "border-primary/60")}>
      <div className="flex items-start justify-between gap-2">
        <CollectionBadge id={prompt.collectionId} />
        {actions}
      </div>
      <h3 className="mt-3 flex items-center gap-1.5 text-[15px] font-medium leading-snug">{prompt.title}{prompt.isTemplate && <Braces className="size-3.5 shrink-0 text-primary" />}</h3>
      <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{prompt.description}</p>
      {showPreview && (
        <pre className="mt-3 line-clamp-3 whitespace-pre-wrap rounded-lg bg-elevated px-3 py-2 font-mono text-[11.5px] leading-relaxed text-muted-foreground">{prompt.content}</pre>
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <div className="flex flex-wrap gap-1">{prompt.tags.slice(0, 3).map((t) => <span key={t} className="text-[11px] text-muted-foreground">#{t}</span>)}</div>
        <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(prompt.updatedAt)}</span>
      </div>
    </div>
  );
}
