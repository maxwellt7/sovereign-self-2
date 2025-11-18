import { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Link as LinkIcon, Lightbulb, BookOpen } from 'lucide-react';
import { KnowledgeBaseItem } from '@sovereign-self/shared';
import { cn } from '@/lib/utils';

interface KnowledgeTreeProps {
  items: any[];
  selectedId?: string;
  onSelect: (item: KnowledgeBaseItem) => void;
}

const TYPE_ICONS = {
  NOTE: FileText,
  ARTICLE: BookOpen,
  RESOURCE: LinkIcon,
  INSIGHT: Lightbulb,
};

export function KnowledgeTree({ items, selectedId, onSelect }: KnowledgeTreeProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          selectedId={selectedId}
          onSelect={onSelect}
          level={0}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  item: any;
  selectedId?: string;
  onSelect: (item: KnowledgeBaseItem) => void;
  level: number;
}

function TreeNode({ item, selectedId, onSelect, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = (TYPE_ICONS as any)[item.type] || FileText;
  const isSelected = item.id === selectedId;

  return (
    <div>
      <button
        onClick={() => onSelect(item)}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors hover:bg-accent',
          isSelected && 'bg-gold/10 text-gold hover:bg-gold/20',
          !isSelected && 'text-foreground'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-accent rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate flex-1 text-left">{item.title}</span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {item.children.map((child: any) => (
            <TreeNode
              key={child.id}
              item={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

