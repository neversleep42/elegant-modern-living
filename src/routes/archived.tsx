import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/components/pv/library";

export const Route = createFileRoute("/archived")({
  head: () => ({ meta: [{ title: "Archived — PromptVault" }, { name: "description", content: "Prompts you've put aside." }, { property: "og:title", content: "Archived — PromptVault" }, { property: "og:description", content: "Prompts you've put aside." }] }),
  component: () => <Library crumbs={["Workspace", "Archived"]} title="Archived" description="Prompts you've put aside. Restore them anytime." base={(p) => p.archived} />,
});
