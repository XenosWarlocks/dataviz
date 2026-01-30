import { useState } from "react";
import { useCategoryDistribution, useMergeTerms } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitMerge, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MergeTermsPanelProps {
  categoryId: number;
}

export function MergeTermsPanel({ categoryId }: MergeTermsPanelProps) {
  const { data: distribution } = useCategoryDistribution(categoryId);
  const mergeMutation = useMergeTerms();
  
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [mergedTerm, setMergedTerm] = useState("");

  const handleToggleTerm = (term: string) => {
    setSelectedTerms(prev => 
      prev.includes(term) 
        ? prev.filter(t => t !== term)
        : [...prev, term]
    );
  };

  const handleMerge = () => {
    if (!mergedTerm.trim() || selectedTerms.length < 1) return;
    
    mergeMutation.mutate(
      { categoryId, originalTerms: selectedTerms, mergedTerm },
      {
        onSuccess: () => {
          setSelectedTerms([]);
          setMergedTerm("");
        }
      }
    );
  };

  const terms = distribution || [];
  const sortedTerms = [...terms].sort((a, b) => b.count - a.count);

  return (
    <Card className="border-border/50 shadow-md flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-accent/10 rounded-md">
            <GitMerge className="w-4 h-4 text-accent" />
          </div>
          <CardTitle className="font-display text-lg">Merge Terms</CardTitle>
        </div>
        <CardDescription>
          Select similar terms to combine them into one.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 min-h-[200px] border rounded-xl overflow-hidden bg-muted/10">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {sortedTerms.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No terms to merge yet.</p>
              ) : (
                sortedTerms.map((item) => (
                  <div key={item.term} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <Checkbox 
                      id={`term-${item.term}`}
                      checked={selectedTerms.includes(item.term)}
                      onCheckedChange={() => handleToggleTerm(item.term)}
                    />
                    <label
                      htmlFor={`term-${item.term}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 flex justify-between cursor-pointer"
                    >
                      <span className="truncate max-w-[150px]">{item.term}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">{item.count}</Badge>
                    </label>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Merge Into</label>
            <div className="flex gap-2">
              <Input
                value={mergedTerm}
                onChange={(e) => setMergedTerm(e.target.value)}
                placeholder="New term name..."
                className="rounded-lg"
              />
              <Button 
                onClick={handleMerge}
                disabled={selectedTerms.length === 0 || !mergedTerm.trim() || mergeMutation.isPending}
                className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {mergeMutation.isPending ? "..." : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedTerms.length} terms selected to merge.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
