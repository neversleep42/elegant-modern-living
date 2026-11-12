import { useNavigate } from "@tanstack/react-router";
import { Archive, Copy, FolderInput, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePV, type Prompt } from "@/lib/store";

export function PromptActions({ prompt, className }: { prompt: Prompt; className?: string }) {
  const navigate = useNavigate();
  const { collections, duplicatePrompt, toggleArchive, deletePrompt, savePrompt } = usePV();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button onClick={(e) => e.stopPropagation()} className={"grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-elevated hover:text-foreground " + (className ?? "")} aria-label="More actions">
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => navigate({ to: "/editor/$id", params: { id: prompt.id } })}><Pencil /> Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { duplicatePrompt(prompt.id); toast.success("Prompt duplicated"); }}><Copy /> Duplicate</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><FolderInput className="mr-2 size-4" /> Move to Collection</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {collections.map((c) => (
              <DropdownMenuItem key={c.id} onClick={() => { savePrompt({ id: prompt.id, collectionId: c.id }); toast.success(`Moved to ${c.name}`); }}>
                <span className="size-2 rounded-full" style={{ background: c.color }} /> {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => { toggleArchive(prompt.id); toast.success(prompt.archived ? "Restored" : "Archived"); }}><Archive /> {prompt.archived ? "Unarchive" : "Archive"}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { deletePrompt(prompt.id); toast.success("Prompt deleted"); }}><Trash2 /> Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
