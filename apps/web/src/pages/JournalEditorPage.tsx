import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/journal/RichTextEditor';
import { MoodSelector } from '@/components/journal/MoodSelector';
import { TagInput } from '@/components/journal/TagInput';
import {
  useJournalEntry,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useJournalTags,
} from '@/hooks/use-journal';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export default function JournalEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewEntry = id === 'new';

  const { data: entry, isLoading } = useJournalEntry(id || '');
  const { data: tagsData } = useJournalTags();
  const createMutation = useCreateJournalEntry();
  const updateMutation = useUpdateJournalEntry(id || '');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>({
    type: 'doc',
    content: [],
  });
  const [mood, setMood] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);

  const [hasChanges, setHasChanges] = useState(false);
  const debouncedContent = useDebounce(content, 2000);

  // Load entry data
  useEffect(() => {
    if (entry && !isNewEntry) {
      setTitle(entry.title || '');
      setContent(entry.content);
      setMood(entry.mood || undefined);
      setTags(entry.tags);
    }
  }, [entry, isNewEntry]);

  // Auto-save for existing entries
  useEffect(() => {
    if (!isNewEntry && hasChanges && debouncedContent) {
      handleSave();
    }
  }, [debouncedContent]);

  const handleSave = async () => {
    const data = {
      title: title || undefined,
      content,
      mood,
      tags,
    };

    if (isNewEntry) {
      const result = await createMutation.mutateAsync(data);
      navigate(`/journal/${result.id}`, { replace: true });
    } else {
      await updateMutation.mutateAsync(data);
      setHasChanges(false);
    }
  };

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    setHasChanges(true);
  };

  if (isLoading && !isNewEntry) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/journal')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Journal
        </Button>

        <div className="flex items-center gap-2">
          {!isNewEntry && hasChanges && (
            <span className="text-sm text-muted-foreground">Unsaved changes</span>
          )}
          {isSaving && (
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
          )}
          {isNewEntry && (
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Create Entry
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-4">
        {/* Title */}
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setHasChanges(true);
          }}
          placeholder="Entry title (optional)"
          className="text-2xl font-semibold border-0 px-0 focus-visible:ring-0"
        />

        {/* Mood Selector */}
        <MoodSelector
          value={mood}
          onChange={(newMood) => {
            setMood(newMood);
            setHasChanges(true);
          }}
        />

        {/* Rich Text Editor */}
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          placeholder="What's on your mind?"
        />

        {/* Tags */}
        <TagInput
          value={tags}
          onChange={(newTags) => {
            setTags(newTags);
            setHasChanges(true);
          }}
          suggestions={tagsData?.tags || []}
        />
      </div>

      {/* Auto-save indicator */}
      {!isNewEntry && (
        <div className="text-center text-sm text-muted-foreground">
          {isSaving ? 'Saving...' : hasChanges ? 'Auto-saving...' : 'All changes saved'}
        </div>
      )}
    </div>
  );
}

