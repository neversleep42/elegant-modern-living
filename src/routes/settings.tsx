import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { TopBar } from "@/components/pv/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePV, type Theme } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — PromptVault" }, { name: "description", content: "Appearance, workspace and data settings." }, { property: "og:title", content: "Settings — PromptVault" }, { property: "og:description", content: "Appearance, workspace and data settings." }] }),
  component: Settings,
});

function Seg<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return <div className="flex rounded-lg border border-border bg-card p-0.5">{options.map((o) => <button key={o} onClick={() => onChange(o)} className={cn("rounded-md px-3 py-1 text-[12.5px] capitalize text-muted-foreground", value === o && "bg-elevated text-foreground")}>{o}</button>)}</div>;
}

function Settings() {
  const s = usePV();
  const download = (name: string, text: string) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text])); a.download = name; a.click(); };
  const row = "flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 text-[13.5px]";
  return (
    <>
      <TopBar crumbs={["Workspace", "Settings"]} />
      <div className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="text-[26px] font-semibold tracking-tight">Settings</h1>
        <h2 className="mt-8 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">General</h2>
        <div className={row}>Appearance<Seg<Theme> value={s.theme} options={["dark", "light", "system"]} onChange={s.setTheme} /></div>
        <div className={row}>Default view<Seg value={s.defaultView} options={["grid", "list"]} onChange={s.setDefaultView} /></div>
        <h2 className="mt-8 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Workspace</h2>
        <div className={row}>Workspace name<Input className="w-56 bg-card" value={s.workspaceName} onChange={(e) => s.setWorkspaceName(e.target.value)} /></div>
        <h2 className="mt-8 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Data</h2>
        <div className={row}>Export all prompts<Button variant="outline" size="sm" onClick={() => download("promptvault.json", JSON.stringify(s.prompts, null, 2))}>Export JSON</Button></div>
        <div className={row}>Export Markdown<Button variant="outline" size="sm" onClick={() => download("promptvault.md", s.prompts.map((p) => `## ${p.title}\n\n${p.content}`).join("\n\n"))}>Export .md</Button></div>
        <div className={row}>Import JSON<label className="cursor-pointer text-[13px] text-primary">Choose file<input type="file" accept=".json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { s.importPrompts(JSON.parse(await f.text())); toast.success("Prompts imported"); } catch { toast.error("Invalid file"); } }} /></label></div>
        <div className={row}>Reset local data<Button variant="destructive" size="sm" onClick={() => { s.reset(); toast.success("Data reset"); }}>Reset</Button></div>
        <p className="mt-8 text-[12px] text-muted-foreground">PromptVault v1.0.0</p>
      </div>
    </>
  );
}
