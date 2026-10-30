import React from 'react';
import { bookCovers } from '../server/sampleCovers.js';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-16">
      
      {/* Header */}
      <div className="space-y-4 max-w-2xl border-b border-[#E4DFD5] pb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">
          About Starlight Press
        </span>
        <h1 className="font-display font-medium text-4xl sm:text-5xl text-[#17181C] leading-[1.12]">
          Physical books for bedtime reading, bound to last.
        </h1>
        <p className="text-base text-[#17181C]/75 leading-relaxed">
          We are a children's book publisher based in Dublin, Ireland. We print exclusively on heavy paper, one copy at a time, with zero electronic downloads.
        </p>
      </div>

      {/* Story Narrative: Split Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-6 space-y-4 text-sm text-[#17181C]/80 leading-relaxed">
          <h2 className="font-display font-medium text-2xl text-[#17181C]">
            Why We Print on Demand
          </h2>
          <p>
            Traditional trade publishing relies on large offset print runs followed by speculative warehouse storage. When books remain unsold, publishers quietly pulp up to 30% of their stock.
          </p>
          <p>
            At Starlight Press, we reject overproduction. Every book in our catalog is typeset and bound after you order it. This eliminates warehouse destruction entirely, while allowing us to typeset a custom dedication message onto the first page of every copy.
          </p>
          <p>
            Children remember the physical ritual of books: the grain of the cover cloth, the weight of the paper, and their name printed inside.
          </p>
        </div>

        <div className="md:col-span-6">
          <div className="bg-white border border-[#E4DFD5] p-3 rounded-sm shadow-sm">
            <div className="aspect-[4/3] bg-[#F7F4EE] overflow-hidden border border-[#E4DFD5]">
              <img 
                src={bookCovers.insideSpreadPage1} 
                alt="Physical book interior layout on 170gsm silk stock" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-[#17181C]/50 px-1">
              <span>Binding Workshop Preview</span>
              <span>170gsm FSC Silk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Craft Principles (3 items, flat paper cards with hairline borders) */}
      <div className="border-t border-[#E4DFD5] pt-12 space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">Standards</span>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-[#17181C] mt-1">
            Our Publishing Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#E4DFD5] rounded-sm space-y-2.5">
            <span className="font-mono text-xs text-[#C45A2C] font-semibold">01</span>
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Zero Speculative Inventory
            </h3>
            <p className="text-xs text-[#17181C]/70 leading-relaxed">
              We never run bulk print batches that risk pulping. Digital prepress routes each purchase to the closest accredited bindery.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E4DFD5] rounded-sm space-y-2.5">
            <span className="font-mono text-xs text-[#C45A2C] font-semibold">02</span>
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Heavier Stock than Trade Norms
            </h3>
            <p className="text-xs text-[#17181C]/70 leading-relaxed">
              Standard children's trade paperbacks use 115gsm to 130gsm paper. We specify 170gsm silk paper to prevent tearouts and ink transparency.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E4DFD5] rounded-sm space-y-2.5">
            <span className="font-mono text-xs text-[#C45A2C] font-semibold">03</span>
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Typeset Inscriptions
            </h3>
            <p className="text-xs text-[#17181C]/70 leading-relaxed">
              Every dedication is printed into the book block on page 1 before case binding, creating an enduring keepsake for the family.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onNavigate('/shop')}
            className="px-6 py-3.5 bg-[#C45A2C] hover:bg-[#AD4B22] text-white font-medium text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
          >
            Browse the Current Catalog
          </button>
        </div>
      </div>

    </div>
  );
};
