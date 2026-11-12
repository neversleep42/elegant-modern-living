import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractVariables, fillTemplate, humanize, copyText, usePV, type Prompt } from "@/lib/store";
import { toast } from "sonner";
import { Highlighted } from "./highlight";

export function TemplateDialog({ prompt, open, onOpenChange }: { prompt: Prompt | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const markUsed = usePV((s) => s.markUsed);
  if (!prompt) return null;
  const vars = extractVariables(prompt.content);
  const result = fillTemplate(prompt.content, values);
  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setValues({}); }}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border p-5">
          <DialogTitle className="text-base">{prompt.title}</DialogTitle>
          <DialogDescription>Fill in the variables to generate your prompt.</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[70vh] overflow-y-auto md:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3 border-border p-5 md:border-r">
            {vars.map((v) => (
              <label key={v} className="block">
                <span className="mb-1 block text-[12px] text-muted-foreground">{humanize(v)}</span>
                <Input value={values[v] ?? ""} onChange={(e) => setValues({ ...values, [v]: e.target.value })} placeholder={`Enter ${humanize(v).toLowerCase()}`} />
              </label>
            ))}
            {vars.length === 0 && <p className="text-sm text-muted-foreground">This prompt has no variables.</p>}
          </div>
          <div className="bg-background/50 p-5">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Final prompt</div>
            <pre className="whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed"><Highlighted text={result} /></pre>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border p-4">
          <Button variant="ghost" onClick={() => setValues({})}><RotateCcw /> Reset</Button>
          <Button onClick={() => { copyText(result); markUsed(prompt.id); toast.success("Prompt copied to clipboard."); }}><Copy /> Copy prompt</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
