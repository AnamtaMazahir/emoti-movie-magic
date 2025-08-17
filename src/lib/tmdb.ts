// TMDb API integration
const TMDB_API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // Public API key for frontend use
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface ProcessedMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  genre: string;
  description: string;
  poster: string;
  backdrop: string;
  popularity: number;
  language: string;
}

// Genre mapping
export const GENRES = {
  28: 'Action',
  12: 'Adventure', 
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Mood to genre mapping
export const MOOD_GENRES = {
  happy: [35, 10751, 16], // Comedy, Family, Animation
  sad: [18, 10749], // Drama, Romance
  adventurous: [28, 12, 14], // Action, Adventure, Fantasy
  thrilled: [53, 27, 80], // Thriller, Horror, Crime
  romantic: [10749, 35, 18], // Romance, Comedy, Drama
  relaxed: [35, 16, 10751], // Comedy, Animation, Family
  thoughtful: [18, 99, 36], // Drama, Documentary, History
  comedy: [35, 16, 10751] // Comedy, Animation, Family
};

class TMDbAPI {
  private async fetchFromTMDb(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }
    
    return response.json();
  }

  private processMovie(movie: TMDbMovie): ProcessedMovie {
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 2024;
    const rating = Math.round(movie.vote_average * 10) / 10;
    const genre = movie.genre_ids.length > 0 ? GENRES[movie.genre_ids[0] as keyof typeof GENRES] || 'Unknown' : 'Unknown';
    const poster = movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '';
    const backdrop = movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : '';
    
    return {
      id: movie.id,
      title: movie.title,
      year,
      rating,
      duration: '1h 30m', // TMDb doesn't provide runtime in discover, would need separate API call
      genre,
      description: movie.overview || 'No description available.',
      poster,
      backdrop,
      popularity: movie.popularity,
      language: movie.original_language
    };
  }

  async getMoviesByMoodAndPreferences(
    mood: string, 
    preferences: { genres: string[]; language: string; actor?: string },
    page: number = 1
  ): Promise<ProcessedMovie[]> {
    try {
      // Get genre IDs from mood and preferences
      const moodGenreIds = MOOD_GENRES[mood as keyof typeof MOOD_GENRES] || [];
      const preferenceGenreIds = preferences.genres.map(genre => {
        return Object.entries(GENRES).find(([id, name]) => name === genre)?.[0];
      }).filter(Boolean).map(Number);

      const allGenreIds = [...new Set([...moodGenreIds, ...preferenceGenreIds])];
      
      const params: Record<string, any> = {
        page,
        sort_by: 'popularity.desc',
        'vote_count.gte': 100,
        include_adult: false
      };

      if (allGenreIds.length > 0) {
        params.with_genres = allGenreIds.join(',');
      }

      if (preferences.language && preferences.language !== 'English') {
        const languageMap: Record<string, string> = {
          'Spanish': 'es',
          'French': 'fr',
          'German': 'de',
          'Italian': 'it',
          'Japanese': 'ja',
          'Korean': 'ko',
          'Mandarin': 'zh',
          'Hindi': 'hi',
          'Portuguese': 'pt',
          'Russian': 'ru',
          'Arabic': 'ar'
        };
        params.with_original_language = languageMap[preferences.language] || 'en';
      }

      const data = await this.fetchFromTMDb('/discover/movie', params);
      return data.results.map((movie: TMDbMovie) => this.processMovie(movie));
    } catch (error) {
      console.error('Error fetching movies by mood:', error);
      return [];
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<ProcessedMovie[]> {
    try {
      const data = await this.fetchFromTMDb('/search/movie', {
        query,
        page,
        include_adult: false
      });
      
      return data.results.map((movie: TMDbMovie) => this.processMovie(movie));
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<ProcessedMovie[]> {
    try {
      const data = await this.fetchFromTMDb(`/trending/movie/${timeWindow}`);
      return data.results.map((movie: TMDbMovie) => this.processMovie(movie));
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  }

  async getPopularMovies(page: number = 1): Promise<ProcessedMovie[]> {
    try {
      const data = await this.fetchFromTMDb('/movie/popular', { page });
      return data.results.map((movie: TMDbMovie) => this.processMovie(movie));
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }
}

export const tmdbAPI = new TMDbAPI();