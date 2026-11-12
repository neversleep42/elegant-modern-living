import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Braces } from "lucide-react";
import { Library } from "@/components/pv/library";
import { PromptCard } from "@/components/pv/prompt-card";
import { TemplateDialog } from "@/components/pv/template-dialog";
import { Button } from "@/components/ui/button";
import { extractVariables, type Prompt } from "@/lib/store";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates — PromptVault" }, { name: "description", content: "Reusable prompts with dynamic variables." }, { property: "og:title", content: "Templates — PromptVault" }, { property: "og:description", content: "Reusable prompts with dynamic variables." }] }),
  component: Templates,
});

function Templates() {
  const [active, setActive] = useState<Prompt | null>(null);
  return (
    <>
      <Library
        crumbs={["Workspace", "Templates"]} title="Templates" description="Reusable prompts with {{variables}} — fill them in, copy, done."
        base={(p) => p.isTemplate && !p.archived}
        renderCard={(p, view) => (
          <div key={p.id} className="relative">
            <PromptCard prompt={p} view={view} showPreview={false} />
            {view === "grid" && (
              <div className="pointer-events-none absolute inset-x-4 bottom-12 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{extractVariables(p.content).length} variables</span>
                <Button size="sm" variant="secondary" className="pointer-events-auto h-7" onClick={() => setActive(p)}><Braces /> Use Template</Button>
              </div>
            )}
          </div>
        )}
      />
      <TemplateDialog prompt={active} open={!!active} onOpenChange={(v) => !v && setActive(null)} />
    </>
  );
}
