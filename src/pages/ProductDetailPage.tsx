import React, { useState, useEffect } from 'react';
import { 
  Check, 
  BookOpen, 
  ChevronRight, 
  Plus, 
  Minus,
  Info,
  ArrowRight
} from 'lucide-react';
import type { Book, BookFormat } from '../types/store.js';
import { useCart } from '../context/CartContext.js';
import { BookCard } from '../components/BookCard.js';

interface ProductDetailPageProps {
  book: Book;
  allBooks: Book[];
  onSelectBook: (slug: string) => void;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  book, 
  allBooks, 
  onSelectBook, 
  onNavigate 
}) => {
  const { addItem } = useCart();
  
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>('hardcover');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [dedicationText, setDedicationText] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'specifications' | 'shipping'>('story');

  const gallery = book.gallery_images && book.gallery_images.length > 0 
    ? book.gallery_images 
    : [book.cover_image];

  const activeVariant = book.variants?.find(v => v.format === selectedFormat) || book.variants?.[0];
  const activePrice = activeVariant?.sale_price !== null && activeVariant?.sale_price !== undefined
    ? activeVariant.sale_price
    : (activeVariant?.price || 21.95);
  const regularPrice = activeVariant?.sale_price ? activeVariant.price : null;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [book.slug, selectedFormat]);

  const handleAddToCart = () => {
    if (!activeVariant) return;

    addItem({
      book_id: book.id,
      variant_id: activeVariant.id,
      slug: book.slug,
      title: book.title,
      format: activeVariant.format,
      sku: activeVariant.sku,
      price: activePrice,
      cover_image: book.cover_image,
      pod_product_code: activeVariant.pod_product_code,
      dedication_text: dedicationText.trim() || undefined,
      quantity
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  const relatedBooks = allBooks.filter(b => b.id !== book.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#17181C]/50">
        <button onClick={() => onNavigate('/')} className="hover:text-[#17181C] uppercase">Home</button>
        <ChevronRight className="w-3 h-3 text-[#17181C]/30" />
        <button onClick={() => onNavigate('/shop')} className="hover:text-[#17181C] uppercase">Catalog</button>
        <ChevronRight className="w-3 h-3 text-[#17181C]/30" />
        <span className="text-[#17181C] font-sans font-medium truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Image Gallery with 3:4 Book Ratio */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Visual Display */}
          <div className="relative aspect-[3/4] bg-white border border-[#E4DFD5] shadow-sm rounded-sm overflow-hidden flex items-center justify-center p-6">
            <img 
              src={gallery[activeImageIndex] || book.cover_image} 
              alt={`${book.title} view ${activeImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            {activeImageIndex === 0 && (
              <div className="absolute inset-y-0 left-0 w-3 bg-black/15 pointer-events-none" />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-24 rounded-sm overflow-hidden border transition-all shrink-0 bg-white p-1 cursor-pointer ${
                  activeImageIndex === idx 
                    ? 'border-[#17181C] ring-1 ring-[#17181C]' 
                    : 'border-[#E4DFD5] opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute bottom-0 inset-x-0 bg-[#17181C]/80 text-[#F7F4EE] text-[9px] text-center font-mono py-0.5">
                  {idx === 0 ? 'Cover' : idx === 1 ? 'Spread' : 'Dedication'}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-[#EFECE4] border border-[#E4DFD5] text-xs text-[#17181C]/70 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#C45A2C] shrink-0 mt-0.5" />
            <span>
              Real photos placeholder: Preview shows true 170gsm interior spread layout and page 1 dedication typesetting.
            </span>
          </div>

        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Metadata & Title */}
          <div className="space-y-2 border-b border-[#E4DFD5] pb-5">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#17181C]/60">
              <span>{book.category}</span>
              <span>·</span>
              <span>Ages {book.age_range}</span>
              <span>·</span>
              <span className="text-[#C45A2C] font-semibold">Print-on-Demand Ready</span>
            </div>

            <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#17181C] leading-tight">
              {book.title}
            </h1>

            {book.subtitle && (
              <p className="text-sm text-[#17181C]/70">
                {book.subtitle}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-[#17181C]/70 pt-1">
              <span>Text by <strong>{book.author}</strong></span>
              <span>·</span>
              <span>Illustrated by <strong>{book.illustrator}</strong></span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-medium text-3xl text-[#17181C]">
                  €{activePrice.toFixed(2)}
                </span>
                {regularPrice && (
                  <span className="font-mono text-sm text-[#17181C]/40 line-through">
                    €{regularPrice.toFixed(2)}
                  </span>
                )}
                {regularPrice && (
                  <span className="text-[11px] font-mono uppercase text-[#C45A2C]">
                    Save €{(regularPrice - activePrice).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#17181C]/60">
                Printed to order. Standard and tracked express rates calculated at checkout.
              </p>
            </div>

            <span className="font-mono text-xs text-[#17181C]/40">
              SKU: {activeVariant?.sku}
            </span>
          </div>

          {/* Format Selector: Hardcover vs Paperback */}
          <div className="space-y-2">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-[#17181C]/60">
              Select Binding Format:
            </span>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Hardcover Card */}
              <button
                type="button"
                onClick={() => setSelectedFormat('hardcover')}
                className={`p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedFormat === 'hardcover'
                    ? 'border-[#17181C] bg-white ring-1 ring-[#17181C]'
                    : 'border-[#E4DFD5] bg-[#F7F4EE] hover:border-[#17181C]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-medium text-sm text-[#17181C]">
                    Casebound Hardcover
                  </span>
                  <span className="font-mono text-xs font-medium text-[#17181C]">
                    €{(book.variants?.find(v => v.format === 'hardcover')?.sale_price || book.variants?.find(v => v.format === 'hardcover')?.price || 21.95).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#17181C]/60 mt-1.5 leading-relaxed">
                  Rigid 3mm laminated case board with sewn book block. Built for enduring bedtime reading.
                </p>
              </button>

              {/* Paperback Card */}
              <button
                type="button"
                onClick={() => setSelectedFormat('paperback')}
                className={`p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedFormat === 'paperback'
                    ? 'border-[#17181C] bg-white ring-1 ring-[#17181C]'
                    : 'border-[#E4DFD5] bg-[#F7F4EE] hover:border-[#17181C]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-medium text-sm text-[#17181C]">
                    Softcover Paperback
                  </span>
                  <span className="font-mono text-xs font-medium text-[#17181C]">
                    €{(book.variants?.find(v => v.format === 'paperback')?.sale_price || book.variants?.find(v => v.format === 'paperback')?.price || 14.95).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#17181C]/60 mt-1.5 leading-relaxed">
                  Flexible satin laminate card cover with PUR adhesive binding. Lightweight for daily handling.
                </p>
              </button>

            </div>
          </div>

          {/* Personalised Dedication Leaf Input */}
          <div className="p-4 bg-white rounded-sm border border-[#E4DFD5] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#17181C]">
                Printed Dedication Inscription (Complimentary):
              </label>
              <span className="text-[11px] font-mono text-[#17181C]/40">
                {dedicationText.length}/150
              </span>
            </div>

            <textarea
              value={dedicationText}
              onChange={(e) => setDedicationText(e.target.value.slice(0, 150))}
              placeholder="e.g. For Eleanor on your fourth birthday — always remember how brave you are. Love, Mom &amp; Dad"
              rows={2}
              className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm p-3 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
            />

            <div className="text-[11px] text-[#17181C]/60 leading-tight">
              Your words will be typeset on the opening right-hand page inside the front cover before binding.
            </div>

            {/* Live Typesetting Preview */}
            {dedicationText.trim() && (
              <div className="mt-2 p-3.5 bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm text-center space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#17181C]/50 block">
                  Page 1 Typesetting Preview
                </span>
                <p className="font-display italic text-xs text-[#17181C]">
                  "{dedicationText.trim()}"
                </p>
              </div>
            )}
          </div>

          {/* Quantity Stepper & Add to Bag */}
          <div className="flex items-center gap-3">
            
            {/* Stepper */}
            <div className="flex items-center border border-[#E4DFD5] rounded-sm overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-[#F7F4EE] text-[#17181C] transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 font-mono font-medium text-xs text-[#17181C]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-[#F7F4EE] text-[#17181C] transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-sm font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                justAdded
                  ? 'bg-[#17181C] text-white'
                  : 'bg-[#C45A2C] hover:bg-[#AD4B22] text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Storybook Bag</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Add to Bag · €{(activePrice * quantity).toFixed(2)}</span>
                </>
              )}
            </button>

          </div>

          {/* Factual Dispatch Indicator */}
          <div className="pt-2 border-t border-[#E4DFD5] flex items-center justify-between text-xs text-[#17181C]/60 font-mono">
            <span>Production: 24–48 hours</span>
            <span>Worldwide Tracked Delivery</span>
          </div>

        </div>

      </div>

      {/* Technical Specifications & Synopses */}
      <div className="bg-white rounded-sm border border-[#E4DFD5] p-6 sm:p-8 space-y-6">
        
        {/* Tab Headers */}
        <div className="flex border-b border-[#E4DFD5] gap-8 text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('story')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'story' ? 'text-[#17181C] font-semibold' : 'text-[#17181C]/50 hover:text-[#17181C]'
            }`}
          >
            Story Synopsis
            {activeTab === 'story' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C45A2C]" />}
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'specifications' ? 'text-[#17181C] font-semibold' : 'text-[#17181C]/50 hover:text-[#17181C]'
            }`}
          >
            Print Specifications
            {activeTab === 'specifications' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C45A2C]" />}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'shipping' ? 'text-[#17181C] font-semibold' : 'text-[#17181C]/50 hover:text-[#17181C]'
            }`}
          >
            Transit Times
            {activeTab === 'shipping' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C45A2C]" />}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'story' && (
          <div className="space-y-4 max-w-3xl text-sm text-[#17181C]/80 leading-relaxed">
            <p>{book.description}</p>
            {book.excerpt && (
              <div className="p-4 bg-[#F7F4EE] border-l-2 border-[#C45A2C] italic text-[#17181C]">
                "{book.excerpt}"
              </div>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs text-[#17181C]/80">
            <div className="flex justify-between py-2 border-b border-[#E4DFD5]">
              <span className="font-mono uppercase text-[#17181C]/50">Trim Dimensions</span>
              <span className="font-medium text-[#17181C]">{book.trim_size}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4DFD5]">
              <span className="font-mono uppercase text-[#17181C]/50">Page Count</span>
              <span className="font-medium text-[#17181C]">{book.page_count} pages (full colour)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4DFD5]">
              <span className="font-mono uppercase text-[#17181C]/50">Interior Paper</span>
              <span className="font-medium text-[#17181C]">170gsm Heavyweight Silk (FSC Certified)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4DFD5]">
              <span className="font-mono uppercase text-[#17181C]/50">Cover Treatment</span>
              <span className="font-medium text-[#17181C]">{book.cover_finish}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4DFD5]">
              <span className="font-mono uppercase text-[#17181C]/50">Print Method</span>
              <span className="font-medium text-[#17181C]">High-definition 300DPI Digital Press</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4DFD5]">
              <span className="font-mono uppercase text-[#17181C]/50">Inks</span>
              <span className="font-medium text-[#17181C]">Non-toxic child-safe archival pigment</span>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-3 text-xs text-[#17181C]/80 leading-relaxed max-w-3xl">
            <p>
              Each book is printed and bound on demand. Production is scheduled within <strong>24 to 48 business hours</strong> at certified regional facilities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#F7F4EE] border border-[#E4DFD5] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Ireland &amp; United Kingdom</span>
                <p className="font-medium text-[#17181C]">2–4 business days delivery (An Post / Royal Mail)</p>
              </div>
              <div className="p-3 bg-[#F7F4EE] border border-[#E4DFD5] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">European Union</span>
                <p className="font-medium text-[#17181C]">3–6 business days delivery (DHL Express / Local Post)</p>
              </div>
              <div className="p-3 bg-[#F7F4EE] border border-[#E4DFD5] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">United States &amp; Canada</span>
                <p className="font-medium text-[#17181C]">4–7 business days delivery (USPS / FedEx)</p>
              </div>
              <div className="p-3 bg-[#F7F4EE] border border-[#E4DFD5] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Australia &amp; International</span>
                <p className="font-medium text-[#17181C]">5–10 business days delivery</p>
              </div>
            </div>
            <p className="font-mono text-[11px] text-[#C45A2C] pt-1">
              Complimentary standard tracked shipping applies on orders of €45 or more.
            </p>
          </div>
        )}

      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#E4DFD5]">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium text-2xl text-[#17181C]">
              Other Titles in Print
            </h3>
            <button
              onClick={() => onNavigate('/shop')}
              className="text-xs font-mono uppercase tracking-wider text-[#C45A2C] hover:underline"
            >
              View catalog
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedBooks.map(rb => (
              <BookCard 
                key={rb.id} 
                book={rb} 
                onSelect={onSelectBook} 
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
