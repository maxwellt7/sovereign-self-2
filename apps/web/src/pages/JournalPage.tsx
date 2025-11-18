import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { useJournalEntries } from '@/hooks/use-journal';
import { PlusCircle, Search, Filter, Loader2 } from 'lucide-react';

export default function JournalPage() {
  const [search, setSearch] = useState('');
  const [filters] = useState<Record<string, any>>({});

  const { data, isLoading } = useJournalEntries({
    ...filters,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Journal</h1>
          <p className="text-muted-foreground">Your personal reflection space</p>
        </div>
        <Button asChild>
          <Link to="/journal/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Entries List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No journal entries yet</p>
          <Button asChild>
            <Link to="/journal/new">Create your first entry</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.data.map((entry: any) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Pagination controls would go here */}
          <p className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </p>
        </div>
      )}
    </div>
  );
}

