import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search colleges, branches, or companies...", 
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      onSearch(query.trim());
      // Add slight delay for better UX
      setTimeout(() => {
        navigate(`/colleges?search=${encodeURIComponent(query.trim())}`);
        setIsLoading(false);
      }, 300);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSearch(e);
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background with glassmorphism */}
          <div className="absolute inset-0 bg-gradient-card border border-white/10 backdrop-blur-xl"></div>
          
          {/* Search icon */}
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
            <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          </div>
          
          {/* Input field */}
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="relative z-10 pl-16 pr-32 py-6 text-lg bg-transparent border-0 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70 h-16 text-foreground"
          />
          
          {/* Clear button */}
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              disabled={isLoading}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-white/10 transition-colors z-10 rounded-full"
            >
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
          )}
          
          {/* Search button */}
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:opacity-90 disabled:opacity-50 h-10 px-6 text-white font-medium shadow-lg transition-all duration-200 z-10"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
          
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-full h-full rounded-2xl bg-gradient-card"></div>
          </div>
        </div>
      </form>
      
      {/* Search suggestions hint */}
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground/80">
          💡 Try searching for "IIT", "Computer Science", "TCS", or any college name
        </p>
      </div>
    </div>
  );
};

export default SearchBar;