import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, BookOpen, X } from 'lucide-react';
import type { Book } from '../types/store.js';
import { BookCard } from '../components/BookCard.js';

interface ShopPageProps {
  books: Book[];
  onSelectBook: (slug: string) => void;
  initialCategory?: string;
  initialAge?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  books, 
  onSelectBook,
  initialCategory = 'All',
  initialAge = 'All'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedAge, setSelectedAge] = useState<string>(initialAge);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'bestseller' | 'price_asc' | 'price_desc' | 'title'>('bestseller');

  const categories = ['All', 'Bedtime Tales', 'Magical Journeys', 'Animal Adventures', 'Fairy Tales'];
  const ageGroups = ['All', '2–5 years', '3–6 years', '5–8 years', '6–10 years'];

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchDesc = book.description.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchDesc) return false;
        }

        if (selectedCategory !== 'All' && book.category !== selectedCategory) {
          return false;
        }

        if (selectedAge !== 'All' && !book.age_range.includes(selectedAge.replace(' years', ''))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'bestseller') {
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        }
        if (sortBy === 'price_asc') {
          const priceA = a.variants?.[0]?.price || 0;
          const priceB = b.variants?.[0]?.price || 0;
          return priceA - priceB;
        }
        if (sortBy === 'price_desc') {
          const priceA = a.variants?.[0]?.price || 0;
          const priceB = b.variants?.[0]?.price || 0;
          return priceB - priceA;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [books, searchQuery, selectedCategory, selectedAge, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#E4DFD5] pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">
          Starlight Press · Current Library
        </span>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#17181C]">
          Printed Picture Books
        </h1>
        <p className="text-sm text-[#17181C]/70 max-w-2xl">
          Physical volumes bound in Smyth-sewn case laminate or PUR softcover. Every title includes a complimentary dedication page typeset inside upon order.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-sm border border-[#E4DFD5] space-y-5">
        
        {/* Top Search & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#17181C]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, or keyword..."
              className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm pl-10 pr-8 py-2 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#17181C]/40 hover:text-[#17181C]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-[#17181C]/70">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#17181C]/50" />
            <span className="font-mono text-[11px] uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-2.5 py-1.5 text-xs font-medium text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
            >
              <option value="bestseller">Featured Order</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title">Alphabetical (A–Z)</option>
            </select>
          </div>

        </div>

        {/* Filter Rows */}
        <div className="space-y-3 pt-4 border-t border-[#E4DFD5]">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-[11px] uppercase text-[#17181C]/50 mr-2">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-sm transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-[#17181C] text-white border-[#17181C]'
                    : 'bg-[#F7F4EE] text-[#17181C] border-[#E4DFD5] hover:border-[#17181C]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Age Group Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-[11px] uppercase text-[#17181C]/50 mr-2">Age Range:</span>
            {ageGroups.map(age => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-3 py-1 text-xs rounded-sm transition-colors border ${
                  selectedAge === age
                    ? 'bg-[#C45A2C] text-white border-[#C45A2C]'
                    : 'bg-[#F7F4EE] text-[#17181C] border-[#E4DFD5] hover:border-[#17181C]/50'
                }`}
              >
                {age}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-[#17181C]/60 font-mono">
        <span>Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'edition' : 'editions'}</span>
        {(selectedCategory !== 'All' || selectedAge !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedAge('All');
              setSearchQuery('');
            }}
            className="text-[#C45A2C] hover:underline cursor-pointer"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-sm border border-[#E4DFD5] p-8 space-y-3">
          <BookOpen className="w-8 h-8 mx-auto text-[#17181C]/30" />
          <h3 className="font-display font-medium text-lg text-[#17181C]">No books matched the selected criteria</h3>
          <p className="text-xs text-[#17181C]/60 max-w-sm mx-auto">
            Try adjusting your search query or reset the age and category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedAge('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#C45A2C] text-white font-medium rounded-sm text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
            />
          ))}
        </div>
      )}

    </div>
  );
};
