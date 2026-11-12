import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/components/pv/library";

export const Route = createFileRoute("/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — PromptVault" }, { name: "description", content: "Manage and organize your AI prompts." }, { property: "og:title", content: "Prompt Library — PromptVault" }, { property: "og:description", content: "Manage and organize your AI prompts." }] }),
  component: () => <Library crumbs={["Workspace", "All Prompts"]} title="Prompt Library" description="Manage and organize your AI prompts." base={(p) => !p.archived} />,
});
