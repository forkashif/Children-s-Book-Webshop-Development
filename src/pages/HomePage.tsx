import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Heart, ShieldCheck, Printer, Truck, Star } from 'lucide-react';
import type { Book } from '../types/store.js';
import { BookCard } from '../components/BookCard.js';
import { StarDivider, LittleStarsRow } from '../components/StarDivider.js';
import { bookCovers } from '../server/sampleCovers.js';

interface HomePageProps {
  books: Book[];
  onNavigate: (path: string) => void;
  onSelectBook: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ books, onNavigate, onSelectBook }) => {
  const featuredBooks = books.filter(b => b.featured).slice(0, 3);
  const bestsellers = books.filter(b => b.bestseller).slice(0, 4);

  return (
    <div className="space-y-16 md:space-y-24">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="pt-8 md:pt-14 pb-16 md:pb-24 border-b border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Left-aligned Editorial Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Quiet Unboxed Kicker */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D97706]">
                <span>Physical Printed Books</span>
                <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                <span>FSC-Certified Archival Paper</span>
                <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                <span>Zero Digital Screens</span>
              </div>

              {/* High-Contrast Editorial Display Headline */}
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#1E2538] tracking-tight leading-[1.08] max-w-xl text-balance">
                Enchanting bedtime stories crafted to be held &amp; cherished.
              </h1>

              {/* Refined Body Narrative */}
              <p className="text-base sm:text-lg text-[#525F7A] leading-relaxed max-w-lg">
                Real physical picture books printed individually on demand with non-toxic archival inks. Personalize your copy with a custom dedication typeset directly into the opening leaf at zero extra charge.
              </p>

              {/* Left-Aligned Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onNavigate('/shop')}
                  className="px-8 py-4 bg-[#1E2538] hover:bg-[#2D3A58] text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <span>Explore Printed Books</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
                <button
                  onClick={() => onNavigate('/pod-craft')}
                  className="px-6 py-4 bg-white hover:bg-[#FAF7F2] text-[#1E2538] font-bold text-sm rounded-2xl border border-[#E8E0D2] shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>How Our POD Craft Works</span>
                </button>
              </div>

              {/* Clean Editorial Metadata Strip (Unboxed) */}
              <div className="pt-6 border-t border-[#E8E0D2] flex flex-wrap items-center gap-6 text-xs text-[#525F7A]">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#1E2538] shrink-0" />
                  <span>24–48h Direct Lab Print</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#1E2538] shrink-0" />
                  <span>Typeset Dedication Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1E2538] shrink-0" />
                  <span>Tracked Worldwide Dispatch</span>
                </div>
              </div>

            </div>

            {/* Right Column: Non-Centered Overlapping Book Cover Composition */}
            <div className="lg:col-span-5 relative pl-4 sm:pl-8 lg:pl-0 pt-6 sm:pt-10">
              
              {/* Asymmetrical Composition Container */}
              <div className="relative max-w-md mx-auto lg:mr-0 lg:ml-auto">
                
                {/* 1. Underlying Secondary Spread (Interior Illustrated Story Spread) */}
                <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-10 w-4/5 rounded-2xl overflow-hidden border border-[#E8E0D2] bg-[#FAF6EE] shadow-md z-10 hidden sm:block">
                  <div className="p-2 bg-white/80 border-b border-[#E8E0D2] text-[10px] font-mono text-[#8896AB] flex items-center justify-between">
                    <span>INTERIOR COLOR SPREAD</span>
                    <span>170gsm SILK</span>
                  </div>
                  <img
                    src={bookCovers.insideSpreadPage1}
                    alt="Inside storybook spread"
                    className="w-full h-auto object-cover opacity-95"
                  />
                </div>

                {/* 2. Primary Focal Anchor: Hardcover Book Cover with Spine Elevation */}
                <div className="relative z-20 bg-white p-3.5 sm:p-4 rounded-3xl border border-[#E8E0D2] shadow-xl ml-auto w-11/12 sm:w-full">
                  <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#1B1E3F] border border-[#EAE0D0]">
                    <img
                      src={bookCovers.fallingStar}
                      alt="The Boy Who Caught a Falling Star"
                      className="w-full h-full object-cover"
                    />
                    {/* Realistic tactile hardcover spine highlight */}
                    <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/30 via-white/20 to-transparent pointer-events-none" />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs px-1">
                    <div>
                      <span className="font-display font-bold text-[#1E2538] block text-sm">
                        The Boy Who Caught a Falling Star
                      </span>
                      <span className="text-[11px] text-[#525F7A]">
                        Deluxe Hardcover · 8.5 × 8.5 in
                      </span>
                    </div>
                    <span className="font-mono font-bold text-base text-[#1E2538]">
                      €21.95
                    </span>
                  </div>
                </div>

                {/* 3. Overlapping Dedication Leaf Note (Asymmetrical lower offset) */}
                <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-6 z-30 max-w-[260px] sm:max-w-[290px] bg-[#FFFDF8] p-3.5 rounded-2xl border border-[#E8E0D2] shadow-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#B45309]">
                    <span>Bespoke Opening Leaf</span>
                    <span className="text-[#8896AB] font-mono">Page 1</span>
                  </div>
                  <p className="font-display italic text-[#1E2538] text-[12px] leading-snug">
                    "For our brave little Leo — may your dreams always shine bright. Love Mum &amp; Dad xx"
                  </p>
                  <div className="text-[10px] text-[#8896AB] pt-0.5">
                    Professionally typeset into the physical binding
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <LittleStarsRow />
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2538]">
            Treasured Bedtime Picture Books
          </h2>
          <p className="text-sm sm:text-base text-[#525F7A]">
            Every title is lovingly penned, gorgeously illustrated, and printed exclusively in physical hardcover and paperback editions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onSelect={onSelectBook} 
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#1E2538] font-display font-bold text-sm rounded-2xl border border-[#E8E0D2] shadow-xs transition-colors"
          >
            <span>View Full Book Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#D97706]" />
          </button>
        </div>
      </section>

      {/* 3. PRINT-ON-DEMAND REVOLUTION & SUSTAINABILITY */}
      <section className="bg-white border-y border-[#E8E0D2] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Inside Page Quality Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-[#E8E0D2] shadow-md bg-[#FAF7F2]">
                <img 
                  src={bookCovers.insideSpreadPage1} 
                  alt="Inside story spread preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#525F7A] px-2">
                <span>✦ Heavyweight 170gsm Silk Paper</span>
                <span>✦ Archival Non-Toxic Soy Inks</span>
                <span>✦ Smyth-Sewn Durable Binding</span>
              </div>
            </div>

            {/* Right: The Brand Story & POD Mission */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                Our Sustainable Craft
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2538] leading-tight">
                Printed the moment you order. Zero warehouse waste.
              </h2>
              <p className="text-sm sm:text-base text-[#525F7A] leading-relaxed">
                Traditional publishing destroys millions of unsold books every year. At <strong>Starlight Tales</strong>, we partnered with premier printmakers including <strong>Prodigi</strong> to fulfill books on-demand near you.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-[#1E2538]">Instant Automated Lab Dispatch</h4>
                    <p className="text-xs text-[#525F7A] mt-0.5">As soon as your order is confirmed, our automated engine transmits high-resolution 300DPI print files directly to the nearest certified print laboratory.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-[#1E2538]">Typeset Personal Dedications</h4>
                    <p className="text-xs text-[#525F7A] mt-0.5">Your bespoke message for your child or grandchild is permanently typeset on the opening leaf before the book is bound.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-[#1E2538]">Tracked Priority Shipping</h4>
                    <p className="text-xs text-[#525F7A] mt-0.5">Wrapped in protective recycled cardboard packaging and tracked in real-time from the press right to your doorstep.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/pod-craft')}
                  className="text-sm font-bold text-[#D97706] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Learn more about our print specifications</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. REAL REVIEWS FROM PARENTS & EDUCATORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="flex items-center justify-center gap-1 text-[#F59E0B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#F59E0B]" />
            ))}
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2538]">
            Cherished by Families Across the Globe
          </h2>
          <p className="text-xs sm:text-sm text-[#525F7A]">
            Over 25,000 bedtime stories read aloud. Here is what parents say about the print quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#F59E0B] text-xs">
              ★★★★★
            </div>
            <p className="text-sm text-[#334155] italic leading-relaxed">
              "The hardcover binding blew me away. The pages are so thick and silky that little toddler fingers don't easily tear them. The printed dedication to Liam brought tears to his eyes."
            </p>
            <div className="pt-2 border-t border-[#F1ECE1] flex items-center justify-between text-xs">
              <span className="font-bold text-[#1E2538]">Claire N.</span>
              <span className="text-[#8896AB]">Dublin, Ireland</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#F59E0B] text-xs">
              ★★★★★
            </div>
            <p className="text-sm text-[#334155] italic leading-relaxed">
              "We ordered 'The Secret Forest of Whispering Owls' for our classroom reading corner. The colors are so rich and vibrant. Knowing it was printed on-demand with zero waste makes it even better."
            </p>
            <div className="pt-2 border-t border-[#F1ECE1] flex items-center justify-between text-xs">
              <span className="font-bold text-[#1E2538]">David M., Primary Teacher</span>
              <span className="text-[#8896AB]">Edinburgh, UK</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#F59E0B] text-xs">
              ★★★★★
            </div>
            <p className="text-sm text-[#334155] italic leading-relaxed">
              "Shipping was fast and tracked all the way from the UK print lab to Boston. The packaging protected the corners perfectly. Barnaby Bear is our son's new nightly favorite!"
            </p>
            <div className="pt-2 border-t border-[#F1ECE1] flex items-center justify-between text-xs">
              <span className="font-bold text-[#1E2538]">Rebecca &amp; Tom</span>
              <span className="text-[#8896AB]">Boston, USA</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
