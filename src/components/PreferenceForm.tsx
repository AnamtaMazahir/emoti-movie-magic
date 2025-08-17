import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese',
  'Korean', 'Mandarin', 'Hindi', 'Portuguese', 'Russian', 'Arabic'
];

interface PreferenceFormProps {
  preferences: {
    genres: string[];
    language: string;
    actor: string;
  };
  onPreferenceChange: (preferences: any) => void;
}

export const PreferenceForm = ({ preferences, onPreferenceChange }: PreferenceFormProps) => {
  const toggleGenre = (genre: string) => {
    const updatedGenres = preferences.genres.includes(genre)
      ? preferences.genres.filter(g => g !== genre)
      : [...preferences.genres, genre];
    
    onPreferenceChange({
      ...preferences,
      genres: updatedGenres
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
        Tell us your preferences
      </h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="actor" className="text-foreground/90 mb-2 block">
            Favorite Actor (optional)
          </Label>
          <Input
            id="actor"
            placeholder="e.g., Tom Hanks, Scarlett Johansson..."
            value={preferences.actor}
            onChange={(e) => onPreferenceChange({
              ...preferences,
              actor: e.target.value
            })}
            className="bg-secondary border-border focus:ring-primary"
          />
        </div>

        <div>
          <Label className="text-foreground/90 mb-3 block">Select Genres</Label>
          <div className="grid grid-cols-3 gap-2 max-w-lg">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={preferences.genres.includes(genre) ? "default" : "secondary"}
                size="sm"
                onClick={() => toggleGenre(genre)}
                className={`
                  transition-all duration-200 hover:scale-105
                  ${preferences.genres.includes(genre)
                    ? 'bg-gradient-accent text-accent-foreground shadow-elegant'
                    : 'bg-secondary hover:bg-secondary/80'
                  }
                `}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-foreground/90 mb-3 block">Preferred Language</Label>
          <div className="grid grid-cols-4 gap-2 max-w-lg">
            {languages.map((language) => (
              <Button
                key={language}
                variant={preferences.language === language ? "default" : "secondary"}
                size="sm"
                onClick={() => onPreferenceChange({
                  ...preferences,
                  language: language
                })}
                className={`
                  transition-all duration-200 hover:scale-105
                  ${preferences.language === language
                    ? 'bg-gradient-accent text-accent-foreground shadow-elegant'
                    : 'bg-secondary hover:bg-secondary/80'
                  }
                `}
              >
                {language}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};