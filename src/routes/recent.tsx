import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/components/pv/library";

export const Route = createFileRoute("/recent")({
  head: () => ({ meta: [{ title: "Recent — PromptVault" }, { name: "description", content: "Prompts you edited in the last two weeks." }, { property: "og:title", content: "Recent — PromptVault" }, { property: "og:description", content: "Prompts you edited in the last two weeks." }] }),
  component: () => <Library crumbs={["Workspace", "Recent"]} title="Recent" description="Prompts you edited in the last two weeks." base={(p) => !p.archived && Date.now() - p.updatedAt < 14 * 864e5} />,
});
