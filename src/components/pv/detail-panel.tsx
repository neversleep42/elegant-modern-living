import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Copy, CopyPlus, Pencil, Star, Trash2, X, Braces } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePV } from "@/lib/store";
import { CollectionBadge, usePromptCopy } from "./prompt-card";
import { Highlighted } from "./highlight";
import { TemplateDialog } from "./template-dialog";
import { cn } from "@/lib/utils";

export function DetailPanel() {
  const navigate = useNavigate();
  const { selectedId, select, prompts, toggleFavorite, duplicatePrompt, deletePrompt } = usePV();
  const prompt = prompts.find((p) => p.id === selectedId);
  const copy = usePromptCopy();
  const [tpl, setTpl] = useState(false);
  if (!prompt) return null;
  const meta = [
    ["Created", new Date(prompt.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })],
    ["Last updated", new Date(prompt.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })],
    ["Usage", `${prompt.usageCount} times`],
  ];
  return (
    <>
      <div className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm xl:hidden" onClick={() => select(null)} />
      <aside className="fade-in fixed inset-y-0 right-0 z-40 flex w-full max-w-[380px] flex-col border-l border-border bg-sidebar xl:static xl:z-auto xl:w-[360px] xl:shrink-0">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <CollectionBadge id={prompt.collectionId} />
          <div className="flex items-center gap-0.5">
            <button onClick={() => toggleFavorite(prompt.id)} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-elevated" aria-label="Favorite"><Star className={cn("size-4", prompt.favorite && "fill-warning text-warning")} /></button>
            <button onClick={() => select(null)} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-elevated" aria-label="Close"><X className="size-4" /></button>
          </div>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto p-5">
          <h2 className="text-lg font-semibold tracking-tight">{prompt.title}</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{prompt.description}</p>
          <div className="mt-5 rounded-xl border border-border bg-card p-4">
            <pre className="whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed"><Highlighted text={prompt.content} /></pre>
          </div>
          {prompt.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">{prompt.tags.map((t) => <span key={t} className="rounded-md bg-elevated px-2 py-0.5 text-[11px] text-muted-foreground">#{t}</span>)}</div>
          )}
          <dl className="mt-6 space-y-2.5 border-t border-border pt-5">
            {meta.map(([k, v]) => <div key={k} className="flex justify-between text-[12px]"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <div className="space-y-2 border-t border-border p-4">
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => copy(prompt)}><Copy /> Copy</Button>
            {prompt.isTemplate && <Button variant="secondary" className="flex-1" onClick={() => setTpl(true)}><Braces /> Use template</Button>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate({ to: "/editor/$id", params: { id: prompt.id } })}><Pencil /> Edit</Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => { const id = duplicatePrompt(prompt.id); if (id) select(id); toast.success("Prompt duplicated"); }}><CopyPlus /> Duplicate</Button>
            <Button variant="outline" size="sm" onClick={() => { deletePrompt(prompt.id); toast.success("Prompt deleted"); }} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
          </div>
        </div>
      </aside>
      <TemplateDialog prompt={prompt} open={tpl} onOpenChange={setTpl} />
    </>
  );
}
