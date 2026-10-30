import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { Book, BookFormat } from '../types/store.js';
import { useCart } from '../context/CartContext.js';

interface BookCardProps {
  book: Book;
  onSelect: (slug: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  const { addItem } = useCart();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>('hardcover');
  const [justAdded, setJustAdded] = useState(false);

  const variant = book.variants?.find(v => v.format === selectedFormat) || book.variants?.[0];
  const activePrice = variant?.sale_price !== null && variant?.sale_price !== undefined 
    ? variant.sale_price 
    : (variant?.price || 19.95);
  const originalPrice = variant?.sale_price ? variant.price : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!variant) return;

    addItem({
      book_id: book.id,
      variant_id: variant.id,
      slug: book.slug,
      title: book.title,
      format: variant.format,
      sku: variant.sku,
      price: activePrice,
      cover_image: book.cover_image,
      pod_product_code: variant.pod_product_code,
      quantity: 1
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article 
      onClick={() => onSelect(book.slug)}
      className="group bg-[#FFFFFF] border border-[#E4DFD5] p-5 cursor-pointer flex flex-col justify-between transition-colors hover:border-[#17181C]"
    >
      <div>
        {/* Book Cover Container (Realistic 3:4 aspect ratio with clearly marked frame) */}
        <div className="relative aspect-3/4 overflow-hidden bg-[#EFECE4] border border-[#E4DFD5] mb-4">
          <img 
            src={book.cover_image} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />

          {/* Clean text badge (no rounded pills or emojis) */}
          <div className="absolute top-2 left-2 bg-[#17181C] text-[#F7F4EE] text-[10px] font-mono uppercase px-2 py-0.5 tracking-wider">
            {selectedFormat === 'hardcover' ? 'Hardcover' : 'Paperback'}
          </div>

          {book.bestseller && (
            <div className="absolute top-2 right-2 bg-[#FFFFFF] text-[#C45A2C] border border-[#E4DFD5] text-[10px] font-mono uppercase px-2 py-0.5 tracking-wider font-semibold">
              Selected Edition
            </div>
          )}
        </div>

        {/* Clean unboxed metadata with dot separators */}
        <div className="text-xs text-[#686C78] tracking-tight mb-1 flex items-center gap-1.5 font-medium">
          <span>{book.category}</span>
          <span aria-hidden="true">·</span>
          <span>Ages {book.age_range}</span>
          <span aria-hidden="true">·</span>
          <span>{book.page_count} pp</span>
        </div>

        {/* Primary Title with tight tracking and clear hierarchy */}
        <h3 className="font-display font-semibold text-lg text-[#17181C] leading-snug tracking-tight group-hover:text-[#C45A2C] transition-colors">
          {book.title}
        </h3>

        {/* Author / Illustrator */}
        <p className="text-xs text-[#686C78] mt-1">
          {book.author} / Illustrated by {book.illustrator}
        </p>

        {/* Format Selector: Flat segmented toggle */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="mt-4 flex border border-[#E4DFD5] p-0.5 text-xs bg-[#F7F4EE]"
        >
          <button
            type="button"
            onClick={() => setSelectedFormat('hardcover')}
            className={`flex-1 py-1 px-2 text-center transition-colors font-medium ${
              selectedFormat === 'hardcover'
                ? 'bg-[#FFFFFF] text-[#17181C] shadow-xs font-semibold'
                : 'text-[#686C78] hover:text-[#17181C]'
            }`}
          >
            Hardcover
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat('paperback')}
            className={`flex-1 py-1 px-2 text-center transition-colors font-medium ${
              selectedFormat === 'paperback'
                ? 'bg-[#FFFFFF] text-[#17181C] shadow-xs font-semibold'
                : 'text-[#686C78] hover:text-[#17181C]'
            }`}
          >
            Paperback
          </button>
        </div>
      </div>

      {/* Footer / Price & Add Button */}
      <div className="mt-5 pt-4 border-t border-[#E4DFD5] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-base tabular-nums text-[#17181C]">
              €{activePrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="font-mono text-xs tabular-nums text-[#686C78] line-through">
                €{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#686C78]">
            {book.trim_size}
          </span>
        </div>

        <button
          onClick={handleQuickAdd}
          className={`px-3 py-1.5 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            justAdded
              ? 'bg-[#17181C] text-[#F7F4EE] border-[#17181C]'
              : 'bg-transparent text-[#17181C] border-[#17181C] hover:bg-[#17181C] hover:text-[#F7F4EE]'
          }`}
          aria-label={`Add ${book.title} to bag`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <span>Add to Bag</span>
          )}
        </button>
      </div>
    </article>
  );
};

