import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#17181C] text-[#F7F4EE] border-t border-[#2C2E35] mt-24">
      {/* Upper flat strip: Factual print specifications */}
      <div className="border-b border-[#2C2E35] py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[#C45A2C] uppercase tracking-wider block">Format</span>
            <p className="text-[#F7F4EE] font-semibold">Physical Books Only</p>
            <p className="text-[#888D99]">Hardcover case laminate and heavyweight paperbacks.</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[#C45A2C] uppercase tracking-wider block">Paper Stock</span>
            <p className="text-[#F7F4EE] font-semibold">170gsm Silk Paper</p>
            <p className="text-[#888D99]">Sourced from FSC-certified mills. No page show-through.</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[#C45A2C] uppercase tracking-wider block">First Page</span>
            <p className="text-[#F7F4EE] font-semibold">Custom Dedication Leaf</p>
            <p className="text-[#888D99]">Typeset inside the cover before binding at zero extra charge.</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[#C45A2C] uppercase tracking-wider block">Fulfillment</span>
            <p className="text-[#F7F4EE] font-semibold">Automated Print-on-Demand</p>
            <p className="text-[#888D99]">Dispatched from certified facilities in the UK, EU, and US.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
              className="text-2xl font-bold font-display tracking-tight text-[#F7F4EE] block"
            >
              Starlight Press
            </a>
            <p className="text-xs sm:text-sm text-[#888D99] leading-relaxed max-w-sm">
              We publish four original illustrated picture books for young children. We do not maintain a warehouse; each copy is printed when an order is placed and shipped directly in a flat cardboard mailer.
            </p>
            <div className="text-xs text-[#888D99] font-mono pt-1">
              Editorial office: Clontarf, Dublin 3, Ireland
            </div>
          </div>

          {/* Catalog Links */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C45A2C] block font-semibold">
              Books
            </span>
            <ul className="space-y-2 text-xs text-[#888D99]">
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-white transition-colors">
                  All Printed Titles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/book/the-boy-who-caught-a-falling-star')} className="hover:text-white transition-colors">
                  Falling Star (Ages 3–6)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/book/the-secret-forest-of-whispering-owls')} className="hover:text-white transition-colors">
                  Whispering Owls (Ages 5–8)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/book/barnaby-bear-and-the-moonlit-ocean')} className="hover:text-white transition-colors">
                  Barnaby Bear (Ages 2–5)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/book/the-clockwork-dragon-of-clocktower-hill')} className="hover:text-white transition-colors">
                  Clockwork Dragon (Ages 6–10)
                </button>
              </li>
            </ul>
          </div>

          {/* Production & Information */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C45A2C] block font-semibold">
              Press
            </span>
            <ul className="space-y-2 text-xs text-[#888D99]">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  About Our Press
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pod-craft')} className="hover:text-white transition-colors">
                  Print Specifications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/track')} className="hover:text-white transition-colors">
                  Track an Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-white transition-colors">
                  Questions &amp; Answers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shipping-returns')} className="hover:text-white transition-colors">
                  Shipping &amp; Damaged Copies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Email Updates (No fake stats) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C45A2C] block font-semibold">
              New Title Notices
            </span>
            <p className="text-xs text-[#888D99] leading-relaxed">
              We release two new illustrated titles each year. Sign up to receive notice when a new book goes to press.
            </p>
            {subscribed ? (
              <div className="p-3 border border-[#2C2E35] bg-[#1F2127] text-xs text-[#F7F4EE] flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C45A2C] shrink-0" />
                <span>You will receive an email for our next release.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-[#1F2127] border border-[#2C2E35] px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#686C78] focus:outline-none focus:border-[#C45A2C]"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-[#C45A2C] hover:bg-[#AD4B22] text-[#F7F4EE] text-xs font-medium transition-colors shrink-0"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2C2E35] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#686C78]">
          <p>© {new Date().getFullYear()} Starlight Press Ltd. Registered in Dublin, Ireland.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
              Privacy
            </button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
              Terms
            </button>
            <button onClick={() => onNavigate('/admin')} className="text-[#C45A2C] hover:underline font-mono">
              Publisher Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

