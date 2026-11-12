import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/components/pv/library";
import { usePV } from "@/lib/store";

export const Route = createFileRoute("/collections/$id")({
  head: () => ({ meta: [{ title: "Collection — PromptVault" }, { name: "description", content: "Prompts in this collection." }, { property: "og:title", content: "Collection — PromptVault" }, { property: "og:description", content: "Prompts in this collection." }] }),
  component: CollectionPage,
});

function CollectionPage() {
  const { id } = Route.useParams();
  const c = usePV((s) => s.collections.find((x) => x.id === id));
  return <Library key={id} crumbs={["Collections", c?.name ?? "Unknown"]} title={c?.name ?? "Collection"} description={c?.description || "Prompts in this collection."} base={(p) => p.collectionId === id && !p.archived} hideCollectionFilter />;
}
