import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/components/pv/library";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — PromptVault" }, { name: "description", content: "Your starred prompts, always within reach." }, { property: "og:title", content: "Favorites — PromptVault" }, { property: "og:description", content: "Your starred prompts, always within reach." }] }),
  component: () => <Library crumbs={["Workspace", "Favorites"]} title="Favorites" description="Your starred prompts, always within reach." base={(p) => p.favorite && !p.archived} />,
});
