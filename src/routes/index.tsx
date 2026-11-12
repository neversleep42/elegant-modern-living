import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Braces, Download, Folder, Layers, Plus, Star, Zap } from "lucide-react";
import { TopBar } from "@/components/pv/app-shell";
import { PromptCard } from "@/components/pv/prompt-card";
import { Button } from "@/components/ui/button";
import { usePV } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "PromptVault — Your prompts. Organized. Ready." }, { name: "description", content: "Save, organize and reuse your AI prompts in one elegant workspace." }, { property: "og:title", content: "PromptVault" }, { property: "og:description", content: "Your prompts. Organized. Ready." }] }),
  component: Overview,
});

function Overview() {
  const { prompts, collections } = usePV();
  const live = prompts.filter((p) => !p.archived);
  const week = live.filter((p) => p.usedAt && Date.now() - p.usedAt < 7 * 864e5).length;
  const stats = [
    { label: "Total Prompts", value: live.length, icon: Layers, note: "+4 this week" },
    { label: "Favorites", value: live.filter((p) => p.favorite).length, icon: Star, note: "Starred" },
    { label: "Collections", value: collections.length, icon: Folder, note: "Organized" },
    { label: "Used This Week", value: week, icon: Zap, note: "Active" },
  ];
  const h = new Date().getHours();
  return (
    <>
      <TopBar crumbs={["Workspace", "Overview"]} />
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight">{h < 12 ? "Good morning." : h < 18 ? "Good afternoon." : "Good evening."}</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">Your ideas, prompts and workflows in one place.</p>
          </div>
          <Button asChild><Link to="/editor/$id" params={{ id: "new" }}><Plus /> New Prompt</Link></Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between text-[12px] text-muted-foreground">{s.label}<s.icon className="size-4" /></div>
              <div className="mt-3 text-[28px] font-semibold tracking-tight">{s.value}</div>
              <div className="text-[11px] text-success">{s.note}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold">Recent Prompts</h2>
          <Link to="/prompts" className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground">View all prompts <ArrowRight className="size-3.5" /></Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[...live].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4).map((p) => <PromptCard key={p.id} prompt={p} />)}
        </div>
        <h2 className="mt-10 text-[16px] font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[{ to: "/editor/$id" as const, l: "Create a prompt", i: Plus }, { to: "/templates" as const, l: "Create a template", i: Braces }, { to: "/settings" as const, l: "Import prompts", i: Download }].map((a) => (
            <Link key={a.l} to={a.to} params={{ id: "new" }} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-[13.5px] transition-colors hover:border-primary/40">
              <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><a.i className="size-4" /></span>{a.l}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
