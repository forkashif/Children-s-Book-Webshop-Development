import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  ExternalLink, 
  AlertCircle,
  Clock,
  Check
} from 'lucide-react';
import type { Order } from '../types/store.js';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  initialEmail?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId = '',
  initialEmail = ''
}) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState(initialEmail);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (searchId: string, searchEmail: string) => {
    if (!searchId || !searchEmail) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/track?order_id=${encodeURIComponent(searchId.trim())}&email=${encodeURIComponent(searchEmail.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No matching order found');
      }

      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Could not locate order details.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId && initialEmail) {
      fetchTracking(initialOrderId, initialEmail);
    }
  }, [initialOrderId, initialEmail]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderId, email);
  };

  const getStepStatus = (step: 'paid' | 'sent_to_printer' | 'in_production' | 'shipped' | 'delivered') => {
    if (!order) return 'upcoming';
    const statusMap: Record<string, number> = {
      pending_payment: 0,
      paid: 1,
      sent_to_printer: 2,
      in_production: 3,
      shipped: 4,
      delivered: 5
    };

    const currentLevel = statusMap[order.pod_status] ?? 1;
    const stepLevel = statusMap[step];

    if (currentLevel > stepLevel) return 'completed';
    if (currentLevel === stepLevel) return 'active';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#E4DFD5] pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">
          Fulfillment Status
        </span>
        <h1 className="font-display font-medium text-3xl text-[#17181C]">
          Track Your Book Order
        </h1>
        <p className="text-xs sm:text-sm text-[#17181C]/70">
          Enter your order reference code and email to inspect prepress, press binding, and postal carrier milestones.
        </p>
      </div>

      {/* Search Input Card */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#17181C]">
              Order Reference Number
            </label>
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ST-2026-9042"
              className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs font-mono uppercase text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#17181C]">
              Customer Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
          <div className="font-mono text-[11px] text-[#17181C]/50">
            Demo reference: <strong>ST-2026-9042</strong> with <strong>sarah.connolly@example.ie</strong>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-[#C45A2C] hover:bg-[#AD4B22] disabled:opacity-50 text-white font-medium text-xs rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Searching...' : 'Locate Order'}</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-[#F7F4EE] border border-[#C45A2C] rounded-sm text-xs text-[#C45A2C] flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Results View */}
      {order && (
        <div className="bg-white rounded-sm border border-[#E4DFD5] p-6 sm:p-8 space-y-8">
          
          {/* Order Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E4DFD5]">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Tracking Reference</span>
              <div className="font-mono font-medium text-xl text-[#17181C]">{order.id}</div>
              <div className="text-xs text-[#17181C]/70 mt-0.5">
                Recipient: <strong>{order.customer_name}</strong> · {order.shipping_address.city}, {order.shipping_address.country_code}
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-[10px] uppercase text-[#17181C]/50 block">Current Status</span>
              <span className="inline-block mt-1 px-3 py-1 bg-[#F7F4EE] text-[#C45A2C] font-mono font-semibold text-xs border border-[#E4DFD5]">
                {order.pod_status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Step Progression (Flat Editorial Cards) */}
          <div className="space-y-3">
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Fulfillment Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {[
                { key: 'paid', label: '1. Confirmed', desc: 'Payment captured' },
                { key: 'sent_to_printer', label: '2. Prepress Lab', desc: 'Files validated' },
                { key: 'in_production', label: '3. Press Binding', desc: 'Sheets printed & bound' },
                { key: 'shipped', label: '4. Dispatched', desc: 'Carrier in transit' },
                { key: 'delivered', label: '5. Delivered', desc: 'Arrived at destination' },
              ].map(step => {
                const status = getStepStatus(step.key as any);
                return (
                  <div
                    key={step.key}
                    className={`p-3 border rounded-sm transition-colors ${
                      status === 'completed'
                        ? 'bg-[#F7F4EE] border-[#17181C] text-[#17181C]'
                        : status === 'active'
                        ? 'bg-white border-[#C45A2C] text-[#C45A2C] ring-1 ring-[#C45A2C]'
                        : 'bg-[#F7F4EE]/50 border-[#E4DFD5] text-[#17181C]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] uppercase font-bold">
                        {status === 'completed' ? '✓ DONE' : status === 'active' ? '● ACTIVE' : 'PENDING'}
                      </span>
                    </div>
                    <div className="font-medium text-xs">
                      {step.label}
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5">
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Carrier Tracking Box */}
          {order.tracking_number ? (
            <div className="p-4 bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#17181C]/50 block">
                  Carrier Tracking Code
                </span>
                <div className="font-mono font-medium text-base text-[#17181C]">
                  {order.tracking_number}
                </div>
                <div className="text-xs text-[#17181C]/70">
                  Carrier: <strong>{order.carrier_name || 'Postal Network'}</strong>
                </div>
              </div>

              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#17181C] hover:bg-[#333] text-white font-medium text-xs rounded-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Carrier Tracking Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm flex items-center gap-3 text-xs text-[#17181C]/70">
              <Clock className="w-4 h-4 text-[#C45A2C] shrink-0" />
              <span>
                Your book is currently in the binding queue. Once the package is scanned by the carrier, tracking codes will appear here.
              </span>
            </div>
          )}

          {/* Activity History */}
          <div className="space-y-3 pt-4 border-t border-[#E4DFD5]">
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Log of Activity
            </h3>

            <div className="space-y-2.5">
              {(order.tracking_events || []).map((evt, idx) => (
                <div key={evt.id || idx} className="flex items-start gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C45A2C] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-[#17181C]">{evt.description}</p>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[#17181C]/50 mt-0.5">
                      <span>{new Date(evt.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                      {evt.location && <span>· {evt.location}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in this order */}
          <div className="pt-4 border-t border-[#E4DFD5] space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#17181C]/50 block">
              Contents of Package:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(order.items || []).map(item => (
                <div key={item.id} className="p-3 bg-[#F7F4EE] rounded-sm border border-[#E4DFD5] flex gap-3 text-xs">
                  {item.cover_image && (
                    <img src={item.cover_image} alt="" className="w-10 h-14 object-cover rounded-sm border border-[#E4DFD5] shrink-0" />
                  )}
                  <div>
                    <h5 className="font-medium text-[#17181C] truncate">{item.book_title}</h5>
                    <span className="text-[#17181C]/60 text-[11px] font-mono">{item.format === 'hardcover' ? 'Hardcover' : 'Paperback'} × {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
