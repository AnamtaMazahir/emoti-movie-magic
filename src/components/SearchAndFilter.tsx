import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onClear: () => void;
  isLoading?: boolean;
}

export interface FilterOptions {
  sortBy: 'popularity' | 'rating' | 'year' | 'title';
  minRating: number;
  year?: number;
}

export const SearchAndFilter = ({ onSearch, onFilter, onClear, isLoading }: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'popularity',
    minRating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters({
      sortBy: 'popularity',
      minRating: 0,
    });
    onClear();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border focus:ring-primary"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!searchQuery.trim() || isLoading}
          className="bg-gradient-accent text-accent-foreground hover:shadow-glow"
        >
          Search
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-secondary hover:bg-secondary/80"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Sort By</label>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Min Rating</label>
              <Select 
                value={filters.minRating.toString()} 
                onValueChange={(value) => handleFilterChange('minRating', parseFloat(value))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="5">5.0+</SelectItem>
                  <SelectItem value="6">6.0+</SelectItem>
                  <SelectItem value="7">7.0+</SelectItem>
                  <SelectItem value="8">8.0+</SelectItem>
                  <SelectItem value="9">9.0+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Year</label>
              <Select 
                value={filters.year?.toString() || 'any'} 
                onValueChange={(value) => handleFilterChange('year', value === 'any' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Any Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Year</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Apply Filters Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent">Action</label>
              <Button
                onClick={() => onFilter(filters)}
                className="w-full bg-gradient-accent text-accent-foreground hover:shadow-glow"
                disabled={isLoading}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};