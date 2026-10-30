import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  Mail, 
  Package,
  Loader2
} from 'lucide-react';
import type { Order } from '../types/store.js';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
      })
      .catch(err => console.error('Failed to load order', err))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#C45A2C] mx-auto" />
        <h2 className="font-display font-medium text-lg text-[#17181C]">
          Confirming book order with print lab...
        </h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="font-display font-medium text-2xl text-[#17181C]">Order Reference Not Found</h2>
        <p className="text-xs text-[#17181C]/60">We could not locate an order matching reference {orderId}.</p>
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-[#C45A2C] text-white font-medium rounded-sm text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8">
      
      {/* Confirmation Header */}
      <div className="text-center space-y-3 border-b border-[#E4DFD5] pb-8">
        <div className="w-10 h-10 mx-auto bg-[#17181C] text-white rounded-full flex items-center justify-center">
          <Check className="w-5 h-5" />
        </div>

        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C] block">
          Order Confirmed &amp; Queued for Press
        </span>

        <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#17181C]">
          Thank you, {order.customer_name}.
        </h1>

        <p className="text-sm text-[#17181C]/70 max-w-lg mx-auto">
          Your book files have been verified and dispatched to our regional print lab. A confirmation notice has been sent to <strong>{order.customer_email}</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={() => onNavigate(`/track?order_id=${order.id}&email=${encodeURIComponent(order.customer_email)}`)}
            className="px-5 py-2.5 bg-[#C45A2C] hover:bg-[#AD4B22] text-white font-medium text-xs rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track Order Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            className="px-4 py-2.5 bg-white hover:bg-[#F7F4EE] text-[#17181C] font-medium text-xs rounded-sm border border-[#E4DFD5] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#C45A2C]" />
            <span>View Confirmation Email</span>
          </button>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-sm border border-[#E4DFD5] p-6 sm:p-8 space-y-6">
        
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E4DFD5] text-xs">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Reference</span>
            <span className="font-mono font-medium text-base text-[#17181C]">{order.id}</span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Date Placed</span>
            <span className="font-medium text-[#17181C]">
              {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Fulfillment</span>
            <span className="font-mono text-xs uppercase font-medium text-[#17181C]">
              {order.pod_provider} Certified Lab
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Status</span>
            <span className="font-mono text-xs font-semibold text-[#C45A2C]">
              {order.pod_status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Ordered Books */}
        <div className="space-y-4">
          <h3 className="font-display font-medium text-base text-[#17181C]">
            Books in Production
          </h3>

          <div className="space-y-3">
            {(order.items || []).map(item => (
              <div key={item.id} className="p-4 bg-[#F7F4EE] rounded-sm border border-[#E4DFD5] flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  {item.cover_image && (
                    <img 
                      src={item.cover_image} 
                      alt="" 
                      className="w-14 h-20 object-cover rounded-sm border border-[#E4DFD5] shrink-0" 
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-sm text-[#17181C]">
                      {item.book_title}
                    </h4>
                    <p className="text-xs text-[#17181C]/70 mt-0.5 font-mono">
                      {item.format === 'hardcover' ? 'Casebound Hardcover' : 'Softcover Paperback'} ({item.sku})
                    </p>
                    <p className="text-xs text-[#17181C]/50 font-mono">
                      Quantity: {item.quantity} × €{item.unit_price.toFixed(2)}
                    </p>

                    {item.dedication_text && (
                      <div className="mt-2 p-2 bg-white rounded-sm border border-[#E4DFD5] text-xs text-[#17181C] italic max-w-md">
                        <span className="font-mono not-italic text-[10px] uppercase text-[#17181C]/50 block">
                          Typeset Inscription:
                        </span>
                        "{item.dedication_text}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right font-mono font-medium text-sm text-[#17181C]">
                  €{item.total_price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Financials Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E4DFD5] text-xs">
          
          {/* Shipping Address */}
          <div className="space-y-1 text-[#17181C]/70">
            <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Delivery Address</span>
            <p className="font-medium text-[#17181C]">{order.shipping_address.recipient_name}</p>
            <p>{order.shipping_address.address_line1}</p>
            {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country_code}</p>
            <p className="pt-1 font-mono text-[11px] text-[#17181C]/50">Method: {order.shipping_method}</p>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-[#17181C]/70 md:text-right">
            <div className="flex justify-between md:justify-end md:gap-8">
              <span>Books subtotal:</span>
              <span className="font-mono font-medium text-[#17181C]">€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between md:justify-end md:gap-8">
              <span>Tracked postage:</span>
              <span className="font-mono font-medium text-[#17181C]">€{order.shipping_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between md:justify-end md:gap-8 text-sm font-medium text-[#17181C] pt-2 border-t border-[#E4DFD5]">
              <span>Total paid:</span>
              <span className="font-mono">€{order.total_amount.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Email Preview Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-xl w-full p-6 space-y-4 shadow-xl border border-[#E4DFD5] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E4DFD5]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C45A2C]" />
                <h3 className="font-display font-medium text-sm text-[#17181C]">
                  Transactional Dispatch Notification Preview
                </h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-xs font-mono text-[#17181C]/60 hover:text-[#17181C] cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <div className="font-mono text-xs text-[#17181C]/70 space-y-1">
              <div>To: {order.customer_email}</div>
              <div>Subject: Starlight Press Order {order.id} Confirmed</div>
            </div>

            <div className="p-5 bg-[#F7F4EE] border border-[#E4DFD5] text-xs space-y-3">
              <div className="text-center pb-3 border-b border-[#E4DFD5]">
                <h2 className="font-display font-medium text-lg text-[#17181C]">Starlight Press</h2>
                <span className="font-mono text-[10px] text-[#C45A2C] uppercase tracking-wider">Printed to Order</span>
              </div>
              <div className="space-y-2 text-[#17181C]/80 leading-relaxed">
                <p>Dear {order.customer_name},</p>
                <p>
                  Thank you for your order. Your book has been formatted and queued for press at our regional bindery. The pages are printed on 170gsm heavyweight silk paper and bound according to your chosen edition.
                </p>
                <div className="bg-white p-3 border border-[#E4DFD5] font-mono text-xs space-y-1">
                  <div>Order Reference: {order.id}</div>
                  <div>Total: €{order.total_amount.toFixed(2)}</div>
                  <div>Delivery Method: {order.shipping_method}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
