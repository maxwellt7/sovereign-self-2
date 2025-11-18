import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KnowledgeTree } from '@/components/knowledge/KnowledgeTree';
import { SemanticSearch } from '@/components/knowledge/SemanticSearch';
import { RichTextEditor } from '@/components/journal/RichTextEditor';
import { Input } from '@/components/ui/input';
import { TagInput } from '@/components/journal/TagInput';
import {
  useKnowledgeHierarchy,
  useKnowledgeItem,
  useCreateKnowledgeItem,
  useUpdateKnowledgeItem,
  useKnowledgeTags,
} from '@/hooks/use-knowledge';
import { PlusCircle, Save, Loader2, Sparkles } from 'lucide-react';
import { KnowledgeItemType } from '@sovereign-self/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ITEM_TYPES: Array<{ value: KnowledgeItemType; label: string }> = [
  { value: 'NOTE', label: 'Note' },
  { value: 'ARTICLE', label: 'Article' },
  { value: 'RESOURCE', label: 'Resource' },
  { value: 'INSIGHT', label: 'Insight' },
];

export default function KnowledgePage() {
  const [selectedId, setSelectedId] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  const { data: hierarchy, isLoading } = useKnowledgeHierarchy();
  const { data: selectedItem } = useKnowledgeItem(selectedId || '');
  const { data: tagsData } = useKnowledgeTags();
  const createMutation = useCreateKnowledgeItem();
  const updateMutation = useUpdateKnowledgeItem(selectedId || '');

  const [title, setTitle] = useState('');
  const [type, setType] = useState<KnowledgeItemType>('NOTE');
  const [content, setContent] = useState<any>({ type: 'doc', content: [] });
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Load selected item
  useState(() => {
    if (selectedItem) {
      setTitle(selectedItem.title);
      setType(selectedItem.type);
      setContent(selectedItem.content);
      setSourceUrl(selectedItem.sourceUrl || '');
      setTags(selectedItem.tags);
      setIsCreating(false);
    }
  });

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedId(undefined);
    setTitle('');
    setType('NOTE');
    setContent({ type: 'doc', content: [] });
    setSourceUrl('');
    setTags([]);
  };

  const handleSave = async () => {
    const data = {
      title,
      type,
      content,
      sourceUrl: sourceUrl || undefined,
      tags,
    };

    if (isCreating) {
      const result = await createMutation.mutateAsync(data as any);
      setSelectedId(result.id);
      setIsCreating(false);
    } else if (selectedId) {
      await updateMutation.mutateAsync(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">Your curated library of insights</p>
        </div>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Item
        </Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="browse" className="flex-1">Browse</TabsTrigger>
                <TabsTrigger value="search" className="flex-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Search
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="p-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gold" />
                  </div>
                ) : hierarchy?.items?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No items yet</p>
                  </div>
                ) : (
                  <KnowledgeTree
                    items={hierarchy?.items || []}
                    selectedId={selectedId}
                    onSelect={(item) => setSelectedId(item.id)}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="search" className="p-4">
                <SemanticSearch onSelectResult={setSelectedId} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              {!selectedId && !isCreating ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Select an item or create a new one to get started</p>
                </div>
              ) : (
                <>
                  {/* Title */}
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Item title"
                    className="text-xl font-semibold border-0 px-0 focus-visible:ring-0"
                  />

                  {/* Type selector */}
                  <div className="flex gap-2">
                    {ITEM_TYPES.map((itemType) => (
                      <button
                        key={itemType.value}
                        onClick={() => setType(itemType.value)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          type === itemType.value
                            ? 'bg-gold text-white'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        {itemType.label}
                      </button>
                    ))}
                  </div>

                  {/* Source URL (optional) */}
                  {type === 'ARTICLE' || type === 'RESOURCE' ? (
                    <Input
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="Source URL (optional)"
                    />
                  ) : null}

                  {/* Content */}
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing..."
                  />

                  {/* Tags */}
                  <TagInput
                    value={tags}
                    onChange={setTags}
                    suggestions={tagsData?.tags || []}
                  />

                  {/* Save button */}
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving || !title}>
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {isCreating ? 'Create' : 'Save'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

