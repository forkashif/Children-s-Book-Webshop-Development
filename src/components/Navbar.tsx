import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext.js';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { totalCount, subtotal, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Books', path: '/shop' },
    { label: 'Printing & Bindery', path: '/pod-craft' },
    { label: 'Track Order', path: '/track' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE] border-b border-[#E4DFD5]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-4">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
          className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#17181C] hover:text-[#C45A2C] transition-colors whitespace-nowrap shrink-0"
        >
          Starlight Press
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#686C78]">
          {navLinks.map(link => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.path);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#17181C] relative py-1 ${
                  isActive ? 'text-[#17181C] font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#17181C]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openDrawer}
            className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-[#17181C] bg-[#FFFFFF] hover:bg-[#EFECE4] border border-[#E4DFD5] transition-colors whitespace-nowrap"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#C45A2C]" />
            <span>Bag</span>
            <span className="font-mono text-xs tabular-nums text-[#686C78] border-l border-[#E4DFD5] pl-2">
              {totalCount}
            </span>
            {totalCount > 0 && (
              <span className="hidden sm:inline font-mono text-xs tabular-nums text-[#17181C] border-l border-[#E4DFD5] pl-2">
                €{subtotal.toFixed(2)}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#686C78] hover:text-[#17181C] hover:bg-[#EFECE4] transition-colors"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F7F4EE] border-b border-[#E4DFD5] px-6 py-4 space-y-3">
          {navLinks.map(link => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.path);
                setMobileMenuOpen(false);
              }}
              className={`block py-1.5 text-sm font-medium ${
                currentPath === link.path ? 'text-[#C45A2C] font-semibold' : 'text-[#686C78]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#E4DFD5] flex justify-between items-center text-xs text-[#686C78]">
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="text-[#686C78] hover:text-[#17181C]"
            >
              Publisher CMS
            </a>
            <span className="font-mono text-[11px]">Physical Print Only</span>
          </div>
        </div>
      )}
    </header>
  );
};
