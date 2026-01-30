import { useState } from "react";
import { useAddEntries } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, Plus } from "lucide-react";

interface AddDataPanelProps {
  categoryId: number;
}

export function AddDataPanel({ categoryId }: AddDataPanelProps) {
  const [text, setText] = useState("");
  const addEntriesMutation = useAddEntries();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addEntriesMutation.mutate(
      { categoryId, rawText: text },
      {
        onSuccess: () => setText(""),
      }
    );
  };

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-primary/10 rounded-md">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="font-display text-lg">Add Data</CardTitle>
        </div>
        <CardDescription>
          Paste text separated by commas or newlines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Apple, Banana, Cherry..."
            className="min-h-[150px] font-mono text-sm resize-none rounded-xl focus-visible:ring-primary"
          />
          <Button 
            type="submit" 
            className="w-full rounded-xl"
            disabled={!text.trim() || addEntriesMutation.isPending}
          >
            {addEntriesMutation.isPending ? "Processing..." : (
              <>
                <Plus className="mr-2 w-4 h-4" /> Add Entries
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
