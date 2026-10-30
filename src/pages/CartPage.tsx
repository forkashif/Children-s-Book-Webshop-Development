import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useCart } from '../context/CartContext.js';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, removeItem, updateQuantity, updateDedication, subtotal, totalCount } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const freeShippingThreshold = 45;
  const amountToFree = Math.max(0, freeShippingThreshold - subtotal);
  const discountAmount = promoApplied ? Number((subtotal * 0.10).toFixed(2)) : 0;
  const finalSubtotal = Number((subtotal - discountAmount).toFixed(2));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'STARLIGHT10' || promoCode.trim().toUpperCase() === 'PRESS10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Coupon code not recognized. Use code "STARLIGHT10" for 10% off.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <BookOpen className="w-12 h-12 mx-auto text-[#17181C]/30" />
        <h1 className="font-display font-medium text-3xl text-[#17181C]">
          Your Storybook Bag is Empty
        </h1>
        <p className="text-sm text-[#17181C]/70 max-w-md mx-auto">
          No physical editions have been selected yet. Explore our picture books and add your opening dedication text before binding.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('/shop')}
            className="px-6 py-3.5 bg-[#C45A2C] hover:bg-[#AD4B22] text-white font-medium text-xs uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-2"
          >
            <span>Explore Titles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-8">
      
      <div className="flex items-center justify-between border-b border-[#E4DFD5] pb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">Shopping Bag</span>
          <h1 className="font-display font-medium text-3xl text-[#17181C]">
            Your Selected Volumes ({totalCount} {totalCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={() => onNavigate('/shop')}
          className="text-xs font-mono uppercase tracking-wider text-[#17181C]/70 hover:text-[#17181C] flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue browsing</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Itemized List */}
        <div className="lg:col-span-8 space-y-4">
          
          {items.map(item => (
            <div
              key={item.variant_id}
              className="bg-white p-5 rounded-sm border border-[#E4DFD5] space-y-4"
            >
              <div className="flex gap-5">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-20 h-28 object-cover rounded-sm border border-[#E4DFD5] shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-medium text-lg text-[#17181C] leading-tight">
                        {item.title}
                      </h3>
                      <div className="text-xs text-[#17181C]/60 mt-1 font-mono">
                        <span>{item.format === 'hardcover' ? 'Casebound Hardcover' : 'Softcover Paperback'}</span>
                        <span className="mx-2">·</span>
                        <span>SKU: {item.sku}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.variant_id)}
                      className="p-1 text-[#17181C]/40 hover:text-[#C45A2C] transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E4DFD5] rounded-sm overflow-hidden bg-[#F7F4EE]">
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                        className="p-2 hover:bg-[#EFECE4] text-[#17181C] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono font-medium text-xs text-[#17181C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        className="p-2 hover:bg-[#EFECE4] text-[#17181C] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-medium text-base text-[#17181C]">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <span className="text-[11px] text-[#17181C]/40 font-mono">
                        €{item.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inscription Note box */}
              <div className="bg-[#F7F4EE] p-3 rounded-sm border border-[#E4DFD5] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#17181C]/70">
                    Typeset Inscription (Opening Leaf):
                  </span>
                  <span className="font-mono text-[10px] text-[#17181C]/40">Page 1</span>
                </div>
                <input
                  type="text"
                  value={item.dedication_text || ''}
                  onChange={(e) => updateDedication(item.variant_id, e.target.value)}
                  placeholder="Enter message to print inside (e.g. 'For Liam on his 4th Birthday — with love from Granny')"
                  className="w-full bg-white border border-[#E4DFD5] rounded-sm p-2 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                />
              </div>
            </div>
          ))}

        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-5">
            <h2 className="font-display font-medium text-lg text-[#17181C]">
              Order Summary
            </h2>

            {/* Free shipping status indicator */}
            <div className="p-3 bg-[#F7F4EE] border border-[#E4DFD5] text-xs space-y-1.5">
              {amountToFree > 0 ? (
                <div>
                  <div className="flex justify-between font-mono text-[11px] text-[#17181C]/70 mb-1">
                    <span>Add €{amountToFree.toFixed(2)} for free shipping</span>
                    <span>€{subtotal.toFixed(2)} / €{freeShippingThreshold}</span>
                  </div>
                  <div className="w-full h-1 bg-[#E4DFD5] overflow-hidden">
                    <div
                      className="h-full bg-[#C45A2C]"
                      style={{ width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="font-mono text-xs font-semibold text-[#C45A2C]">
                  Free tracked standard shipping unlocked
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-2.5 text-xs text-[#17181C]/70">
              <div className="flex justify-between">
                <span>Books subtotal</span>
                <span className="font-mono font-medium text-[#17181C]">€{subtotal.toFixed(2)}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-[#C45A2C] font-mono">
                  <span>Promotion code (10%)</span>
                  <span>-€{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping rate</span>
                <span className="text-[#17181C]/50 font-mono">Quoted at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (Children's books)</span>
                <span className="text-[#17181C]/50 font-mono">Zero-rated</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E4DFD5] flex justify-between items-baseline">
              <span className="font-display font-medium text-base text-[#17181C]">Subtotal</span>
              <span className="font-mono font-medium text-2xl text-[#17181C]">
                €{finalSubtotal.toFixed(2)}
              </span>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Coupon code (STARLIGHT10)"
                  className="flex-1 bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3 py-2 text-xs uppercase font-mono text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#17181C] hover:bg-[#333] text-white font-medium rounded-sm text-xs transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-xs text-[#C45A2C] mt-1">{promoError}</p>}
            </form>

            <button
              onClick={() => onNavigate('/checkout')}
              className="w-full py-3.5 bg-[#C45A2C] hover:bg-[#AD4B22] text-white font-medium text-sm rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center font-mono text-[11px] text-[#17181C]/50 space-y-1">
              <p>Direct lab dispatch · Print files routed automatically</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
