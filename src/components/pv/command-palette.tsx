import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Folder, Clock, Plus, Settings, Braces } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { usePV } from "@/lib/store";

export function CommandPalette() {
  const navigate = useNavigate();
  const { searchOpen, setSearchOpen, prompts, collections, recentSearches, addRecentSearch, select } = usePV();
  const [q, setQ] = useState("");
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(!usePV.getState().searchOpen); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [setSearchOpen]);
  const close = () => { if (q.trim()) addRecentSearch(q.trim()); setSearchOpen(false); setQ(""); };
  const active = prompts.filter((p) => !p.archived);
  return (
    <CommandDialog open={searchOpen} onOpenChange={(v) => { setSearchOpen(v); if (!v) setQ(""); }}>
      <CommandInput placeholder="Search prompts, tags, collections…" value={q} onValueChange={setQ} />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No results found.</CommandEmpty>
        {!q && (
          <CommandGroup heading="Recent searches">
            {recentSearches.map((r) => <CommandItem key={r} value={`recent ${r}`} onSelect={() => setQ(r)}><Clock /> {r}</CommandItem>)}
          </CommandGroup>
        )}
        <CommandGroup heading="Prompts">
          {active.map((p) => {
            const c = collections.find((x) => x.id === p.collectionId);
            return (
              <CommandItem key={p.id} value={`${p.title} ${p.description} ${p.content} ${p.tags.join(" ")} ${c?.name ?? ""}`} onSelect={() => { select(p.id); navigate({ to: "/prompts" }); close(); }}>
                {p.isTemplate ? <Braces className="text-primary" /> : <FileText />}
                <span className="truncate">{p.title}</span>
                <CommandShortcut>{c?.name}</CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Collections">
          {collections.map((c) => (
            <CommandItem key={c.id} value={`collection ${c.name}`} onSelect={() => { navigate({ to: "/collections/$id", params: { id: c.id } }); close(); }}>
              <Folder style={{ color: c.color }} /> {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="new prompt create" onSelect={() => { navigate({ to: "/editor/$id", params: { id: "new" } }); close(); }}><Plus /> New prompt</CommandItem>
          <CommandItem value="settings preferences" onSelect={() => { navigate({ to: "/settings" }); close(); }}><Settings /> Settings</CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="flex items-center gap-4 border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        <span><kbd className="rounded bg-elevated px-1">↑↓</kbd> navigate</span>
        <span><kbd className="rounded bg-elevated px-1">↵</kbd> open</span>
        <span><kbd className="rounded bg-elevated px-1">esc</kbd> close</span>
      </div>
    </CommandDialog>
  );
}
