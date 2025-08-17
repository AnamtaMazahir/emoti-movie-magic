import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoodSelector } from '@/components/MoodSelector';
import { PreferenceForm } from '@/components/PreferenceForm';
import { MovieCard } from '@/components/MovieCard';
import { Film, Sparkles } from 'lucide-react';

// Import movie poster images
import poster1 from '@/assets/movie-poster-1.jpg';
import poster2 from '@/assets/movie-poster-2.jpg';
import poster3 from '@/assets/movie-poster-3.jpg';
import poster4 from '@/assets/movie-poster-4.jpg';

const mockMovies = [
  {
    id: 1,
    title: "Cosmic Dreams",
    year: 2024,
    rating: 8.7,
    duration: "2h 18m",
    genre: "Sci-Fi Adventure",
    description: "A breathtaking journey through the cosmos where dreams become reality and the impossible becomes possible.",
    poster: poster1
  },
  {
    id: 2,
    title: "Midnight Detective",
    year: 2023,
    rating: 8.2,
    duration: "1h 47m", 
    genre: "Noir Thriller",
    description: "A gripping detective story set in the neon-lit streets of a city that never sleeps, where every shadow hides a secret.",
    poster: poster2
  },
  {
    id: 3,
    title: "Summer Romance",
    year: 2024,
    rating: 7.9,
    duration: "1h 32m",
    genre: "Romantic Comedy",
    description: "A heartwarming tale of unexpected love that blooms during one magical summer by the seaside.",
    poster: poster3
  },
  {
    id: 4,
    title: "The Last Kingdom",
    year: 2023,
    rating: 9.1,
    duration: "2h 45m",
    genre: "Epic Fantasy",
    description: "An epic saga of honor, magic, and destiny as kingdoms clash and heroes rise to defend their realm.",
    poster: poster4
  },
];

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [preferences, setPreferences] = useState({
    genres: [] as string[],
    language: '',
    actor: ''
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleGetRecommendations = () => {
    setShowRecommendations(true);
  };

  const resetForm = () => {
    setSelectedMood('');
    setPreferences({ genres: [], language: '', actor: '' });
    setShowRecommendations(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Film className="w-12 h-12 text-accent animate-glow-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              EmotiMovie Magic
            </h1>
          </div>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Discover your perfect movie match based on your mood and preferences. 
            Let our intelligent system find films that speak to your heart.
          </p>
        </div>

        {!showRecommendations ? (
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Mood Selection */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50 shadow-elegant">
              <MoodSelector 
                selectedMood={selectedMood} 
                onMoodChange={setSelectedMood} 
              />
            </div>

            {/* Preferences Form */}
            {selectedMood && (
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50 shadow-elegant">
                <PreferenceForm 
                  preferences={preferences}
                  onPreferenceChange={setPreferences}
                />
              </div>
            )}

            {/* Get Recommendations Button */}
            {selectedMood && (preferences.genres.length > 0 || preferences.language) && (
              <div className="text-center animate-slide-up">
                <Button
                  onClick={handleGetRecommendations}
                  size="lg"
                  className="
                    bg-gradient-accent text-accent-foreground px-8 py-6 text-lg font-semibold
                    hover:shadow-glow hover:scale-105 transition-all duration-300
                    animate-glow-pulse
                  "
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get My Movie Recommendations
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Recommendations Section */
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
                Perfect Matches for Your Mood
              </h2>
              <p className="text-foreground/70 mb-6">
                Based on your {selectedMood} mood and preferences
              </p>
              <Button
                onClick={resetForm}
                variant="secondary"
                className="bg-secondary hover:bg-secondary/80"
              >
                Try Different Preferences
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;