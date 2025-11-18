import { useState } from 'react';
import { Smile, Frown, Meh, Heart, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOODS = [
  { value: 'grateful', label: 'Grateful', icon: Heart, color: 'text-pink-500' },
  { value: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-500' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500' },
  { value: 'energized', label: 'Energized', icon: Zap, color: 'text-orange-500' },
  { value: 'focused', label: 'Focused', icon: Target, color: 'text-purple-500' },
];

interface MoodSelectorProps {
  value?: string;
  onChange: (mood: string) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">How are you feeling?</label>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => {
          const Icon = mood.icon;
          const isSelected = value === mood.value;

          return (
            <button
              key={mood.value}
              onClick={() => onChange(mood.value)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
                isSelected
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-border hover:border-gold/50'
              )}
            >
              <Icon className={cn('h-4 w-4', isSelected ? 'text-gold' : mood.color)} />
              <span className="text-sm">{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

