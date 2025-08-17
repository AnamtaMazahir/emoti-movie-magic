import { Star, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  genre: string;
  description: string;
  poster: string;
}

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export const MovieCard = ({ movie, index }: MovieCardProps) => {
  return (
    <Card 
      className="
        group bg-gradient-card border-border/50 overflow-hidden 
        transition-all duration-500 hover:shadow-card hover:scale-105
        animate-scale-in
      "
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-[2/3] overflow-hidden relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium">{movie.rating}</span>
            <Calendar className="w-4 h-4 ml-2" />
            <span>{movie.year}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{movie.duration}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-foreground line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-sm text-accent font-medium">
          {movie.genre}
        </p>
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {movie.description}
        </p>
        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{movie.rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">•</span>
          <span className="text-muted-foreground text-sm">{movie.year}</span>
        </div>
      </CardContent>
    </Card>
  );
};