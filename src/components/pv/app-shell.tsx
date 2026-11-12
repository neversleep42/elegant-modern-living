import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Archive, Bell, Braces, ChevronsUpDown, Clock, Home, Layers, Menu, PanelLeft, Plus, Search, Settings, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePV, COLLECTION_COLORS } from "@/lib/store";
import { VaultLogo } from "./vault-logo";
import { CommandPalette } from "./command-palette";
import { DetailPanel } from "./detail-panel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "Overview", icon: Home },
  { to: "/prompts", label: "All Prompts", icon: Layers },
  { to: "/templates", label: "Templates", icon: Braces },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/recent", label: "Recent", icon: Clock },
  { to: "/archived", label: "Archived", icon: Archive },
] as const;

function useApplyTheme() {
  const theme = usePV((s) => s.theme);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && mq.matches));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
}

export function NewCollectionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addCollection = usePV((s) => s.addCollection);
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(COLLECTION_COLORS[0] ?? "#A78BFA");
  const submit = () => { if (!name.trim()) return; addCollection(name.trim(), color); toast.success("Collection created"); setName(""); onOpenChange(false); };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>New collection</DialogTitle></DialogHeader>
        <Input autoFocus placeholder="Collection name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        <div className="flex gap-2">{COLLECTION_COLORS.map((c) => <button key={c} onClick={() => setColor(c)} className={cn("size-6 rounded-full ring-offset-2 ring-offset-background", color === c && "ring-2 ring-ring")} style={{ background: c }} aria-label={c} />)}</div>
        <Button onClick={submit}>Create collection</Button>
      </DialogContent>
    </Dialog>
  );
}

function Sidebar({ collapsed, onCollapse, onNavigate }: { collapsed: boolean; onCollapse: () => void; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { collections, prompts, workspaceName } = usePV();
  const [newOpen, setNewOpen] = useState(false);
  const item = (active: boolean) => cn("flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] transition-colors", active ? "bg-sidebar-accent text-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground", collapsed && "justify-center px-0");
  return (
    <aside className={cn("flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200", collapsed ? "w-14" : "w-60")}>
      <div className={cn("flex h-14 items-center gap-2.5 px-3", collapsed && "justify-center")}>
        <VaultLogo />
        {!collapsed && <span className="flex-1 text-[14px] font-semibold tracking-tight">PromptVault</span>}
        {!collapsed && <button onClick={onCollapse} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent" aria-label="Collapse sidebar"><PanelLeft className="size-4" /></button>}
      </div>
      {!collapsed && (
        <button className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-sidebar-border px-2.5 py-2 text-left hover:bg-sidebar-accent/60">
          <span className="grid size-5 place-items-center rounded bg-success/20 text-[10px] font-semibold text-success">{workspaceName[0]}</span>
          <span className="flex-1 truncate text-[12.5px]">{workspaceName}</span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </button>
      )}
      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-2">
        <div>
          {!collapsed && <div className="px-2 pb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground/70">Workspace</div>}
          <div className="space-y-0.5">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={onNavigate} className={item(path === n.to)} title={n.label}>
                <n.icon className="size-4 shrink-0" />{!collapsed && n.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between px-2 pb-1.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground/70">Collections</span>
              <button onClick={() => setNewOpen(true)} className="grid size-5 place-items-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" aria-label="New collection"><Plus className="size-3.5" /></button>
            </div>
          )}
          <div className="space-y-0.5">
            {collections.map((c) => {
              const count = prompts.filter((p) => p.collectionId === c.id && !p.archived).length;
              return (
                <Link key={c.id} to="/collections/$id" params={{ id: c.id }} onClick={onNavigate} className={item(path === `/collections/${c.id}`)} title={c.name}>
                  <span className="grid size-4 shrink-0 place-items-center"><span className="size-2 rounded-full" style={{ background: c.color }} /></span>
                  {!collapsed && <><span className="flex-1 truncate">{c.name}</span><span className="text-[11px] text-muted-foreground/70">{count}</span></>}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <div className="space-y-1 border-t border-sidebar-border p-2">
        <Link to="/settings" onClick={onNavigate} className={item(path === "/settings")} title="Settings"><Settings className="size-4" />{!collapsed && "Settings"}</Link>
        {collapsed ? (
          <button onClick={onCollapse} className={item(false)} aria-label="Expand sidebar"><PanelLeft className="size-4" /></button>
        ) : (
          <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <div className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-primary to-success text-[11px] font-semibold text-primary-foreground">AN</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-medium">Andy Nathey</div>
              <div className="truncate text-[11px] text-muted-foreground">andy@promptvault.app</div>
            </div>
            <span className="rounded border border-sidebar-border px-1.5 py-0.5 text-[10px] text-muted-foreground">Free</span>
          </div>
        )}
      </div>
      <NewCollectionDialog open={newOpen} onOpenChange={setNewOpen} />
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  useApplyTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const select = usePV((s) => s.select);
  useEffect(() => { void usePV.persist.rehydrate(); }, []);
  useEffect(() => { setMobileOpen(false); }, [path]);
  useEffect(() => { if (path.startsWith("/editor") || path === "/settings") select(null); }, [path, select]);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden md:block"><Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} /></div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-60 fade-in"><Sidebar collapsed={false} onCollapse={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} /></div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-2 border-b border-border px-3 md:hidden">
          <button onClick={() => setMobileOpen(true)} className="grid size-8 place-items-center rounded-md hover:bg-elevated" aria-label="Open menu"><Menu className="size-4" /></button>
          <VaultLogo className="size-6" /><span className="text-sm font-semibold">PromptVault</span>
        </div>
        <div className="flex min-h-0 flex-1">
          <main className="scrollbar-thin min-w-0 flex-1 overflow-y-auto">{children}</main>
          <DetailPanel />
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}

export function TopBar({ crumbs, children }: { crumbs: string[]; children?: ReactNode }) {
  const setSearchOpen = usePV((s) => s.setSearchOpen);
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-md md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px]">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 truncate">
            {i > 0 && <span className="text-muted-foreground/50">/</span>}
            <span className={i === crumbs.length - 1 ? "text-foreground" : "text-muted-foreground"}>{c}</span>
          </span>
        ))}
      </div>
      {children}
      <button onClick={() => setSearchOpen(true)} className="flex h-8 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-[12.5px] text-muted-foreground hover:text-foreground">
        <Search className="size-3.5" /><span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded bg-elevated px-1.5 font-mono text-[10.5px] sm:inline">⌘K</kbd>
      </button>
      <button onClick={() => toast("You're all caught up.")} className="relative hidden size-8 place-items-center rounded-lg text-muted-foreground hover:bg-elevated hover:text-foreground sm:grid" aria-label="Notifications">
        <Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
      </button>
    </header>
  );
}
