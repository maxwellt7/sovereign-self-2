import { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSemanticSearch } from '@/hooks/use-knowledge';

interface SemanticSearchProps {
  onSelectResult: (itemId: string) => void;
}

export function SemanticSearch({ onSelectResult }: SemanticSearchProps) {
  const [query, setQuery] = useState('');
  const searchMutation = useSemanticSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchMutation.mutateAsync(query);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gold" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question or search by meaning..."
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={searchMutation.isPending}>
          {searchMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {searchMutation.data && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Found {searchMutation.data.results.length} results
          </p>
          {searchMutation.data.results.map((result: any) => (
            <Card
              key={result.id}
              className="cursor-pointer hover:border-gold transition-colors"
              onClick={() => onSelectResult(result.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{result.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-secondary">
                        {result.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(result.relevanceScore * 100)}% match
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

