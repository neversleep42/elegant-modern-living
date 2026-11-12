import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePV, copyText, extractVariables } from "@/lib/store";

export const Route = createFileRoute("/editor/$id")({
  head: () => ({ meta: [{ title: "Prompt Editor — PromptVault" }, { name: "description", content: "Write and refine your prompt." }, { property: "og:title", content: "Prompt Editor — PromptVault" }, { property: "og:description", content: "Write and refine your prompt." }] }),
  component: Editor,
});

function Editor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { prompts, collections, savePrompt } = usePV();
  const existing = prompts.find((p) => p.id === id);
  const [f, setF] = useState(() => ({
    title: existing?.title ?? "", description: existing?.description ?? "", content: existing?.content ?? "",
    collectionId: existing?.collectionId ?? collections[0]?.id ?? "", tags: existing?.tags.join(", ") ?? "", favorite: existing?.favorite ?? false,
  }));
  const [mono, setMono] = useState(true);
  const save = () => {
    const nid = savePrompt({ id: existing?.id, ...f, title: f.title || "Untitled prompt", tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean), isTemplate: extractVariables(f.content).length > 0 });
    toast.success("Changes saved");
    if (!existing) navigate({ to: "/editor/$id", params: { id: nid }, replace: true });
  };
  const words = f.content.trim() ? f.content.trim().split(/\s+/).length : 0;
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-md">
        <Link to="/prompts" className="grid size-8 place-items-center rounded-md hover:bg-elevated"><ArrowLeft className="size-4" /></Link>
        <span className="flex-1 truncate text-[13px]">{f.title || "New prompt"}</span>
        <Button size="sm" onClick={save}><Save /> Save</Button>
      </header>
      <div className="mx-auto grid w-full max-w-6xl gap-6 p-5 md:p-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Prompt title" className="h-12 border-none bg-transparent px-0 text-2xl font-semibold shadow-none focus-visible:ring-0" />
          <Input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Short description" className="bg-card" />
          <Input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="Tags, comma separated" className="bg-card" />
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-[12px] text-muted-foreground">
              <button onClick={() => setF({ ...f, content: f.content + "{{variable}}" })} className="rounded px-2 py-1 hover:bg-elevated">{"{{ }}"} Variable</button>
              <button onClick={() => setMono(!mono)} className="rounded px-2 py-1 hover:bg-elevated">{mono ? "Monospace" : "Sans"}</button>
              <span className="ml-auto">{f.content.length} chars · {words} words</span>
            </div>
            <Textarea value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} placeholder="Write your prompt… use {{variables}} for templates" className={"min-h-[420px] resize-y rounded-none border-none bg-transparent p-4 shadow-none focus-visible:ring-0 " + (mono ? "font-mono text-[13px]" : "")} />
          </div>
        </div>
        <aside className="space-y-4 rounded-xl border border-border bg-card p-5 self-start">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Settings</div>
          <Select value={f.collectionId} onValueChange={(v) => setF({ ...f, collectionId: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <label className="flex items-center justify-between text-[13px]">Favorite <Switch checked={f.favorite} onCheckedChange={(v) => setF({ ...f, favorite: v })} /></label>
          <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Visibility</span>Private</div>
          {existing && <div className="space-y-1.5 border-t border-border pt-4 text-[12px] text-muted-foreground"><div>Created {new Date(existing.createdAt).toLocaleDateString()}</div><div>Modified {new Date(existing.updatedAt).toLocaleDateString()}</div><div>Used {existing.usageCount} times</div></div>}
          <Button variant="secondary" className="w-full" onClick={() => { copyText(f.content); toast.success("Prompt copied to clipboard."); }}><Copy /> Copy Prompt</Button>
          <Button className="w-full" onClick={save}>Save Changes</Button>
        </aside>
      </div>
    </div>
  );
}
