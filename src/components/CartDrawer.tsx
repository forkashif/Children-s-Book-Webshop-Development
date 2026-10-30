import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, BookOpen } from 'lucide-react';
import { useCart } from '../context/CartContext.js';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    updateDedication, 
    subtotal, 
    totalCount, 
    isDrawerOpen, 
    closeDrawer 
  } = useCart();

  const [editingDedicationId, setEditingDedicationId] = useState<string | null>(null);
  const [dedicationDraft, setDedicationDraft] = useState('');

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 45;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleStartEditDedication = (variantId: string, currentText?: string) => {
    setEditingDedicationId(variantId);
    setDedicationDraft(currentText || '');
  };

  const handleSaveDedication = (variantId: string) => {
    updateDedication(variantId, dedicationDraft);
    setEditingDedicationId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Flat backdrop (no heavy blur) */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F4EE] flex flex-col border-l border-[#E4DFD5]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#E4DFD5] flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-[#17181C]">
              Shopping Bag ({totalCount})
            </h2>
            <button 
              onClick={closeDrawer}
              className="p-1.5 text-[#686C78] hover:text-[#17181C] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping notice bar */}
          <div className="px-5 py-2.5 bg-[#EFECE4] border-b border-[#E4DFD5] text-xs text-[#17181C]">
            {amountToFreeShipping > 0 ? (
              <span className="font-medium">
                Add €{amountToFreeShipping.toFixed(2)} more for free tracked shipping.
              </span>
            ) : (
              <span className="font-medium text-[#266847]">
                Free tracked shipping unlocked for this order.
              </span>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="font-display font-semibold text-base text-[#17181C]">
                  Your bag is empty
                </p>
                <p className="text-xs text-[#686C78] max-w-xs mx-auto">
                  Browse our catalog to select a physical hardcover or paperback book.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    onNavigate('/shop');
                  }}
                  className="px-4 py-2 bg-[#17181C] text-[#F7F4EE] text-xs font-medium hover:bg-[#2C2E35] transition-colors inline-block mt-2"
                >
                  Browse Books
                </button>
              </div>
            ) : (
              items.map(item => (
                <div 
                  key={item.variant_id}
                  className="bg-white p-4 border border-[#E4DFD5] space-y-3"
                >
                  <div className="flex gap-3">
                    <img 
                      src={item.cover_image} 
                      alt={item.title} 
                      className="w-16 h-22 object-cover border border-[#E4DFD5] shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-display font-semibold text-sm text-[#17181C] truncate pr-2">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="text-[#686C78] hover:text-[#B83232] p-1 transition-colors"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-[#686C78] mt-0.5">
                        <span className="font-medium text-[#17181C]">
                          {item.format === 'hardcover' ? 'Hardcover Case' : 'Paperback'}
                        </span>
                        <span className="mx-1">·</span>
                        <span className="font-mono text-[11px] text-[#686C78]">{item.sku}</span>
                      </div>

                      <div className="text-xs font-mono font-semibold text-[#17181C] mt-1">
                        €{item.price.toFixed(2)}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E4DFD5]">
                        <div className="flex items-center border border-[#E4DFD5] bg-[#F7F4EE]">
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                            className="p-1 hover:bg-[#EFECE4] text-[#17181C] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-mono tabular-nums font-semibold text-[#17181C]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                            className="p-1 hover:bg-[#EFECE4] text-[#17181C] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-sm tabular-nums text-[#17181C]">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dedication leaf block */}
                  <div className="bg-[#F7F4EE] p-2.5 border border-[#E4DFD5] text-xs">
                    {editingDedicationId === item.variant_id ? (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-[#17181C]">
                          Printed Dedication (Inside Page 1):
                        </label>
                        <textarea
                          value={dedicationDraft}
                          onChange={(e) => setDedicationDraft(e.target.value)}
                          placeholder="e.g. For our darling Sophie on her 4th birthday..."
                          rows={2}
                          maxLength={150}
                          className="w-full bg-white border border-[#E4DFD5] p-2 text-xs text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDedicationId(null)}
                            className="px-2.5 py-1 text-[#686C78] hover:text-[#17181C]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveDedication(item.variant_id)}
                            className="px-3 py-1 bg-[#17181C] text-[#F7F4EE] font-medium"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-[#686C78] text-[11px] leading-tight">
                          {item.dedication_text ? (
                            <span className="italic text-[#17181C]">
                              "{item.dedication_text}"
                            </span>
                          ) : (
                            <span>No dedication message added.</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleStartEditDedication(item.variant_id, item.dedication_text)}
                          className="text-[#C45A2C] hover:underline font-medium text-[11px] shrink-0"
                        >
                          {item.dedication_text ? 'Edit' : '+ Add Dedication'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#E4DFD5] space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#686C78]">Subtotal</span>
                <span className="font-mono font-bold text-lg tabular-nums text-[#17181C]">
                  €{subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#686C78]">
                Tracked shipping calculated at checkout based on destination country.
              </p>

              <button
                onClick={() => {
                  closeDrawer();
                  onNavigate('/checkout');
                }}
                className="w-full py-3 bg-[#C45A2C] hover:bg-[#AD4B22] text-[#F7F4EE] font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  closeDrawer();
                  onNavigate('/cart');
                }}
                className="w-full text-center text-xs text-[#686C78] hover:text-[#17181C] transition-colors py-1"
              >
                View Full Bag Details
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
