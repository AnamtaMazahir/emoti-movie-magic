import { useState } from 'react';
import { Button } from '@/components/ui/button';

const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '😎', label: 'Adventurous', value: 'adventurous' },
  { emoji: '😱', label: 'Thrilled', value: 'thrilled' },
  { emoji: '🥰', label: 'Romantic', value: 'romantic' },
  { emoji: '😴', label: 'Relaxed', value: 'relaxed' },
  { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful' },
  { emoji: '😂', label: 'Comedy', value: 'comedy' },
];

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

export const MoodSelector = ({ selectedMood, onMoodChange }: MoodSelectorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
        How are you feeling today?
      </h2>
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            variant={selectedMood === mood.value ? "default" : "secondary"}
            className={`
              aspect-square p-4 flex flex-col gap-1 transition-all duration-300 
              hover:scale-105 hover:shadow-glow
              ${selectedMood === mood.value 
                ? 'bg-gradient-accent text-accent-foreground shadow-glow' 
                : 'bg-secondary hover:bg-secondary/80'
              }
            `}
            onClick={() => onMoodChange(mood.value)}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};