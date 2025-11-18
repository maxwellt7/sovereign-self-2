import { Link } from 'react-router-dom';
import { JournalEntry } from '@sovereign-self/shared';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { Calendar, Tag } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  // Extract plain text from Tiptap JSON (simplified)
  const getPlainText = (content: any): string => {
    if (!content || !content.content) return '';
    
    let text = '';
    const traverse = (node: any) => {
      if (node.type === 'text') {
        text += node.text + ' ';
      }
      if (node.content) {
        node.content.forEach(traverse);
      }
    };
    
    traverse(content);
    return text.trim();
  };

  const plainText = getPlainText(entry.content);
  const preview = plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');

  return (
    <Link to={`/journal/${entry.id}`}>
      <Card className="hover:border-gold transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {entry.title && (
                <h3 className="font-semibold text-lg mb-1">{entry.title}</h3>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatRelativeTime(entry.createdAt)}
                </span>
                {entry.mood && (
                  <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs">
                    {entry.mood}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-sm mb-3">{preview}</p>
          
          {entry.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {entry.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-md bg-secondary"
                >
                  {tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{entry.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

