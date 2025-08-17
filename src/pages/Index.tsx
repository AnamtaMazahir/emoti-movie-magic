import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MoodSelector } from '@/components/MoodSelector';
import { PreferenceForm } from '@/components/PreferenceForm';
import { MovieCard } from '@/components/MovieCard';
import { SearchAndFilter, FilterOptions } from '@/components/SearchAndFilter';
import { tmdbAPI, ProcessedMovie } from '@/lib/tmdb';
import { Film, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [preferences, setPreferences] = useState({
    genres: [] as string[],
    language: '',
    actor: ''
  });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [movies, setMovies] = useState<ProcessedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const { toast } = useToast();

  // Load trending movies on initial load
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const loadTrendingMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const trendingMovies = await tmdbAPI.getTrendingMovies();
      setMovies(trendingMovies.slice(0, 8)); // Limit to 8 movies initially
    } catch (err) {
      setError('Failed to load trending movies');
      toast({
        title: "Error",
        description: "Failed to load trending movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!selectedMood) return;
    
    try {
      setLoading(true);
      setError(null);
      setShowRecommendations(true);
      
      const recommendedMovies = await tmdbAPI.getMoviesByMoodAndPreferences(
        selectedMood,
        preferences
      );
      
      if (recommendedMovies.length === 0) {
        setError('No movies found matching your preferences. Try different settings.');
        toast({
          title: "No Results",
          description: "No movies found matching your preferences. Try different settings.",
          variant: "destructive",
        });
        return;
      }
      
      setMovies(recommendedMovies.slice(0, 12));
      setSearchMode(false);
      
      toast({
        title: "Recommendations Ready!",
        description: `Found ${recommendedMovies.length} movies matching your mood and preferences.`,
      });
    } catch (err) {
      setError('Failed to get recommendations');
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      setSearchMode(true);
      
      const searchResults = await tmdbAPI.searchMovies(query);
      
      if (searchResults.length === 0) {
        setError(`No movies found for "${query}"`);
        toast({
          title: "No Results",
          description: `No movies found for "${query}". Try a different search term.`,
        });
        return;
      }
      
      setMovies(searchResults);
      setShowRecommendations(true);
      
      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} movies for "${query}".`,
      });
    } catch (err) {
      setError('Search failed');
      toast({
        title: "Search Error",
        description: "Search failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterOptions: FilterOptions) => {
    if (movies.length === 0) return;
    
    let filteredMovies = [...movies];
    
    // Apply minimum rating filter
    if (filterOptions.minRating > 0) {
      filteredMovies = filteredMovies.filter(movie => movie.rating >= filterOptions.minRating);
    }
    
    // Apply year filter
    if (filterOptions.year) {
      filteredMovies = filteredMovies.filter(movie => movie.year === filterOptions.year);
    }
    
    // Apply sorting
    switch (filterOptions.sortBy) {
      case 'rating':
        filteredMovies.sort((a, b) => b.rating - a.rating);
        break;
      case 'year':
        filteredMovies.sort((a, b) => b.year - a.year);
        break;
      case 'title':
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popularity':
      default:
        filteredMovies.sort((a, b) => b.popularity - a.popularity);
        break;
    }
    
    setMovies(filteredMovies);
    
    if (filteredMovies.length === 0) {
      setError('No movies match the current filters');
      toast({
        title: "No Results",
        description: "No movies match the current filters. Try adjusting your criteria.",
      });
    } else {
      toast({
        title: "Filters Applied",
        description: `Showing ${filteredMovies.length} movies.`,
      });
    }
  };

  const handleClearFilters = () => {
    if (selectedMood && showRecommendations && !searchMode) {
      handleGetRecommendations(); // Reload recommendations
    } else {
      loadTrendingMovies(); // Load trending movies
    }
  };

  const resetForm = () => {
    setSelectedMood('');
    setPreferences({ genres: [], language: '', actor: '' });
    setShowRecommendations(false);
    setSearchMode(false);
    setError(null);
    loadTrendingMovies();
  };

  const handleMovieClick = (movie: ProcessedMovie) => {
    toast({
      title: movie.title,
      description: `${movie.genre} • ${movie.year} • Rating: ${movie.rating}`,
    });
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
            {/* Search and Filter */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-elegant">
              <SearchAndFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                onClear={handleClearFilters}
                isLoading={loading}
              />
            </div>

            {/* Trending Movies Preview */}
            {movies.length > 0 && !searchMode && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-center bg-gradient-accent bg-clip-text text-transparent">
                  Trending This Week
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {movies.slice(0, 4).map((movie, index) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      index={index}
                      onClick={() => handleMovieClick(movie)}
                    />
                  ))}
                </div>
              </div>
            )}

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
                  disabled={loading}
                  className="
                    bg-gradient-accent text-accent-foreground px-8 py-6 text-lg font-semibold
                    hover:shadow-glow hover:scale-105 transition-all duration-300
                    animate-glow-pulse disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Finding Perfect Matches...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get My Movie Recommendations
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Recommendations Section */
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                {searchMode ? 'Search Results' : 'Perfect Matches for Your Mood'}
              </h2>
              {!searchMode && (
                <p className="text-foreground/70">
                  Based on your {selectedMood} mood and preferences
                </p>
              )}
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={resetForm}
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/80"
                >
                  Start Over
                </Button>
                {!searchMode && (
                  <Button
                    onClick={() => setShowRecommendations(false)}
                    variant="secondary"
                    className="bg-secondary hover:bg-secondary/80"
                  >
                    Try Different Preferences
                  </Button>
                )}
              </div>
            </div>

            {/* Search and Filter for Results */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-elegant">
              <SearchAndFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                onClear={handleClearFilters}
                isLoading={loading}
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-accent" />
                <p className="text-foreground/70 text-lg">Finding amazing movies for you...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                <p className="text-destructive text-lg mb-4">{error}</p>
                <Button
                  onClick={handleClearFilters}
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/80"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Movies Grid */}
            {!loading && !error && movies.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie, index) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    index={index}
                    onClick={() => handleMovieClick(movie)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;